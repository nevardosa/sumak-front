import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly platformId = inject(PLATFORM_ID);

  // Track page view
  trackPageView(url: string, title: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('config', 'GTM-P8S8S9TH', {
        page_path: url,
        page_title: title
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }

  // Track ritual view (PDP)
  trackRitualView(ritualName: string, ritualId: string, price: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Google Analytics - View Item
    if (window.gtag) {
      window.gtag('event', 'view_item', {
        currency: 'COP',
        value: price,
        items: [{
          item_id: ritualId,
          item_name: ritualName,
          item_category: 'Ritual Gastronómico',
          price: price
        }]
      });
    }

    // Facebook Pixel - ViewContent
    if (window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: ritualName,
        content_ids: [ritualId],
        content_type: 'product',
        value: price,
        currency: 'COP'
      });
    }
  }

  // Track add to cart
  trackAddToCart(ritualName: string, ritualId: string, price: number, quantity: number = 1): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Google Analytics
    if (window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'COP',
        value: price * quantity,
        items: [{
          item_id: ritualId,
          item_name: ritualName,
          item_category: 'Ritual Gastronómico',
          price: price,
          quantity: quantity
        }]
      });
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('track', 'AddToCart', {
        content_name: ritualName,
        content_ids: [ritualId],
        content_type: 'product',
        value: price * quantity,
        currency: 'COP'
      });
    }
  }

  // Track WhatsApp click
  trackWhatsAppClick(ritualName: string, source: 'pdp' | 'catalog' | 'checkout'): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', 'whatsapp_click', {
        event_category: 'engagement',
        event_label: `${source} - ${ritualName}`,
        ritual_name: ritualName,
        source: source
      });
    }

    if (window.fbq) {
      window.fbq('track', 'Contact', {
        content_name: ritualName,
        source: source
      });
    }
  }

  // Track corporate inquiry
  trackCorporateInquiry(ritualName?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', 'corporate_inquiry', {
        event_category: 'lead',
        event_label: ritualName || 'general',
        ritual_name: ritualName
      });
    }

    if (window.fbq) {
      window.fbq('track', 'Lead', {
        content_name: ritualName || 'Corporate Inquiry',
        content_category: 'B2B'
      });
    }
  }

  // Track checkout initiation
  trackBeginCheckout(items: any[], total: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'COP',
        value: total,
        items: items.map(item => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      });
    }

    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        value: total,
        currency: 'COP',
        num_items: items.length
      });
    }
  }

  // Track purchase (order completion)
  trackPurchase(orderId: string, items: any[], total: number): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: orderId,
        currency: 'COP',
        value: total,
        items: items.map(item => ({
          item_id: item.product.id,
          item_name: item.product.name,
          price: item.product.price,
          quantity: item.quantity
        }))
      });
    }

    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value: total,
        currency: 'COP',
        content_ids: items.map(item => item.product.id),
        content_type: 'product',
        num_items: items.length
      });
    }
  }

  // Generic event tracking
  trackEvent(event: AnalyticsEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value
      });
    }
  }

  // Legacy method for backward compatibility
  track(eventName: string, properties?: Record<string, any>): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (window.gtag) {
      window.gtag('event', eventName, properties || {});
    }
  }
}
