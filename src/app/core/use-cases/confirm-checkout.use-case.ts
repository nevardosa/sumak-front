import { Injectable, inject } from '@angular/core';
import { CartService } from '../../features/catalog/services/cart.service';
import { OrderExportService } from '../../features/catalog/services/order-export.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { PdfStorageService } from '../services/pdf-storage.service';
import { CheckoutAnalyticsService } from '../services/checkout-analytics.service';
import { CustomerData } from '../../features/catalog/models/catalog.models';

export interface CheckoutResult {
  success: boolean;
  pdfUrl?: string;
  pdfFilename?: string;
  pdfBase64?: string;
  whatsappMessage?: string;
  error?: string;
}

export interface CheckoutStatus {
  step: 'validating' | 'generating_pdf' | 'uploading_pdf' | 'opening_whatsapp' | 'completed' | 'error';
  message: string;
  progress: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmCheckoutUseCase {
  private readonly cartService = inject(CartService);
  private readonly orderExport = inject(OrderExportService);
  private readonly whatsappService = inject(WhatsAppService);
  private readonly pdfStorage = inject(PdfStorageService);
  private readonly analytics = inject(CheckoutAnalyticsService);

  /**
   * Ejecuta el flujo completo de checkout premium
   * 1. Valida integridad del carrito
   * 2. Genera PDF
   * 3. Descarga PDF (mantiene flujo actual)
   * 4. Sube PDF y obtiene URL segura
   * 5. Construye mensaje WhatsApp con link
   * 6. Abre WhatsApp
   * 7. Emite eventos analytics
   */
  async execute(
    customerData: CustomerData,
    onStatusChange?: (status: CheckoutStatus) => void
  ): Promise<CheckoutResult> {
    try {
      // PASO 1: Validar integridad
      onStatusChange?.({
        step: 'validating',
        message: 'Validando tu pedido...',
        progress: 10
      });

      const isValid = await this.cartService.validateMilitaryCartIntegrity();
      if (!isValid) {
        throw new Error('Error de integridad en el carrito');
      }

      this.analytics.track('checkout_confirm_clicked');

      // PASO 2: Generar PDF
      onStatusChange?.({
        step: 'generating_pdf',
        message: 'Preparando tu soporte...',
        progress: 30
      });

      const cart = this.cartService.cart();
      const pdfResult = await this.orderExport.exportOrderToPDF({
        customer: customerData,
        cart
      });

      this.analytics.track('pdf_generated', {
        order_number: pdfResult.orderNumber
      });

      // PASO 3: Descargar PDF (mantiene flujo actual)
      this.orderExport.downloadPDF(pdfResult.pdfBase64, pdfResult.filename);
      this.analytics.track('pdf_downloaded');

      // PASO 4: Subir PDF y obtener URL segura
      onStatusChange?.({
        step: 'uploading_pdf',
        message: 'Generando link seguro...',
        progress: 60
      });

      const pdfUrl = await this.pdfStorage.uploadPdfAndGetSecureUrl(
        pdfResult.pdfBase64,
        pdfResult.orderNumber
      );

      this.analytics.track('pdf_link_created');

      // PASO 5: Construir mensaje WhatsApp premium con link
      const whatsappMessage = this.buildPremiumWhatsAppMessage(
        customerData,
        cart,
        pdfUrl,
        pdfResult.orderNumber
      );

      // PASO 6: Abrir WhatsApp
      onStatusChange?.({
        step: 'opening_whatsapp',
        message: 'Abriendo WhatsApp...',
        progress: 90
      });

      this.whatsappService.openWhatsAppOrder(whatsappMessage, 'secure_checkout');
      this.analytics.track('whatsapp_opened');

      // PASO 7: Completado
      onStatusChange?.({
        step: 'completed',
        message: 'Pedido enviado exitosamente',
        progress: 100
      });

      this.analytics.track('checkout_completed_intent', {
        order_number: pdfResult.orderNumber,
        total: cart.total
      });

      return {
        success: true,
        pdfUrl,
        pdfFilename: pdfResult.filename,
        pdfBase64: pdfResult.pdfBase64,
        whatsappMessage
      };

    } catch (error) {
      this.analytics.track('checkout_error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      onStatusChange?.({
        step: 'error',
        message: 'Error al procesar el pedido',
        progress: 0
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Construye mensaje premium para WhatsApp con link del PDF
   */
  private buildPremiumWhatsAppMessage(
    customer: CustomerData,
    cart: any,
    pdfUrl: string,
    orderNumber: string
  ): string {
    const items = cart.items
      .map((item: any) => `• ${item.product.name} (x${item.quantity})`)
      .join('\n');

    const total = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(cart.total);

    return `🌿 *PEDIDO SUMAK GOURMET*

📋 *Orden:* ${orderNumber}

👤 *Cliente:*
${customer.firstName} ${customer.lastName}
${customer.email}
${customer.phone}

📍 *Entrega:*
${customer.address}
${customer.municipality}, ${customer.department}

🛍️ *Productos:*
${items}

💰 *Total:* ${total}

💳 *Instrucciones de Pago:*
Realiza tu transferencia a:
• Cuenta Bre-B: @DAVISUMAK
• Adjunta comprobante de pago

📎 *Soporte del Pedido (PDF):*
${pdfUrl}

✨ Gracias por confiar en Sumak Gourmet`;
  }

  /**
   * Copia mensaje al portapapeles (fallback si WhatsApp falla)
   */
  async copyMessageToClipboard(message: string): Promise<boolean> {
    try {
      await navigator.clipboard.writeText(message);
      this.analytics.track('whatsapp_message_copied');
      return true;
    } catch {
      return false;
    }
  }
}
