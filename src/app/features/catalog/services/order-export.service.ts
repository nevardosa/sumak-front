import { Injectable } from '@angular/core';
import { CheckoutData } from '../models/catalog.models';
import { SecureValidators } from '../../../shared/validators/secure-validators';
import { MilitarySecureEmailService } from '../../../core/services/military-secure-email.service';
import { SecurePdfGeneratorService } from '../../../shared/services/secure-pdf-generator.service';
import { AdvancedSecurityService } from '../../../core/services/advanced-security.service';
import { SecurityAuditService, SecurityEventType } from '../../../core/services/security-audit.service';

@Injectable({
  providedIn: 'root'
})
export class OrderExportService {
  constructor(
    private militaryEmailService: MilitarySecureEmailService,
    private pdfGenerator: SecurePdfGeneratorService,
    private advancedSecurity: AdvancedSecurityService,
    private auditService: SecurityAuditService
  ) {}

  async exportOrderToPDF(checkoutData: CheckoutData): Promise<void> {
    try {
      if (!this.validateCheckoutData(checkoutData)) {
        throw new Error('Datos de pedido inválidos');
      }

      const pdfResult = await this.pdfGenerator.generateSecureOrderPdf(
        checkoutData.cart,
        checkoutData.customer
      );
      
      this.downloadPdfFile(pdfResult.pdfBase64, this.generateSecurePdfFilename());
      
      this.sendOrderBySecureEmail(pdfResult.pdfBase64, checkoutData).catch(() => {
        // Email failure is non-blocking
      });
      
      (checkoutData as any).orderNumber = pdfResult.orderNumber;
      
    } catch (error) {
      throw new Error('Error al generar pedido en PDF');
    }
  }

  private validateCheckoutData(data: CheckoutData): boolean {
    // Enhanced validation with security checks
    if (!data || typeof data !== 'object') return false;
    
    // Rate limiting check
    if (!this.advancedSecurity.checkRateLimit('order_export')) {
      throw new Error('Export rate limit exceeded');
    }
    
    // Attack detection
    if (this.advancedSecurity.detectAttack(data)) {
      throw new Error('Security violation detected in order data');
    }
    
    return !!(
      data?.customer?.firstName &&
      data?.customer?.lastName &&
      data?.customer?.email &&
      data?.customer?.phone &&
      data?.cart?.items?.length &&
      typeof data.cart.total === 'number' &&
      data.cart.total > 0
    );
  }

  private generateSecurePdfFilename(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    const secureToken = this.advancedSecurity.generateSecureToken(8);
    return `Pedido_Sumak_${dateStr}_${timeStr}_${secureToken}.pdf`;
  }

  private downloadPdfFile(pdfBase64: string, filename: string): void {
    try {
      // Validate inputs
      if (!pdfBase64 || typeof pdfBase64 !== 'string') {
        throw new Error('PDF data invalid');
      }
      
      if (!filename || !filename.endsWith('.pdf')) {
        throw new Error('Invalid PDF filename');
      }
      
      // Sanitize filename
      const sanitizedFilename = this.advancedSecurity.sanitizeInput(filename)
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 100);
      
      // Convert base64 to blob
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      
      // Validate blob size (max 50MB)
      if (blob.size > 50 * 1024 * 1024) {
        throw new Error('PDF file too large');
      }
      
      // Create secure download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', sanitizedFilename);
      link.setAttribute('rel', 'noopener noreferrer');
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up immediately
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw new Error('Error al descargar PDF');
    }
  }

  private async sendOrderBySecureEmail(pdfBase64: string, checkoutData: CheckoutData): Promise<void> {
    try {
      // Convert PDF to secure format for email
      const emailContent = this.createEmailContent(pdfBase64, checkoutData);
      
      await this.militaryEmailService.sendOrderEmail(
        emailContent,
        checkoutData.customer,
        checkoutData.cart.total
      );
    } catch (error) {
      console.error('Error sending secure email:', error);
      throw error;
    }
  }

  private createEmailContent(pdfBase64: string, checkoutData: CheckoutData): string {
    const orderSummary = {
      timestamp: new Date().toISOString(),
      orderId: this.generateOrderId(),
      customer: {
        name: `${checkoutData.customer.firstName} ${checkoutData.customer.lastName}`,
        email: checkoutData.customer.email,
        phone: checkoutData.customer.phone
      },
      items: checkoutData.cart.items.map(item => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity
      })),
      total: checkoutData.cart.total,
      pdfAttachment: pdfBase64.substring(0, 1000) + '...[PDF_TRUNCATED]' // Only preview for email
    };
    
    return JSON.stringify(orderSummary, null, 2);
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const secureRandom = this.advancedSecurity.generateSecureToken(6);
    return `SUM-${timestamp}-${secureRandom}`.toUpperCase();
  }
}