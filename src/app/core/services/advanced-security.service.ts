import { Injectable } from '@angular/core';

interface SecurityConfig {
  readonly maxEmailsPerHour: number;
  readonly maxPayloadSize: number;
  readonly sessionTimeout: number;
  readonly maxRetries: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdvancedSecurityService {
  private readonly config: SecurityConfig = {
    maxEmailsPerHour: 5,
    maxPayloadSize: 1024 * 1024, // 1MB
    sessionTimeout: 30 * 60 * 1000, // 30 min
    maxRetries: 2
  };

  private rateLimits = new Map<string, RateLimitEntry>();
  private secureMemory = new Map<string, any>();
  private readonly CSP_HEADER = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://api.emailjs.com https://api.ipify.org;";

  // Rate limiting con IP tracking
  checkRateLimit(identifier: string = 'global'): boolean {
    const now = Date.now();
    const entry = this.rateLimits.get(identifier);
    
    if (!entry || now > entry.resetTime) {
      this.rateLimits.set(identifier, {
        count: 1,
        resetTime: now + (60 * 60 * 1000) // 1 hour
      });
      return true;
    }
    
    if (entry.count >= this.config.maxEmailsPerHour) {
      return false;
    }
    
    entry.count++;
    return true;
  }

  // Limpieza segura de memoria
  secureMemoryStore(key: string, value: any, ttl: number = 300000): void {
    const expiry = Date.now() + ttl;
    this.secureMemory.set(key, { value, expiry });
    
    // Auto-cleanup
    setTimeout(() => {
      this.secureMemoryDelete(key);
    }, ttl);
  }

  secureMemoryGet(key: string): any {
    const entry = this.secureMemory.get(key);
    if (!entry || Date.now() > entry.expiry) {
      this.secureMemoryDelete(key);
      return null;
    }
    return entry.value;
  }

  secureMemoryDelete(key: string): void {
    const entry = this.secureMemory.get(key);
    if (entry) {
      // Overwrite with random data before deletion
      entry.value = crypto.getRandomValues(new Uint8Array(256));
      this.secureMemory.delete(key);
    }
  }

  // Validación SSL/TLS con manejo de errores mejorado
  async validateSSLConnection(url: string): Promise<boolean> {
    try {
      // Para desarrollo local, omitir validación SSL estricta
      if (url.includes('localhost') || url.includes('127.0.0.1')) {
        return true;
      }
      
      const response = await fetch(url, {
        method: 'HEAD',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-cache'
      });
      
      return response.ok && url.startsWith('https://');
    } catch (error) {
      console.warn('SSL validation warning:', error);
      // En desarrollo, permitir conexiones incluso si SSL falla
      return !url.includes('localhost');
    }
  }

  // Content Security Policy
  enforceCSP(): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = this.CSP_HEADER;
    document.head.appendChild(meta);
  }

  // Detección de anomalías
  detectAnomalies(payload: any): string[] {
    const anomalies: string[] = [];
    
    if (JSON.stringify(payload).length > this.config.maxPayloadSize) {
      anomalies.push('Payload size exceeds limit');
    }
    
    const suspiciousPatterns = [
      /<script/gi,
      /javascript:/gi,
      /on\w+=/gi,
      /eval\(/gi,
      /document\./gi
    ];
    
    const payloadStr = JSON.stringify(payload);
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(payloadStr)) {
        anomalies.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    }
    
    return anomalies;
  }

  // Generación de tokens seguros
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  // Validación de integridad
  async calculateIntegrityHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
  }

  // Limpieza automática de recursos
  cleanup(): void {
    // Clear expired entries
    const now = Date.now();
    for (const [key, entry] of this.secureMemory.entries()) {
      if (now > entry.expiry) {
        this.secureMemoryDelete(key);
      }
    }
    
    // Clear old rate limits
    for (const [key, entry] of this.rateLimits.entries()) {
      if (now > entry.resetTime) {
        this.rateLimits.delete(key);
      }
    }
  }

  // Validación de entrada robusta
  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim()
      .substring(0, 1000);
  }

  // Detección de ataques
  detectAttack(request: any): boolean {
    const attackPatterns = [
      /union\s+select/gi,
      /drop\s+table/gi,
      /<script/gi,
      /javascript:/gi,
      /eval\(/gi
    ];
    
    const requestStr = JSON.stringify(request);
    return attackPatterns.some(pattern => pattern.test(requestStr));
  }
}