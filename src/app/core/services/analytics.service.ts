import { Injectable } from '@angular/core';

/**
 * Analytics Event Names - Union Type for type safety
 * Naming convention: snake_case
 */
export type AnalyticsEventName =
  | 'page_view'
  | 'click_whatsapp'
  | 'click_email'
  | 'click_solicitar_propuesta'
  | 'form_start_propuesta'
  | 'form_submit_propuesta'
  | 'view_regalos_corporativos'
  | 'view_contacto'
  | 'view_experiencias'
  | 'view_catalog';

/**
 * Standard Placements for consistent tracking
 */
export type AnalyticsPlacement =
  | 'navbar'
  | 'hero'
  | 'floating'
  | 'footer'
  | 'section'
  | 'contact_card'
  | 'cta_section';

/**
 * Analytics Event Parameters
 */
export interface AnalyticsEventParams {
  page_path?: string;
  page_title?: string;
  placement?: AnalyticsPlacement;
  cta_label?: string;
  form_id?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * PII-sensitive keys that should never be sent to analytics
 */
const PII_KEYS = [
  'email',
  'phone',
  'telephone',
  'name',
  'firstname',
  'lastname',
  'message',
  'address',
  'password',
  'token',
  'credit_card',
  'ssn',
  'dni',
  'cedula'
];

/**
 * AnalyticsService
 * 
 * Centralized service for GA4 tracking via Google Tag Manager dataLayer.
 * Features:
 * - Type-safe event tracking
 * - PII sanitization
 * - No external dependencies
 * - Tree-shakeable
 * - Production-ready with error handling
 * 
 * @example
 * ```typescript
 * constructor(private analytics: AnalyticsService) {}
 * 
 * trackCTA() {
 *   this.analytics.track('click_solicitar_propuesta', {
 *     placement: 'hero',
 *     cta_label: 'Solicitar Propuesta',
 *     page_path: '/regalos-corporativos'
 *   });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly isProduction = true; // Set based on environment
  private dataLayer: any[] = [];

  constructor() {
    // Initialize dataLayer if not exists
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      this.dataLayer = (window as any).dataLayer;
    }
  }

  /**
   * Track an analytics event
   * @param eventName - Type-safe event name
   * @param params - Event parameters (will be sanitized)
   */
  track(eventName: AnalyticsEventName, params: AnalyticsEventParams = {}): void {
    if (typeof window === 'undefined') {
      return; // SSR safety
    }

    try {
      // Sanitize parameters to remove PII
      const sanitizedParams = this.sanitizeParams(params);

      // Add default page_path if not provided (only in browser)
      if (!sanitizedParams.page_path && typeof window !== 'undefined') {
        sanitizedParams.page_path = window.location.pathname;
      }

      // Push to dataLayer
      this.dataLayer.push({
        event: eventName,
        ...sanitizedParams
      });

      // Debug logging (only in development)
      if (!this.isProduction) {
        console.log('[Analytics]', eventName, sanitizedParams);
      }
    } catch (error) {
      // Silent fail in production, log in development
      if (!this.isProduction) {
        console.error('[Analytics] Error tracking event:', error);
      }
    }
  }

  /**
   * Track page view (for SPA navigation)
   * @param path - Page path
   * @param title - Page title
   */
  trackPageView(path: string, title: string): void {
    this.track('page_view', {
      page_path: path,
      page_title: title
    });
  }

  /**
   * Sanitize parameters to remove PII
   * @param params - Raw parameters
   * @returns Sanitized parameters
   */
  private sanitizeParams(params: AnalyticsEventParams): AnalyticsEventParams {
    const sanitized: AnalyticsEventParams = {};

    for (const [key, value] of Object.entries(params)) {
      // Check if key is PII-sensitive
      const isPII = PII_KEYS.some(piiKey => 
        key.toLowerCase().includes(piiKey.toLowerCase())
      );

      if (isPII) {
        // Skip PII fields
        if (!this.isProduction) {
          console.warn(`[Analytics] Blocked PII field: ${key}`);
        }
        continue;
      }

      // Check if value contains potential PII patterns
      if (typeof value === 'string' && this.containsPII(value)) {
        if (!this.isProduction) {
          console.warn(`[Analytics] Blocked potential PII in value for key: ${key}`);
        }
        continue;
      }

      sanitized[key] = value;
    }

    return sanitized;
  }

  /**
   * Check if a string contains potential PII patterns
   * @param value - String to check
   * @returns true if potential PII detected
   */
  private containsPII(value: string): boolean {
    // Email pattern
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    // Phone pattern (Colombian and international)
    const phonePattern = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    
    return emailPattern.test(value) || phonePattern.test(value);
  }

  /**
   * Set user consent (for GDPR/privacy compliance)
   * @param granted - Whether consent is granted
   */
  setConsent(granted: boolean): void {
    if (typeof window === 'undefined') return;

    this.dataLayer.push({
      event: 'consent_update',
      consent: {
        analytics_storage: granted ? 'granted' : 'denied',
        ad_storage: granted ? 'granted' : 'denied'
      }
    });
  }
}
