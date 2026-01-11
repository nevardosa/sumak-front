export const SECURITY_CONFIG = {
  // Content Security Policy
  CSP: {
    'default-src': "'self'",
    'script-src': "'self' 'unsafe-inline'", // Minimize unsafe-inline usage
    'style-src': "'self' 'unsafe-inline' https://fonts.googleapis.com",
    'font-src': "'self' https://fonts.gstatic.com",
    'img-src': "'self' data: https:",
    'connect-src': "'self' https://api.whatsapp.com",
    'frame-ancestors': "'none'",
    'base-uri': "'self'",
    'form-action': "'self'",
    'upgrade-insecure-requests': true
  },

  // Security Headers
  HEADERS: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
  },

  // Input Validation Rules
  VALIDATION: {
    MAX_STRING_LENGTH: 200,
    MAX_EMAIL_LENGTH: 254,
    MAX_PHONE_LENGTH: 10,
    MIN_PHONE_LENGTH: 10,
    MAX_ID_LENGTH: 12,
    MIN_ID_LENGTH: 6,
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_FILE_TYPES: ['.csv', '.txt'],
    RATE_LIMIT: {
      MAX_REQUESTS: 100,
      WINDOW_MS: 15 * 60 * 1000 // 15 minutes
    }
  },

  // Sanitization Patterns
  SANITIZATION: {
    HTML_TAGS: /<[^>]*>/g,
    SCRIPT_CONTENT: /javascript:/gi,
    EVENT_HANDLERS: /on\w+\s*=/gi,
    SQL_INJECTION: /('|(\-\-)|(;)|(\|)|(\*)|(%))/g,
    XSS_PATTERNS: /[<>"'&]/g,
    CONTROL_CHARS: /[\x00-\x1F\x7F]/g,
    PATH_TRAVERSAL: /\.\.[\\/\\]/g
  },

import { IdentificationType } from '../models/catalog.models';

export const SECURITY_CONFIG = {
  ALLOWED_VALUES: {
    IDENTIFICATION_TYPES: Object.values(IdentificationType),
    PHONE_PATTERN: /^3[0-9]{9}$/,
    EMAIL_PATTERN: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
    NAME_PATTERN: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/,
    ADDRESS_PATTERN: /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s#\-.,°()]+$/
  }
} as const;
} as const;

// Security utility functions
export class SecurityUtils {
  static isValidInput(input: string, pattern: RegExp): boolean {
    return pattern.test(input);
  }

  static sanitizeForStorage(key: string): string {
    return key.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
  }

  static generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static validateFileType(filename: string): boolean {
    const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    return SECURITY_CONFIG.VALIDATION.ALLOWED_FILE_TYPES.includes(extension);
  }
}