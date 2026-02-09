import { WHATSAPP_CONFIG } from '../config/whatsapp.config';

export interface WhatsAppUrlParams {
  message: string;
  source?: string;
}

function sanitizeMessage(message: string): string {
  if (!message || typeof message !== 'string') {
    return WHATSAPP_CONFIG.defaultMessage || '';
  }

  return message
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

export function buildWhatsAppUrl(params: WhatsAppUrlParams): string {
  const sanitized = sanitizeMessage(params.message);
  const encoded = encodeURIComponent(sanitized);
  
  return `${WHATSAPP_CONFIG.baseUrl}${WHATSAPP_CONFIG.phoneNumber}?text=${encoded}`;
}

export function buildWhatsAppOrderUrl(orderMessage: string): string {
  if (!orderMessage || orderMessage.length > 5000) {
    throw new Error('Order message must be between 1 and 5000 characters');
  }

  return buildWhatsAppUrl({ message: orderMessage, source: 'order' });
}
