import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeUrl } from '@angular/platform-browser';

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue: string;
  errors: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SecuritySanitizerService {
  
  constructor(private domSanitizer: DomSanitizer) {}

  // XSS Prevention - HTML Sanitization
  sanitizeHtml(input: string): SafeHtml {
    if (!input || typeof input !== 'string') return '';
    
    // Remove script tags and dangerous attributes
    const cleaned = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '');
    
    return this.domSanitizer.sanitize(1, cleaned) || '';
  }

  // URL Sanitization
  sanitizeUrl(url: string): SafeUrl {
    if (!url || typeof url !== 'string') return '';
    
    // Only allow http, https, and relative URLs
    const urlPattern = /^(https?:\/\/|\/|\.\/)/i;
    if (!urlPattern.test(url)) return '';
    
    return this.domSanitizer.sanitize(4, url) || '';
  }

  // Product Name Validation
  validateProductName(name: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = '';

    if (!name || typeof name !== 'string') {
      errors.push('Product name is required');
      return { isValid: false, sanitizedValue: '', errors };
    }

    // Remove HTML tags and dangerous characters
    sanitizedValue = name
      .replace(/<[^>]*>/g, '')
      .replace(/[<>'"&]/g, '')
      .trim();

    if (sanitizedValue.length < 2) {
      errors.push('Product name must be at least 2 characters');
    }

    if (sanitizedValue.length > 100) {
      errors.push('Product name cannot exceed 100 characters');
      sanitizedValue = sanitizedValue.substring(0, 100);
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /<script/i,
      /on\w+=/i
    ];

    if (suspiciousPatterns.some(pattern => pattern.test(name))) {
      errors.push('Product name contains invalid characters');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  // Price Validation with Integrity Check
  validatePrice(price: number, originalHash?: string): ValidationResult {
    const errors: string[] = [];

    if (typeof price !== 'number' || isNaN(price)) {
      errors.push('Price must be a valid number');
      return { isValid: false, sanitizedValue: '0', errors };
    }

    if (price < 0) {
      errors.push('Price cannot be negative');
    }

    if (price > 10000000) {
      errors.push('Price exceeds maximum allowed value');
    }

    // Integrity check if hash provided
    if (originalHash) {
      const currentHash = this.generatePriceHash(price);
      if (currentHash !== originalHash) {
        errors.push('Price integrity check failed');
      }
    }

    const sanitizedValue = Math.max(0, Math.min(price, 10000000)).toFixed(0);

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  // Generate price integrity hash
  generatePriceHash(price: number): string {
    const priceString = price.toString();
    let hash = 0;
    for (let i = 0; i < priceString.length; i++) {
      const char = priceString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // Description Sanitization
  sanitizeDescription(description: string): string {
    if (!description || typeof description !== 'string') return '';

    return description
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .substring(0, 1000) // Limit length
      .trim();
  }

  // Quantity Validation
  validateQuantity(quantity: number): ValidationResult {
    const errors: string[] = [];

    if (typeof quantity !== 'number' || isNaN(quantity)) {
      errors.push('Quantity must be a valid number');
      return { isValid: false, sanitizedValue: '1', errors };
    }

    if (quantity < 1) {
      errors.push('Quantity must be at least 1');
    }

    if (quantity > 99) {
      errors.push('Quantity cannot exceed 99');
    }

    if (!Number.isInteger(quantity)) {
      errors.push('Quantity must be a whole number');
    }

    const sanitizedValue = Math.max(1, Math.min(Math.floor(quantity), 99)).toString();

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  // Email Validation
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = '';

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
      return { isValid: false, sanitizedValue: '', errors };
    }

    // Basic sanitization
    sanitizedValue = email.toLowerCase().trim();

    // Email regex pattern
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(sanitizedValue)) {
      errors.push('Invalid email format');
    }

    if (sanitizedValue.length > 254) {
      errors.push('Email address too long');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  // Phone Validation
  validatePhone(phone: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = '';

    if (!phone || typeof phone !== 'string') {
      errors.push('Phone number is required');
      return { isValid: false, sanitizedValue: '', errors };
    }

    // Remove all non-numeric characters except +
    sanitizedValue = phone.replace(/[^\d+]/g, '');

    // Colombian phone pattern (basic)
    const phonePattern = /^(\+57)?[0-9]{10}$/;
    
    if (!phonePattern.test(sanitizedValue)) {
      errors.push('Invalid phone number format');
    }

    return {
      isValid: errors.length === 0,
      sanitizedValue,
      errors
    };
  }

  // Generic input sanitization
  sanitizeInput(input: string, maxLength: number = 255): string {
    if (!input || typeof input !== 'string') return '';

    return input
      .replace(/[<>'"&]/g, '') // Remove dangerous characters
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim()
      .substring(0, maxLength);
  }

  // Check for malicious patterns
  containsMaliciousContent(input: string): boolean {
    if (!input || typeof input !== 'string') return false;

    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /data:/i,
      /vbscript:/i,
      /on\w+\s*=/i,
      /eval\s*\(/i,
      /expression\s*\(/i,
      /url\s*\(/i,
      /import\s*\(/i
    ];

    return maliciousPatterns.some(pattern => pattern.test(input));
  }
}