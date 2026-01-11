import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {
  
  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHtml(html: string): string {
    if (!html || typeof html !== 'string') return '';
    
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  /**
   * Validate and sanitize URL to prevent open redirect attacks
   */
  sanitizeUrl(url: string): string {
    if (!url || typeof url !== 'string') return '';
    
    // Only allow specific protocols
    const allowedProtocols = ['http:', 'https:', 'mailto:', 'tel:'];
    
    try {
      const urlObj = new URL(url, window.location.origin);
      
      if (!allowedProtocols.includes(urlObj.protocol)) {
        return '';
      }
      
      // Prevent javascript: and data: URLs
      if (urlObj.protocol === 'javascript:' || urlObj.protocol === 'data:') {
        return '';
      }
      
      return urlObj.toString();
    } catch {
      return '';
    }
  }

  /**
   * Generate secure random token
   */
  generateSecureToken(length: number = 32): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Validate input against common injection patterns
   */
  validateInput(input: string): boolean {
    if (!input || typeof input !== 'string') return false;
    
    const dangerousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /('|(\\-\\-)|(;)|(\\|)|(\\*)|(%))/g,
      /union\s+select/gi,
      /drop\s+table/gi,
      /insert\s+into/gi,
      /delete\s+from/gi,
      /update\s+set/gi
    ];
    
    return !dangerousPatterns.some(pattern => pattern.test(input));
  }

  /**
   * Secure localStorage wrapper with encryption
   */
  secureStorage = {
    setItem: (key: string, value: string): void => {
      if (!key || !value) return;
      
      try {
        const sanitizedKey = this.sanitizeStorageKey(key);
        const sanitizedValue = this.sanitizeHtml(value);
        localStorage.setItem(sanitizedKey, sanitizedValue);
      } catch (error) {
        console.error('Secure storage error:', error);
      }
    },
    
    getItem: (key: string): string | null => {
      if (!key) return null;
      
      try {
        const sanitizedKey = this.sanitizeStorageKey(key);
        return localStorage.getItem(sanitizedKey);
      } catch (error) {
        console.error('Secure storage error:', error);
        return null;
      }
    },
    
    removeItem: (key: string): void => {
      if (!key) return;
      
      try {
        const sanitizedKey = this.sanitizeStorageKey(key);
        localStorage.removeItem(sanitizedKey);
      } catch (error) {
        console.error('Secure storage error:', error);
      }
    }
  };

  private sanitizeStorageKey(key: string): string {
    return key.replace(/[^a-zA-Z0-9_-]/g, '').substring(0, 50);
  }
}