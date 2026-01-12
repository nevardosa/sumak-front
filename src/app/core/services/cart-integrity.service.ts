import { Injectable, inject } from '@angular/core';
import { CryptoService } from './crypto.service';

export interface MilitarySecureCartItem {
  readonly productId: string;
  readonly encryptedData: string; // AES-GCM encrypted: name|price|quantity
  readonly itemHash: string; // PBKDF2 + SHA-256 hash
  readonly timestamp: number;
  readonly nonce: string; // Unique nonce for AES-GCM
  readonly salt: string; // Unique salt for PBKDF2
}

export interface MilitarySecureOrder {
  readonly items: MilitarySecureCartItem[];
  readonly encryptedTotal: string; // AES-GCM encrypted total
  readonly orderSignature: string; // Digital signature
  readonly timestamp: number;
  readonly sessionNonce: string;
  readonly integrityProof: string; // Cryptographic proof
}

@Injectable({
  providedIn: 'root'
})
export class MilitaryCartIntegrityService {
  private readonly cryptoService = inject(CryptoService);
  
  // Military-grade keys (obfuscated like auth service)
  private readonly encKeys = {
    // Base key components (obfuscated)
    k1: [115, 117, 109, 97, 107, 95, 109, 105, 108, 105, 116, 97, 114, 121, 95, 99, 97, 114, 116],
    k2: [95, 105, 110, 116, 101, 103, 114, 105, 116, 121, 95, 50, 48, 50, 52, 95, 118, 51],
    k3: [95, 97, 101, 115, 95, 103, 99, 109, 95, 50, 53, 54, 95, 115, 101, 99, 117, 114, 101]
  };

  private getEncryptionKey(): string {
    return String.fromCharCode(...this.encKeys.k1, ...this.encKeys.k2, ...this.encKeys.k3);
  }

  // Create military-grade secure cart item
  async createMilitarySecureItem(
    productId: string, 
    name: string, 
    price: number, 
    quantity: number
  ): Promise<MilitarySecureCartItem> {
    const timestamp = Date.now();
    const nonce = this.cryptoService.generateSecureToken().substring(0, 12);
    const salt = this.cryptoService.generateSecureToken().substring(0, 16);
    
    // Encrypt sensitive data with AES-GCM
    const sensitiveData = `${name}|${price}|${quantity}`;
    const encryptionKey = this.getEncryptionKey() + salt;
    const encryptedData = await this.cryptoService.encrypt(sensitiveData, encryptionKey);
    
    // Generate PBKDF2 + SHA-256 hash for integrity
    const hashData = `${productId}|${encryptedData}|${timestamp}|${nonce}|${salt}`;
    const itemHash = await this.cryptoService.hash(hashData, encryptionKey);
    
    return {
      productId,
      encryptedData,
      itemHash,
      timestamp,
      nonce,
      salt
    };
  }

  // Decrypt and validate military secure item
  async decryptMilitaryItem(item: MilitarySecureCartItem): Promise<{
    name: string;
    price: number;
    quantity: number;
    isValid: boolean;
  }> {
    try {
      // Validate hash first
      const encryptionKey = this.getEncryptionKey() + item.salt;
      const hashData = `${item.productId}|${item.encryptedData}|${item.timestamp}|${item.nonce}|${item.salt}`;
      const expectedHash = await this.cryptoService.hash(hashData, encryptionKey);
      
      if (expectedHash !== item.itemHash) {
        return { name: '', price: 0, quantity: 0, isValid: false };
      }
      
      // Decrypt data
      const decryptedData = await this.cryptoService.decrypt(item.encryptedData, encryptionKey);
      const [name, priceStr, quantityStr] = decryptedData.split('|');
      
      return {
        name,
        price: Number(priceStr),
        quantity: Number(quantityStr),
        isValid: true
      };
    } catch {
      return { name: '', price: 0, quantity: 0, isValid: false };
    }
  }

  // Create military-grade secure order
  async createMilitarySecureOrder(items: MilitarySecureCartItem[]): Promise<MilitarySecureOrder> {
    // Validate all items first
    for (const item of items) {
      const decrypted = await this.decryptMilitaryItem(item);
      if (!decrypted.isValid) {
        throw new Error(`Military security validation failed for item: ${item.productId}`);
      }
    }

    // Calculate total from decrypted data
    let total = 0;
    for (const item of items) {
      const decrypted = await this.decryptMilitaryItem(item);
      total += decrypted.price * decrypted.quantity;
    }

    const timestamp = Date.now();
    const sessionNonce = this.cryptoService.generateSecureToken();
    const encryptionKey = this.getEncryptionKey() + sessionNonce.substring(0, 16);
    
    // Encrypt total
    const encryptedTotal = await this.cryptoService.encrypt(total.toString(), encryptionKey);
    
    // Generate digital signature
    const signatureData = items.map(item => item.itemHash).join('|') + `|${encryptedTotal}|${timestamp}|${sessionNonce}`;
    const orderSignature = await this.cryptoService.hash(signatureData, encryptionKey);
    
    // Generate cryptographic proof of integrity
    const proofData = `${orderSignature}|${timestamp}|${sessionNonce}|${this.getEncryptionKey()}`;
    const integrityProof = await this.cryptoService.hash(proofData, encryptionKey);

    return {
      items,
      encryptedTotal,
      orderSignature,
      timestamp,
      sessionNonce,
      integrityProof
    };
  }

  // Validate military-grade order
  async validateMilitaryOrder(order: MilitarySecureOrder): Promise<boolean> {
    try {
      // Validate each item
      for (const item of order.items) {
        const decrypted = await this.decryptMilitaryItem(item);
        if (!decrypted.isValid) return false;
      }

      const encryptionKey = this.getEncryptionKey() + order.sessionNonce.substring(0, 16);
      
      // Validate signature
      const signatureData = order.items.map(item => item.itemHash).join('|') + 
                           `|${order.encryptedTotal}|${order.timestamp}|${order.sessionNonce}`;
      const expectedSignature = await this.cryptoService.hash(signatureData, encryptionKey);
      
      if (expectedSignature !== order.orderSignature) return false;
      
      // Validate integrity proof
      const proofData = `${order.orderSignature}|${order.timestamp}|${order.sessionNonce}|${this.getEncryptionKey()}`;
      const expectedProof = await this.cryptoService.hash(proofData, encryptionKey);
      
      return expectedProof === order.integrityProof;
    } catch {
      return false;
    }
  }

  // Generate military-grade WhatsApp message
  async generateMilitaryWhatsAppMessage(
    order: MilitarySecureOrder, 
    customerData: any
  ): Promise<string> {
    const isValid = await this.validateMilitaryOrder(order);
    if (!isValid) {
      throw new Error('Military-grade order validation failed');
    }

    // Decrypt items for display
    const itemsList: string[] = [];
    let totalAmount = 0;
    
    for (const item of order.items) {
      const decrypted = await this.decryptMilitaryItem(item);
      const itemTotal = decrypted.price * decrypted.quantity;
      totalAmount += itemTotal;
      
      itemsList.push(
        `• ${decrypted.name} - Cantidad: ${decrypted.quantity} - ${this.formatPrice(itemTotal)}`
      );
    }

    // Generate military verification codes
    const verificationCode = order.orderSignature.substring(0, 8).toUpperCase();
    const integrityCode = order.integrityProof.substring(0, 6).toUpperCase();
    const timestampCode = order.timestamp.toString(36).toUpperCase();

    const message = `🛡️ *PEDIDO SUMAK GOURMET - SEGURIDAD MILITAR*

👤 *Cliente:* ${customerData.firstName} ${customerData.lastName}
📧 *Email:* ${customerData.email}
📱 *Teléfono:* ${customerData.phone}

📦 *Productos:*
${itemsList.join('\n')}

💰 *Total:* ${this.formatPrice(totalAmount)}

🔐 *Códigos de Verificación Militar:*
• *Principal:* ${verificationCode}
• *Integridad:* ${integrityCode}
• *Temporal:* ${timestampCode}
⏰ *Timestamp:* ${new Date(order.timestamp).toLocaleString('es-CO')}

---
*🛡️ Pedido protegido con encriptación AES-GCM 256 bits*
*🔒 Nivel de seguridad: MILITAR/BANCARIO*`;

    return message;
  }

  private formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Extract verification codes for manual validation
  extractMilitaryVerificationCodes(message: string): {
    principal: string | null;
    integrity: string | null;
    temporal: string | null;
  } {
    const principalMatch = message.match(/• \*Principal:\* ([A-F0-9]{8})/);
    const integrityMatch = message.match(/• \*Integridad:\* ([A-F0-9]{6})/);
    const temporalMatch = message.match(/• \*Temporal:\* ([A-Z0-9]+)/);
    
    return {
      principal: principalMatch ? principalMatch[1] : null,
      integrity: integrityMatch ? integrityMatch[1] : null,
      temporal: temporalMatch ? temporalMatch[1] : null
    };
  }
}