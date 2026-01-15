import { Injectable } from '@angular/core';
import { CustomerData, CheckoutData, Municipality, Department, PaymentInstructions, AddressDetails, IdentificationType } from '../models/catalog.models';
import { COLOMBIA_DEPARTMENTS, PAYMENT_INSTRUCTIONS, CHECKOUT_CONSTANTS } from '../constants/checkout.constants';
import { getMunicipalitiesByDepartment } from '../constants/municipalities.constants';
import { SecureValidators } from '../../../shared/validators/secure-validators';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private readonly priceFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  getDepartments(): Department[] {
    return COLOMBIA_DEPARTMENTS;
  }

  getMunicipalitiesByDepartment(departmentId: string): Municipality[] {
    if (!departmentId || typeof departmentId !== 'string') {
      return [];
    }
    
    // Usar la función optimizada para obtener todos los municipios
    return getMunicipalitiesByDepartment(departmentId);
  }

  getPaymentInstructions(): PaymentInstructions {
    return PAYMENT_INSTRUCTIONS;
  }

  generateWhatsAppMessage(checkoutData: CheckoutData, orderNumber?: string): string {
    try {
      if (!this.validateCheckoutData(checkoutData)) {
        throw new Error('Datos de checkout inválidos');
      }

      const { customer, cart } = checkoutData;
      const customerInfo = this.formatCustomerInfo(customer);
      const orderInfo = this.formatOrderInfo(cart);
      
      const orderHeader = orderNumber 
        ? `🛍️ *NUEVO PEDIDO SUMAK N°: ${orderNumber}*`
        : `🛍️ *NUEVO PEDIDO SUMAK*`;
      
      return `${orderHeader}\n\n${customerInfo}\n\n${orderInfo}`;
    } catch (error) {
      console.error('Error generando mensaje WhatsApp:', error);
      throw new Error('Error al generar el mensaje');
    }
  }

  private validateCheckoutData(data: CheckoutData): boolean {
    return !!(data?.customer && data?.cart && 
             data.customer.firstName && data.customer.lastName &&
             data.customer.email && data.customer.phone &&
             data.cart.items && Array.isArray(data.cart.items));
  }

  private formatCustomerInfo(customer: CustomerData): string {
    const sanitizedCustomer = this.sanitizeCustomerData(customer);
    const address = this.formatAddress(sanitizedCustomer.address);
    
    return `👤 *DATOS DEL CLIENTE*\n` +
           `• Nombre: ${sanitizedCustomer.firstName} ${sanitizedCustomer.lastName}\n` +
           `• ${sanitizedCustomer.identificationType}: ${sanitizedCustomer.identificationNumber}\n` +
           `• Ubicación: ${sanitizedCustomer.municipality}, ${sanitizedCustomer.department}\n` +
           `• Dirección: ${address}\n` +
           `• Email: ${sanitizedCustomer.email}\n` +
           `• Teléfono: ${sanitizedCustomer.phone}`;
  }

  private sanitizeCustomerData(customer: CustomerData): CustomerData {
    // Validate all inputs before sanitization
    if (!customer || typeof customer !== 'object') {
      throw new Error('Datos de cliente inválidos');
    }

    // Validate required fields
    if (!customer.firstName || !customer.lastName || !customer.email || !customer.phone) {
      throw new Error('Campos requeridos faltantes');
    }

    return {
      firstName: SecureValidators.sanitizeText(customer.firstName),
      lastName: SecureValidators.sanitizeText(customer.lastName),
      identificationType: this.validateIdentificationType(customer.identificationType),
      identificationNumber: this.sanitizeIdentificationNumber(customer.identificationNumber),
      department: SecureValidators.sanitizeText(customer.department),
      municipality: SecureValidators.sanitizeText(customer.municipality),
      address: this.sanitizeAddress(customer.address),
      email: this.sanitizeEmail(customer.email),
      phone: this.sanitizePhone(customer.phone),
      acceptsDataProcessing: Boolean(customer.acceptsDataProcessing)
    };
  }

  private validateIdentificationType(type: string): IdentificationType {
    const allowedTypes: Record<string, IdentificationType> = {
      'CC': IdentificationType.CC,
      'CE': IdentificationType.CE,
      'TI': IdentificationType.TI,
      'PP': IdentificationType.PP
    };
    
    if (!type || !allowedTypes[type]) {
      throw new Error('Tipo de identificación inválido');
    }
    return allowedTypes[type];
  }

  private sanitizeIdentificationNumber(id: string): string {
    if (!id || typeof id !== 'string') {
      throw new Error('Número de identificación inválido');
    }
    const sanitized = id.replace(/\D/g, '');
    if (sanitized.length < 6 || sanitized.length > 12) {
      throw new Error('Número de identificación debe tener entre 6 y 12 dígitos');
    }
    return sanitized;
  }

  private sanitizeEmail(email: string): string {
    if (!email || typeof email !== 'string') {
      throw new Error('Email inválido');
    }
    const sanitized = email.toLowerCase().trim();
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Formato de email inválido');
    }
    return sanitized;
  }

  private sanitizePhone(phone: string): string {
    if (!phone || typeof phone !== 'string') {
      throw new Error('Teléfono inválido');
    }
    const sanitized = phone.replace(/\D/g, '');
    if (!/^3[0-9]{9}$/.test(sanitized)) {
      throw new Error('Teléfono debe ser formato colombiano: 3XXXXXXXXX');
    }
    return sanitized;
  }

  private sanitizeAddress(address: Readonly<AddressDetails>): Readonly<AddressDetails> {
    if (!address) {
      throw new Error('Dirección requerida');
    }

    return {
      urbanization: address.urbanization ? SecureValidators.sanitizeText(address.urbanization) : undefined,
      houseNumber: SecureValidators.sanitizeText(address.houseNumber),
      apartmentNumber: address.apartmentNumber ? SecureValidators.sanitizeText(address.apartmentNumber) : undefined,
      tower: address.tower ? SecureValidators.sanitizeText(address.tower) : undefined,
      block: address.block ? SecureValidators.sanitizeText(address.block) : undefined,
      additionalInfo: address.additionalInfo ? SecureValidators.sanitizeText(address.additionalInfo) : undefined
    };
  }

  private formatAddress(address: Readonly<AddressDetails>): string {
    if (!address?.houseNumber) {
      return 'Dirección no especificada';
    }

    const parts: string[] = [];
    
    if (address.urbanization) parts.push(address.urbanization);
    parts.push(address.houseNumber);
    if (address.apartmentNumber) parts.push(`Apto ${address.apartmentNumber}`);
    if (address.tower) parts.push(`Torre ${address.tower}`);
    if (address.block) parts.push(`Bloque ${address.block}`);
    if (address.additionalInfo) parts.push(address.additionalInfo);
    
    return parts.join(', ');
  }

  private formatOrderInfo(cart: any): string {
    if (!cart?.items || !Array.isArray(cart.items)) {
      throw new Error('Carrito inválido');
    }

    let orderText = `🛒 *DETALLE DEL PEDIDO*\n`;
    
    cart.items.forEach((item: any, index: number) => {
      if (!item?.product || typeof item.product.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error('Item de carrito inválido');
      }

      const total = item.product.price * item.quantity;
      orderText += `${index + 1}. ${SecureValidators.sanitizeText(item.product.name)}\n`;
      orderText += `   Cantidad: ${item.quantity}\n`;
      orderText += `   Precio unitario: ${this.formatPrice(item.product.price)}\n`;
      orderText += `   Subtotal: ${this.formatPrice(total)}\n\n`;
    });
    
    orderText += `💰 *TOTAL: ${this.formatPrice(cart.total)}*`;
    
    return orderText;
  }

  private formatPrice(price: number): string {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      throw new Error('Precio inválido');
    }
    
    return this.priceFormatter.format(price);
  }

  openWhatsApp(message: string): void {
    try {
      if (!message || typeof message !== 'string') {
        throw new Error('Mensaje inválido');
      }

      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `${CHECKOUT_CONSTANTS.WHATSAPP_BASE_URL}${PAYMENT_INSTRUCTIONS.whatsappNumber}?text=${encodedMessage}`;
      
      // Abrir SIEMPRE en nueva pestaña (desktop y móvil)
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      // Verificar si el popup fue bloqueado
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: mostrar alerta y copiar mensaje
        if (confirm('El navegador bloqueó la ventana de WhatsApp. ¿Deseas copiar el mensaje al portapapeles?')) {
          navigator.clipboard.writeText(message).then(() => {
            alert('Mensaje copiado. Abre WhatsApp manualmente y pégalo.');
          }).catch(() => {
            alert('No se pudo copiar. Por favor, envía el pedido manualmente.');
          });
        }
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // Fallback final: copiar al portapapeles
      try {
        navigator.clipboard.writeText(message);
        alert('WhatsApp no pudo abrirse automáticamente. El mensaje se ha copiado al portapapeles. Pégalo manualmente en WhatsApp.');
      } catch {
        alert('No se pudo abrir WhatsApp. Por favor, envía el pedido manualmente.');
      }
    }
  }
}