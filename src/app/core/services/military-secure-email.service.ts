import { Injectable, inject, OnDestroy } from '@angular/core';
import { SecurityAuditService, SecurityEventType } from './security-audit.service';
import { EmailSecurityValidatorService } from './email-security-validator.service';
import { AdvancedSecurityService } from './advanced-security.service';
import { SecureValidators } from '../../shared/validators/secure-validators';
import { environment } from '../../../environments/environment';
import emailjs from '@emailjs/browser';

interface SecureEmailPayload {
  readonly encryptedData: string;
  readonly keyFingerprint: string;
  readonly signature: string;
  readonly timestamp: number;
  readonly nonce: string;
  readonly iv: string;
}

interface EmailData {
  readonly to: string;
  readonly subject: string;
  readonly csvContent: string;
  readonly customerInfo: string;
  readonly orderTotal: number;
}

interface CryptoKeys {
  readonly encryptionKey: CryptoKey;
  readonly signingKey: CryptoKey;
  readonly keyFingerprint: string;
}

@Injectable({
  providedIn: 'root'
})
export class MilitarySecureEmailService implements OnDestroy {
  private readonly auditService = inject(SecurityAuditService);
  private readonly securityValidator = inject(EmailSecurityValidatorService);
  private readonly advancedSecurity = inject(AdvancedSecurityService);
  
  private readonly ADMIN_EMAIL: string;
  private readonly SERVICE_ID: string;
  private readonly TEMPLATE_ID: string;
  private readonly PUBLIC_KEY: string;
  
  private readonly MAX_EMAIL_SIZE = 2 * 1024 * 1024;
  private readonly TIMEOUT_MS = 15000;
  private readonly MAX_RETRIES = 2;
  
  private cryptoKeys: CryptoKeys | null = null;
  private clientIP: string | null = null;

  constructor() {
    if (!environment.emailjs?.serviceId || !environment.emailjs?.templateId) {
      throw new Error('Configuracion EmailJS incompleta');
    }
    
    this.ADMIN_EMAIL = environment.emailjs?.adminEmail || 'suumak25@gmail.com';
    this.SERVICE_ID = environment.emailjs.serviceId;
    this.TEMPLATE_ID = environment.emailjs.templateId;
    this.PUBLIC_KEY = environment.emailjs.publicKey;
    
    // Check if in development mode
    if (this.PUBLIC_KEY === 'DEVELOPMENT_MODE' || this.PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.warn('⚠️ EmailJS en modo desarrollo - Los emails no se enviarán realmente');
      console.info('📧 Para recibir emails reales, configura EmailJS con credenciales válidas');
      console.info('🔗 Visita: https://www.emailjs.com/ para configurar tu cuenta');
    }
    
    // Enforce CSP and security measures
    this.advancedSecurity.enforceCSP();
    
    // Auto-cleanup every 5 minutes
    setInterval(() => this.advancedSecurity.cleanup(), 5 * 60 * 1000);
  }

  ngOnDestroy(): void {
    this.clearAllSecureData();
  }

  async sendOrderEmail(csvContent: string, customerData: any, orderTotal: number): Promise<void> {
    const startTime = performance.now();
    const clientIP = await this.getClientIPWithTimeout();
    
    try {
      // Rate limiting check
      if (!this.advancedSecurity.checkRateLimit(clientIP)) {
        throw new Error('Rate limit exceeded. Try again later.');
      }
      
      // Attack detection
      if (this.advancedSecurity.detectAttack({ csvContent, customerData, orderTotal })) {
        await this.auditService.logSecurityEvent(
          SecurityEventType.UNAUTHORIZED_ACCESS,
          'CRITICAL',
          { reason: 'Attack pattern detected', ip: clientIP }
        );
        throw new Error('Security violation detected');
      }
      
      // Anomaly detection
      const anomalies = this.advancedSecurity.detectAnomalies({ csvContent, customerData, orderTotal });
      if (anomalies.length > 0) {
        await this.auditService.logSecurityEvent(
          SecurityEventType.UNAUTHORIZED_ACCESS,
          'HIGH',
          { anomalies, ip: clientIP }
        );
        throw new Error(`Security anomalies detected: ${anomalies.join(', ')}`);
      }
      
      // SSL validation con manejo mejorado
      const sslValid = await this.advancedSecurity.validateSSLConnection('https://api.emailjs.com');
      if (!sslValid) {
        console.warn('SSL validation failed, but continuing in development mode');
        // En desarrollo, continuar aunque SSL falle
        if (!window.location.hostname.includes('localhost')) {
          throw new Error('SSL validation failed for EmailJS service');
        }
      }
      
      const securityValidation = this.securityValidator.validateEmailSecurity(csvContent, customerData);
      if (!securityValidation.isValid) {
        throw new Error(`Validacion de seguridad fallo: ${securityValidation.errors.join(', ')}`);
      }
      
      if (securityValidation.securityScore < 8.0) {
        throw new Error(`Puntuacion de seguridad insuficiente: ${securityValidation.securityScore}/10`);
      }
      
      if (!this.cryptoKeys) {
        this.cryptoKeys = await this.initializeCryptoKeys();
        // Store keys securely with TTL
        this.advancedSecurity.secureMemoryStore('crypto_keys', this.cryptoKeys, 300000);
      }
      
      const emailData = this.prepareSecureEmailData(csvContent, customerData, orderTotal);
      const securePayload = await this.encryptEmailPayload(emailData);
      
      // Integrity check
      const integrityHash = await this.advancedSecurity.calculateIntegrityHash(JSON.stringify(securePayload));
      
      await this.sendSecureEmailWithRetry(securePayload, integrityHash);
      await this.logSuccessAudit(orderTotal, performance.now() - startTime, securityValidation.securityScore);
      
      // Clear sensitive data immediately
      this.clearCryptoKeys();
      
    } catch (error) {
      await this.handleEmailError(error, performance.now() - startTime);
      this.clearCryptoKeys();
      throw error;
    }
  }

  private prepareSecureEmailData(csvContent: string, customerData: any, orderTotal: number): EmailData {
    // Sanitize all inputs
    const sanitizedFirstName = this.advancedSecurity.sanitizeInput(customerData.firstName || '');
    const sanitizedLastName = this.advancedSecurity.sanitizeInput(customerData.lastName || '');
    const sanitizedEmail = this.advancedSecurity.sanitizeInput(customerData.email || '');
    
    const customerInfo = `${sanitizedFirstName} ${sanitizedLastName} - ${sanitizedEmail}`;
    
    return {
      to: this.ADMIN_EMAIL,
      subject: `[SUMAK SEGURO] Pedido ${new Date().toISOString().split('T')[0]}`,
      csvContent: this.advancedSecurity.sanitizeInput(csvContent),
      customerInfo,
      orderTotal: Math.max(0, Number(orderTotal) || 0)
    };
  }

  private async initializeCryptoKeys(): Promise<CryptoKeys> {
    try {
      const masterKey = await this.deriveMasterKey();
      const encryptionKey = await this.deriveKey(masterKey, 'encryption', ['encrypt']);
      const signingKey = await this.deriveKey(masterKey, 'signing', ['sign']);
      const keyFingerprint = await this.generateKeyFingerprint(encryptionKey);
      
      return { encryptionKey, signingKey, keyFingerprint };
    } catch (error) {
      throw new Error(`Error inicializando claves criptograficas: ${error}`);
    }
  }

  private async deriveMasterKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = encoder.encode(
      `${environment.appName}-${environment.version}-${this.ADMIN_EMAIL}-SUMAK-SECURE-2024`
    );
    
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyMaterial,
      'PBKDF2',
      false,
      ['deriveKey']
    );
    
    const salt = encoder.encode('SUMAK-MILITARY-SALT-2024');
    
    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      { name: 'HKDF', length: 256 },
      false,
      ['deriveKey']
    );
  }

  private async deriveKey(masterKey: CryptoKey, purpose: string, keyUsages: KeyUsage[]): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const info = encoder.encode(`SUMAK-${purpose.toUpperCase()}-2024`);
    
    const keySpec = purpose === 'encryption' 
      ? { name: 'AES-GCM', length: 256 }
      : { name: 'HMAC', hash: 'SHA-256' };
    
    return await crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        hash: 'SHA-256',
        salt: new Uint8Array(32),
        info
      },
      masterKey,
      keySpec,
      false,
      keyUsages
    );
  }

  private async generateKeyFingerprint(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    const hash = await crypto.subtle.digest('SHA-256', exported);
    return btoa(String.fromCharCode(...new Uint8Array(hash))).substring(0, 16);
  }

  private async encryptEmailPayload(emailData: EmailData): Promise<SecureEmailPayload> {
    if (!this.cryptoKeys) {
      throw new Error('Claves criptograficas no inicializadas');
    }
    
    try {
      const timestamp = Date.now();
      const nonce = this.generateSecureNonce();
      
      const payload = JSON.stringify({
        ...emailData,
        timestamp,
        nonce
      });
      
      const { encryptedData, iv } = await this.encryptAESGCM(payload, this.cryptoKeys.encryptionKey);
      const signature = await this.generateHMACSignature(encryptedData, timestamp, nonce, this.cryptoKeys.signingKey);
      
      return {
        encryptedData,
        keyFingerprint: this.cryptoKeys.keyFingerprint,
        signature,
        timestamp,
        nonce,
        iv
      };
    } catch (error) {
      throw new Error(`Error en encriptacion: ${error}`);
    }
  }

  private async encryptAESGCM(data: string, key: CryptoKey): Promise<{ encryptedData: string; iv: string }> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    return {
      encryptedData: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
      iv: btoa(String.fromCharCode(...iv))
    };
  }

  private async generateHMACSignature(data: string, timestamp: number, nonce: string, key: CryptoKey): Promise<string> {
    const encoder = new TextEncoder();
    const message = encoder.encode(`${data}|${timestamp}|${nonce}`);
    
    const signature = await crypto.subtle.sign('HMAC', key, message);
    return btoa(String.fromCharCode(...new Uint8Array(signature)));
  }

  private generateSecureNonce(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private async sendSecureEmailWithRetry(payload: SecureEmailPayload, integrityHash: string): Promise<void> {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
      try {
        await this.sendSecureEmail(payload, attempt, integrityHash);
        return;
      } catch (error) {
        lastError = error as Error;
        if (attempt < this.MAX_RETRIES) {
          // Exponential backoff with jitter
          const delay = (1000 * Math.pow(2, attempt)) + Math.random() * 1000;
          await this.delay(delay);
        }
      }
    }
    
    throw new Error(`Error enviando email despues de ${this.MAX_RETRIES} intentos: ${lastError?.message}`);
  }

  private async sendSecureEmail(payload: SecureEmailPayload, attempt: number, integrityHash: string): Promise<void> {
    // Check if in development mode
    if (this.PUBLIC_KEY === 'DEVELOPMENT_MODE' || this.PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
      console.log('📧 MODO DESARROLLO - Simulando envío de email:');
      console.log('📮 Destinatario:', this.ADMIN_EMAIL);
      console.log('📝 Datos del pedido (encriptados):', {
        keyFingerprint: payload.keyFingerprint,
        timestamp: new Date(payload.timestamp).toLocaleString('es-CO'),
        attempt,
        integrityHash: integrityHash.substring(0, 16) + '...'
      });
      console.log('✅ Email simulado enviado exitosamente');
      
      // Simulate network delay
      await this.delay(1000 + Math.random() * 2000);
      return;
    }
    
    const templateParams = {
      to_email: this.ADMIN_EMAIL,
      subject: '[SUMAK] Nuevo Pedido Seguro',
      encrypted_data: payload.encryptedData,
      key_fingerprint: payload.keyFingerprint,
      signature: payload.signature,
      timestamp: payload.timestamp.toString(),
      nonce: payload.nonce,
      iv: payload.iv,
      attempt: attempt.toString(),
      security_level: 'MILITARY',
      integrity_hash: integrityHash
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT_MS);
    
    try {
      // Validate payload size
      const payloadSize = JSON.stringify(templateParams).length;
      if (payloadSize > this.MAX_EMAIL_SIZE) {
        throw new Error(`Payload too large: ${payloadSize} bytes`);
      }
      
      await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async getClientIPWithTimeout(): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    try {
      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal
      });
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async logSuccessAudit(orderTotal: number, duration: number, securityScore: number): Promise<void> {
    try {
      await this.auditService.logSecurityEvent(
        SecurityEventType.MILITARY_EMAIL_SENT,
        'MEDIUM',
        {
          recipient: this.ADMIN_EMAIL,
          orderTotal,
          duration: Math.round(duration),
          securityScore,
          keyFingerprint: this.cryptoKeys?.keyFingerprint,
          timestamp: Date.now()
        }
      );
    } catch (error) {
      console.warn('Error en auditoria de exito:', error);
    }
  }

  private async handleEmailError(error: any, duration: number): Promise<void> {
    try {
      await this.auditService.logSecurityEvent(
        SecurityEventType.MILITARY_EMAIL_ERROR,
        'HIGH',
        {
          error: error?.message || 'Error desconocido',
          duration: Math.round(duration),
          timestamp: Date.now()
        }
      );
    } catch (auditError) {
      console.warn('Error en auditoria de error:', auditError);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private clearCryptoKeys(): void {
    if (this.cryptoKeys) {
      // Overwrite keys with random data
      this.cryptoKeys = {
        encryptionKey: null as any,
        signingKey: null as any,
        keyFingerprint: this.advancedSecurity.generateSecureToken(16)
      };
      this.cryptoKeys = null;
      
      // Clear from secure memory
      this.advancedSecurity.secureMemoryDelete('crypto_keys');
      
      // Force garbage collection hint
      if ((window as any).gc) {
        (window as any).gc();
      }
    }
  }

  private clearAllSecureData(): void {
    this.clearCryptoKeys();
    this.clientIP = null;
    this.advancedSecurity.cleanup();
  }
}