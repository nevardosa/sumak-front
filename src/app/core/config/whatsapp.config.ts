import { environment } from '../../../environments/environment';

/**
 * WhatsApp Configuration
 * Single source of truth for WhatsApp integration
 */
export interface WhatsAppConfig {
  readonly phoneNumber: string;
  readonly baseUrl: string;
  readonly defaultMessage?: string;
}

/**
 * Validate WhatsApp phone number format
 * Must be: country code + number (e.g., 573208663691)
 */
function validatePhoneNumber(phone: string): boolean {
  return /^\d{10,15}$/.test(phone);
}

/**
 * Get validated WhatsApp configuration from environment
 * Throws error if configuration is invalid
 */
export function getWhatsAppConfig(): WhatsAppConfig {
  const phone = environment.payment.whatsappNumber;
  const baseUrl = environment.payment.whatsappBaseUrl;

  if (!phone || !validatePhoneNumber(phone)) {
    throw new Error('Invalid WhatsApp phone number in environment config');
  }

  if (!baseUrl || !baseUrl.startsWith('https://wa.me/')) {
    throw new Error('Invalid WhatsApp base URL in environment config');
  }

  return {
    phoneNumber: phone,
    baseUrl: baseUrl,
    defaultMessage: 'Hola, me gustaría conocer más sobre los rituales Sumak'
  };
}

/**
 * WhatsApp configuration instance
 * Validated at module load time
 */
export const WHATSAPP_CONFIG = getWhatsAppConfig();
