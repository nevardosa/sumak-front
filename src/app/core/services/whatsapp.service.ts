import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { buildWhatsAppUrl, buildWhatsAppOrderUrl, WhatsAppUrlParams } from '../utils/whatsapp-url.builder';
import { AnalyticsService } from './analytics.service';

@Injectable({
  providedIn: 'root'
})
export class WhatsAppService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly analytics = inject(AnalyticsService);

  /**
   * Open WhatsApp with message in NEW TAB (never leaves portal)
   * ALWAYS uses target="_blank" with noopener,noreferrer
   */
  openWhatsApp(params: WhatsAppUrlParams): void {
    if (!this.isBrowser) return;

    try {
      const url = buildWhatsAppUrl(params);
      
      // Track analytics
      this.analytics.track('click_whatsapp', {
        placement: (params.source as any) || 'floating',
        page_path: window.location.pathname
      });

      // ALWAYS open in new tab with security
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Popup blocked - show user-friendly message
        this.handlePopupBlocked(url);
      }
    } catch (error) {
      console.error('[WhatsAppService] Error opening WhatsApp:', error);
      alert('No se pudo abrir WhatsApp. Verifica que no esté bloqueado por el navegador.');
    }
  }

  /**
   * Open WhatsApp with order/quote message
   */
  openWhatsAppOrder(orderMessage: string, source: string = 'order'): void {
    if (!this.isBrowser) return;

    try {
      const url = buildWhatsAppOrderUrl(orderMessage);
      
      this.analytics.track('click_whatsapp', {
        placement: (source as any),
        page_path: window.location.pathname
      });

      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        this.handlePopupBlocked(url);
      }
    } catch (error) {
      console.error('[WhatsAppService] Error opening WhatsApp order:', error);
      throw error;
    }
  }

  /**
   * Get WhatsApp URL without opening (for <a> tags)
   */
  getWhatsAppUrl(params: WhatsAppUrlParams): string {
    return buildWhatsAppUrl(params);
  }

  /**
   * Handle popup blocker scenario
   */
  private handlePopupBlocked(url: string): void {
    const userConfirm = confirm(
      'El navegador bloqueó la ventana de WhatsApp.\n\n' +
      '¿Deseas abrir WhatsApp ahora?\n\n' +
      '(Recomendamos permitir ventanas emergentes para Sumak Gourmet)'
    );

    if (userConfirm) {
      window.location.href = url;
    }
  }
}
