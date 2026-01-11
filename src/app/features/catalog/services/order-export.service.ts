import { Injectable } from '@angular/core';
import { CheckoutData } from '../models/catalog.models';
import { SecureValidators } from '../../../shared/validators/secure-validators';

interface OrderRecord {
  readonly timestamp: string;
  readonly orderId: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly customerAddress: string;
  readonly customerLocation: string;
  readonly orderItems: string;
  readonly orderTotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderExportService {
  private readonly CSV_HEADERS = [
    'Timestamp',
    'Order_ID',
    'Customer_Name',
    'Customer_Email', 
    'Customer_Phone',
    'Customer_Address',
    'Customer_Location',
    'Order_Items',
    'Order_Total'
  ] as const;

  exportOrderToCSV(checkoutData: CheckoutData): void {
    try {
      if (!this.validateCheckoutData(checkoutData)) {
        throw new Error('Datos de pedido inválidos');
      }

      const orderRecord = this.createOrderRecord(checkoutData);
      const csvContent = this.generateCSVContent(orderRecord);
      const filename = this.generateSecureFilename();
      
      this.downloadFile(csvContent, filename);
    } catch (error) {
      console.error('Error exportando pedido:', error);
      throw new Error('Error al generar archivo de pedido');
    }
  }

  private validateCheckoutData(data: CheckoutData): boolean {
    return !!(
      data?.customer?.firstName &&
      data?.customer?.lastName &&
      data?.customer?.email &&
      data?.customer?.phone &&
      data?.cart?.items?.length &&
      typeof data.cart.total === 'number'
    );
  }

  private createOrderRecord(data: CheckoutData): OrderRecord {
    const { customer, cart } = data;
    const timestamp = new Date().toISOString();
    const orderId = this.generateOrderId();
    
    return {
      timestamp,
      orderId,
      customerName: this.sanitizeField(`${customer.firstName} ${customer.lastName}`),
      customerEmail: this.sanitizeField(customer.email),
      customerPhone: this.sanitizeField(customer.phone),
      customerAddress: this.formatAddress(customer.address),
      customerLocation: this.sanitizeField(`${customer.municipality}, ${customer.department}`),
      orderItems: this.formatOrderItems(cart.items),
      orderTotal: cart.total
    };
  }

  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SUM${timestamp}${random}`;
  }

  private sanitizeField(value: string): string {
    if (!value) return '';
    return SecureValidators.sanitizeText(value)
      .replace(/[,;"\n\r]/g, ' ')
      .trim();
  }

  private formatAddress(address: any): string {
    if (!address?.houseNumber) return '';
    
    const parts: string[] = [];
    if (address.urbanization) parts.push(this.sanitizeField(address.urbanization));
    parts.push(this.sanitizeField(address.houseNumber));
    if (address.apartmentNumber) parts.push(`Apto ${this.sanitizeField(address.apartmentNumber)}`);
    if (address.tower) parts.push(`Torre ${this.sanitizeField(address.tower)}`);
    if (address.additionalInfo) parts.push(this.sanitizeField(address.additionalInfo));
    
    return parts.join(' - ');
  }

  private formatOrderItems(items: any[]): string {
    if (!Array.isArray(items)) return '';
    
    return items.map(item => {
      const name = this.sanitizeField(item.product?.name || '');
      const quantity = item.quantity || 0;
      const price = item.product?.price || 0;
      return `${name} (${quantity}x$${price})`;
    }).join(' | ');
  }

  private generateCSVContent(record: OrderRecord): string {
    const headers = this.CSV_HEADERS.join(',');
    const values = [
      record.timestamp,
      record.orderId,
      `"${record.customerName}"`,
      `"${record.customerEmail}"`,
      `"${record.customerPhone}"`,
      `"${record.customerAddress}"`,
      `"${record.customerLocation}"`,
      `"${record.orderItems}"`,
      record.orderTotal.toString()
    ].join(',');
    
    return `${headers}\n${values}`;
  }

  private generateSecureFilename(): string {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
    const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
    return `PedidosSumak_${dateStr}_${timeStr}.csv`;
  }

  private downloadFile(content: string, filename: string): void {
    try {
      // Validate inputs
      if (!content || typeof content !== 'string') {
        throw new Error('Contenido inválido');
      }
      
      if (!filename || typeof filename !== 'string') {
        throw new Error('Nombre de archivo inválido');
      }
      
      // Sanitize filename to prevent path traversal
      const sanitizedFilename = filename
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .substring(0, 100);
      
      if (!sanitizedFilename.endsWith('.csv')) {
        throw new Error('Tipo de archivo no permitido');
      }
      
      // Create blob with explicit MIME type
      const blob = new Blob([content], { 
        type: 'text/csv;charset=utf-8;' 
      });
      
      // Validate blob size (max 10MB)
      if (blob.size > 10 * 1024 * 1024) {
        throw new Error('Archivo demasiado grande');
      }
      
      const link = document.createElement('a');
      
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        
        // Set secure attributes
        link.setAttribute('href', url);
        link.setAttribute('download', sanitizedFilename);
        link.setAttribute('rel', 'noopener noreferrer');
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up object URL immediately
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } else {
        throw new Error('Descarga no soportada en este navegador');
      }
    } catch (error) {
      console.error('Error descargando archivo:', error);
      throw new Error('Error al descargar archivo');
    }
  }
}