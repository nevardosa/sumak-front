import { Injectable, inject } from '@angular/core';
import { AdvancedSecurityService } from '../../core/services/advanced-security.service';
import { SecurityAuditService, SecurityEventType } from '../../core/services/security-audit.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface OrderData {
  readonly orderNumber: string;
  readonly date: string;
  readonly customer: CustomerInfo;
  readonly items: OrderItem[];
  readonly totals: OrderTotals;
  readonly delivery: DeliveryInfo;
}

interface CustomerInfo {
  readonly fullName: string;
  readonly identificationType: string;
  readonly identificationNumber: string;
  readonly email: string;
  readonly phone: string;
}

interface OrderItem {
  readonly name: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
  readonly description?: string;
}

interface OrderTotals {
  readonly subtotal: number;
  readonly tax: number;
  readonly total: number;
  readonly itemCount: number;
}

interface DeliveryInfo {
  readonly address: string;
  readonly department: string;
  readonly municipality: string;
  readonly additionalInfo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SecurePdfGeneratorService {
  private readonly advancedSecurity = inject(AdvancedSecurityService);
  private readonly auditService = inject(SecurityAuditService);

  private readonly SUMAK_COLORS = {
    primary: '#2D5016',      // Verde Sumak
    secondary: '#4A7C59',    // Verde claro
    accent: '#8FBC8F',       // Verde suave
    text: '#1F2937',         // Gris oscuro
    textLight: '#6B7280',    // Gris medio
    background: '#F9FAFB',   // Gris muy claro
    white: '#FFFFFF'
  };

  async generateSecureOrderPdf(orderData: any, customerData: any): Promise<{pdfBase64: string, orderNumber: string}> {
    const startTime = performance.now();

    try {
      console.log('Starting PDF generation with data:', { orderData, customerData });

      // Security validations
      await this.validateInputs(orderData, customerData);

      // Sanitize and structure data
      const sanitizedData = this.sanitizeOrderData(orderData, customerData);
      console.log('Data sanitized successfully:', sanitizedData);

      // Generate PDF
      const pdfBase64 = await this.createPdfDocument(sanitizedData);
      console.log('PDF generated successfully, size:', pdfBase64.length);

      // Security audit
      await this.auditService.logSecurityEvent(
        SecurityEventType.PDF_GENERATED,
        'MEDIUM',
        {
          action: 'PDF_GENERATED',
          orderNumber: sanitizedData.orderNumber,
          itemCount: sanitizedData.totals.itemCount,
          duration: performance.now() - startTime
        }
      );

      return {
        pdfBase64,
        orderNumber: sanitizedData.orderNumber
      };

    } catch (error) {
      console.error('PDF generation error:', error);
      await this.auditService.logSecurityEvent(
        SecurityEventType.PDF_GENERATION_FAILED,
        'HIGH',
        {
          action: 'PDF_GENERATION_FAILED',
          error: (error as Error).message,
          duration: performance.now() - startTime
        }
      );
      throw new Error(`Error generando PDF: ${(error as Error).message}`);
    }
  }

  private async validateInputs(orderData: any, customerData: any): Promise<void> {
    try {
      // Rate limiting
      if (!this.advancedSecurity.checkRateLimit('pdf_generation')) {
        throw new Error('PDF generation rate limit exceeded');
      }

      // Attack detection
      if (this.advancedSecurity.detectAttack({ orderData, customerData })) {
        throw new Error('Security violation detected in PDF data');
      }

      // Anomaly detection
      const anomalies = this.advancedSecurity.detectAnomalies({ orderData, customerData });
      if (anomalies.length > 0) {
        console.warn('PDF data anomalies detected:', anomalies);
      }

      // Data validation with better error messages
      if (!orderData) {
        throw new Error('Order data is required');
      }

      if (!orderData.items || !Array.isArray(orderData.items)) {
        throw new Error('Order items must be an array');
      }

      if (orderData.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      if (!customerData) {
        throw new Error('Customer data is required');
      }

      if (!customerData.firstName || !customerData.email) {
        throw new Error('Customer name and email are required');
      }

      console.log('Input validation passed successfully');

    } catch (error) {
      console.error('Input validation failed:', error);
      throw error;
    }
  }

  private sanitizeOrderData(orderData: any, customerData: any): OrderData {
    try {
      console.log('Sanitizing order data...');

      const orderNumber = this.generateSecureOrderNumber();
      const currentDate = new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const sanitizedData: OrderData = {
        orderNumber,
        date: currentDate,
        customer: {
          fullName: this.advancedSecurity.sanitizeInput(`${customerData.firstName || ''} ${customerData.lastName || ''}`).trim(),
          identificationType: this.advancedSecurity.sanitizeInput(customerData.identificationType || 'N/A'),
          identificationNumber: this.advancedSecurity.sanitizeInput(customerData.identificationNumber || 'N/A'),
          email: this.advancedSecurity.sanitizeInput(customerData.email || ''),
          phone: this.advancedSecurity.sanitizeInput(customerData.phone || 'N/A')
        },
        items: orderData.items.map((item: any, index: number) => {
          try {
            return {
              name: this.advancedSecurity.sanitizeInput(item.product?.name || `Producto ${index + 1}`),
              quantity: Math.max(1, parseInt(item.quantity) || 1),
              unitPrice: Math.max(0, parseFloat(item.product?.price) || 0),
              totalPrice: Math.max(0, (parseFloat(item.product?.price) || 0) * (parseInt(item.quantity) || 1)),
              description: this.advancedSecurity.sanitizeInput(item.product?.description || '')
            };
          } catch (itemError) {
            console.warn(`Error processing item ${index}:`, itemError);
            return {
              name: `Producto ${index + 1}`,
              quantity: 1,
              unitPrice: 0,
              totalPrice: 0,
              description: ''
            };
          }
        }),
        totals: this.calculateTotals(orderData.items),
        delivery: {
          address: this.buildFullAddress(customerData),
          department: this.advancedSecurity.sanitizeInput(customerData.department || 'N/A'),
          municipality: this.advancedSecurity.sanitizeInput(customerData.municipality || 'N/A'),
          additionalInfo: this.advancedSecurity.sanitizeInput(customerData.additionalInfo || '')
        }
      };

      console.log('Data sanitization completed successfully');
      return sanitizedData;

    } catch (error) {
      console.error('Error sanitizing order data:', error);
      throw new Error(`Error procesando datos del pedido: ${(error as Error).message}`);
    }
  }

  private async createPdfDocument(data: OrderData): Promise<string> {
    try {
      console.log('Creating PDF document...');

      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      console.log('PDF initialized, page dimensions:', { pageWidth, pageHeight });

      // Set fonts and colors
      doc.setFont('helvetica');

      // Header with Sumak branding
      this.addHeader(doc, pageWidth);
      console.log('Header added');

      // Order information
      this.addOrderInfo(doc, data, pageWidth);
      console.log('Order info added');

      // Customer information
      this.addCustomerInfo(doc, data, pageWidth);
      console.log('Customer info added');

      // Items table
      this.addItemsTable(doc, data);
      console.log('Items table added');

      // Totals section
      this.addTotalsSection(doc, data, pageWidth);
      console.log('Totals section added');

      // Delivery information
      this.addDeliveryInfo(doc, data, pageWidth);
      console.log('Delivery info added');

      // Footer
      this.addFooter(doc, pageWidth, pageHeight);
      console.log('Footer added');

      // Security watermark
      this.addSecurityWatermark(doc, pageWidth, pageHeight);
      console.log('Security watermark added');

      const pdfOutput = doc.output('datauristring');
      const base64Data = pdfOutput.split(',')[1];

      console.log('PDF document created successfully, base64 length:', base64Data.length);
      return base64Data;

    } catch (error) {
      console.error('Error creating PDF document:', error);
      throw new Error(`Error creando documento PDF: ${(error as Error).message}`);
    }
  }

  private addHeader(doc: jsPDF, pageWidth: number): void {
    // Background header
    doc.setFillColor(45, 80, 22); // Sumak green
    doc.rect(0, 0, pageWidth, 35, 'F');

    // Logo placeholder and title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMAK', 20, 20);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Experiencias Gourmet Únicas', 20, 28);

    // Order title
    doc.setTextColor(45, 80, 22);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDEN DE PEDIDO', pageWidth - 20, 50, { align: 'right' });
  }

  private addOrderInfo(doc: jsPDF, data: OrderData, pageWidth: number): void {
    const startY = 60;

    // Order details box
    doc.setDrawColor(74, 124, 89);
    doc.setLineWidth(0.5);
    doc.rect(pageWidth - 80, startY, 70, 25);

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Número de Pedido:', pageWidth - 75, startY + 8);
    doc.setFont('helvetica', 'normal');
    doc.text(data.orderNumber, pageWidth - 75, startY + 15);

    doc.setFont('helvetica', 'bold');
    doc.text('Fecha:', pageWidth - 75, startY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(data.date, pageWidth - 75, startY + 29, { maxWidth: 65 });
  }

  private addCustomerInfo(doc: jsPDF, data: OrderData, pageWidth: number): void {
    const startY = 95;

    doc.setTextColor(45, 80, 22);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', 20, startY);

    doc.setTextColor(31, 41, 55);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const customerInfo = [
      ['Nombre Completo:', data.customer.fullName],
      ['Tipo de Identificación:', data.customer.identificationType],
      ['Número de Identificación:', data.customer.identificationNumber],
      ['Correo Electrónico:', data.customer.email],
      ['Teléfono:', data.customer.phone]
    ];

    let yPos = startY + 10;
    customerInfo.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 70, yPos);
      yPos += 7;
    });
  }

  private addItemsTable(doc: jsPDF, data: OrderData): void {
    try {
      const startY = 145;

      doc.setTextColor(45, 80, 22);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('PRODUCTOS SOLICITADOS', 20, startY);

      const tableData = data.items.map(item => [
        item.name || 'Producto',
        (item.quantity || 1).toString(),
        this.formatCurrency(item.unitPrice || 0),
        this.formatCurrency(item.totalPrice || 0)
      ]);

      autoTable(doc, {
        startY: startY + 5,
        head: [['Producto', 'Cantidad', 'Precio Unitario', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: {
          fillColor: [74, 124, 89],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 10
        },
        bodyStyles: {
          fontSize: 9,
          textColor: [31, 41, 55]
        },
        alternateRowStyles: {
          fillColor: [249, 250, 251]
        },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 25, halign: 'center' },
          2: { cellWidth: 35, halign: 'right' },
          3: { cellWidth: 35, halign: 'right' }
        },
        margin: { left: 20, right: 20 }
      });
    } catch (error) {
      this.addSimpleItemsList(doc, data, 145);
    }
  }

  private addTotalsSection(doc: jsPDF, data: OrderData, pageWidth: number): void {
    try {
      let finalY = 200;
      try {
        finalY = (doc as any).lastAutoTable?.finalY || 200;
      } catch {}

      const startY = finalY + 10;

      doc.setDrawColor(74, 124, 89);
      doc.setLineWidth(0.5);
      doc.rect(pageWidth - 80, startY, 70, 25);

      doc.setTextColor(31, 41, 55);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Subtotal:', pageWidth - 75, startY + 8);
      doc.setFont('helvetica', 'normal');
      doc.text(this.formatCurrency(data.totals.subtotal), pageWidth - 25, startY + 8, { align: 'right' });

      doc.setFont('helvetica', 'bold');
      doc.text('Total Items:', pageWidth - 75, startY + 15);
      doc.setFont('helvetica', 'normal');
      doc.text(data.totals.itemCount.toString(), pageWidth - 25, startY + 15, { align: 'right' });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('TOTAL:', pageWidth - 75, startY + 22);
      doc.text(this.formatCurrency(data.totals.total), pageWidth - 25, startY + 22, { align: 'right' });
    } catch (error) {
      this.addSimpleTotals(doc, data, pageWidth, 220);
    }
  }

  private addDeliveryInfo(doc: jsPDF, data: OrderData, pageWidth: number): void {
    try {
      let finalY = 250;
      try {
        finalY = (doc as any).lastAutoTable?.finalY || 250;
      } catch {}

      const startY = finalY + 45;

      doc.setTextColor(45, 80, 22);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORMACIÓN DE ENTREGA', 20, startY);

      doc.setTextColor(31, 41, 55);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      const deliveryInfo = [
        ['Dirección:', data.delivery.address || 'N/A'],
        ['Departamento:', data.delivery.department || 'N/A'],
        ['Municipio:', data.delivery.municipality || 'N/A']
      ];

      if (data.delivery.additionalInfo) {
        deliveryInfo.push(['Información Adicional:', data.delivery.additionalInfo]);
      }

      let yPos = startY + 10;
      deliveryInfo.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPos);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 70, yPos, { maxWidth: pageWidth - 90 });
        yPos += 7;
      });
    } catch (error) {
      // Continue without delivery info
    }
  }

  private addFooter(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    const footerY = pageHeight - 20;
    doc.text('Este documento fue generado automáticamente por el sistema Sumak.', pageWidth / 2, footerY, { align: 'center' });
    doc.text('Para consultas: suumak25@gmail.com | WhatsApp: +57 320 8663691', pageWidth / 2, footerY + 5, { align: 'center' });
    doc.text(`Generado el: ${new Date().toLocaleString('es-CO')}`, pageWidth / 2, footerY + 10, { align: 'center' });
  }

  private addSecurityWatermark(doc: jsPDF, pageWidth: number, pageHeight: number): void {
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(50);
    doc.setFont('helvetica', 'bold');

    // Rotate and add watermark
    doc.saveGraphicsState();
    doc.setGState(new (doc as any).GState({ opacity: 0.1 }));

    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;

    doc.text('SUMAK', centerX, centerY, {
      align: 'center',
      angle: -45
    });

    doc.restoreGraphicsState();
  }

  private generateSecureOrderNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = this.advancedSecurity.generateSecureToken(8);
    return `SUM-${timestamp}-${random}`.toUpperCase();
  }

  private calculateTotals(items: any[]): OrderTotals {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        return {
          subtotal: 0,
          tax: 0,
          total: 0,
          itemCount: 0
        };
      }

      const subtotal = items.reduce((sum, item) => {
        const price = parseFloat(item.product?.price) || 0;
        const quantity = parseInt(item.quantity) || 1;
        return sum + (price * quantity);
      }, 0);

      const itemCount = items.reduce((sum, item) => {
        return sum + (parseInt(item.quantity) || 1);
      }, 0);

      return {
        subtotal: Math.max(0, subtotal),
        tax: 0,
        total: Math.max(0, subtotal),
        itemCount: Math.max(0, itemCount)
      };
    } catch (error) {
      return {
        subtotal: 0,
        tax: 0,
        total: 0,
        itemCount: 0
      };
    }
  }

  private buildFullAddress(customerData: any): string {
    try {
      if (!customerData) return 'Dirección no especificada';

      const addressParts = [];

      if (customerData.houseNumber) addressParts.push(customerData.houseNumber);
      if (customerData.urbanization) addressParts.push(customerData.urbanization);
      if (customerData.apartmentNumber) addressParts.push(`Apt. ${customerData.apartmentNumber}`);
      if (customerData.tower) addressParts.push(`Torre ${customerData.tower}`);
      if (customerData.additionalInfo) addressParts.push(customerData.additionalInfo);

      if (customerData.address) {
        if (customerData.address.houseNumber) addressParts.push(customerData.address.houseNumber);
        if (customerData.address.urbanization) addressParts.push(customerData.address.urbanization);
        if (customerData.address.apartmentNumber) addressParts.push(`Apt. ${customerData.address.apartmentNumber}`);
        if (customerData.address.tower) addressParts.push(`Torre ${customerData.address.tower}`);
        if (customerData.address.additionalInfo) addressParts.push(customerData.address.additionalInfo);
      }

      const fullAddress = addressParts.length > 0
        ? addressParts.join(', ')
        : 'Dirección no especificada';

      return this.advancedSecurity.sanitizeInput(fullAddress);
    } catch (error) {
      return 'Dirección no especificada';
    }
  }

  private formatCurrency(amount: number): string {
    try {
      const validAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(Math.max(0, validAmount));
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '$0';
    }
  }

  // Fallback methods for when autoTable fails
  private addSimpleItemsList(doc: jsPDF, data: OrderData, startY: number): void {
    try {
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');

      let yPos = startY + 10;
      data.items.forEach((item, index) => {
        const itemText = `${index + 1}. ${item.name} - Cantidad: ${item.quantity} - ${this.formatCurrency(item.totalPrice)}`;
        doc.text(itemText, 20, yPos, { maxWidth: 170 });
        yPos += 8;
      });

      console.log('Simple items list added as fallback');
    } catch (error) {
      console.error('Error adding simple items list:', error);
    }
  }

  private addSimpleTotals(doc: jsPDF, data: OrderData, pageWidth: number, startY: number): void {
    try {
      doc.setTextColor(31, 41, 55);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`TOTAL: ${this.formatCurrency(data.totals.total)}`, pageWidth - 20, startY, { align: 'right' });

      console.log('Simple totals added as fallback');
    } catch (error) {
      console.error('Error adding simple totals:', error);
    }
  }
}
