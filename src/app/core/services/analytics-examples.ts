/**
 * ANALYTICS IMPLEMENTATION EXAMPLES
 * 
 * Este archivo contiene ejemplos de cómo implementar tracking en diferentes componentes.
 * NO es código ejecutable, solo referencia.
 */

// ============================================
// EJEMPLO 1: Tracking en Header Component
// ============================================

import { Component } from '@angular/core';
import { TrackEventDirective } from '../../shared/directives/track-event.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [TrackEventDirective],
  template: `
    <!-- Botón Solicitar Propuesta -->
    <app-button
      trackEvent="click_solicitar_propuesta"
      trackPlacement="navbar"
      trackLabel="Solicitar Propuesta"
      variant="primary"
      routerLink="/cotizacion-corporativa">
      Solicitar propuesta
    </app-button>

    <!-- Link de Email -->
    <a 
      href="mailto:suumak25@gmail.com"
      trackEvent="click_email"
      trackPlacement="navbar">
      suumak25@gmail.com
    </a>
  `
})
export class HeaderComponent {}

// ============================================
// EJEMPLO 2: Botón Flotante WhatsApp
// ============================================

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  imports: [TrackEventDirective],
  template: `
    <a
      href="https://wa.me/573208663691?text=Hola%2C%20quiero%20información%20sobre%20Sumak%20Gourmet"
      target="_blank"
      rel="noopener noreferrer"
      trackEvent="click_whatsapp"
      trackPlacement="floating"
      trackLabel="WhatsApp Flotante"
      class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all"
      aria-label="Contactar por WhatsApp">
      <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  `
})
export class WhatsAppButtonComponent {}

// ============================================
// EJEMPLO 3: Formulario con Form Events
// ============================================

import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  template: `
    <form 
      [formGroup]="contactForm"
      (ngSubmit)="onSubmit()"
      (focusin)="onFormStart()">
      
      <input 
        type="text" 
        formControlName="company"
        placeholder="Empresa">
      
      <input 
        type="number" 
        formControlName="quantity"
        placeholder="Cantidad">
      
      <button type="submit">Enviar</button>
    </form>
  `
})
export class ContactFormComponent {
  private formStarted = false;

  constructor(private analytics: AnalyticsService) {}

  onFormStart(): void {
    if (!this.formStarted) {
      this.formStarted = true;
      this.analytics.track('form_start_propuesta', {
        form_id: 'contact_form',
        placement: 'contact_card'
      });
    }
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      // NO enviar datos del formulario a analytics
      this.analytics.track('form_submit_propuesta', {
        form_id: 'contact_form',
        placement: 'contact_card'
        // NO incluir: email, phone, name, message
      });

      // Enviar formulario a backend...
    }
  }
}

// ============================================
// EJEMPLO 4: CTA en Hero Section
// ============================================

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [TrackEventDirective],
  template: `
    <section class="hero">
      <h1>Rituales Gastronómicos Premium</h1>
      
      <!-- CTA Principal -->
      <app-button
        trackEvent="click_solicitar_propuesta"
        trackPlacement="hero"
        trackLabel="Solicitar Propuesta Hero"
        variant="primary"
        routerLink="/cotizacion-corporativa">
        Solicitar Propuesta
      </app-button>

      <!-- CTA Secundario -->
      <app-button
        trackEvent="click_whatsapp"
        trackPlacement="hero"
        trackLabel="WhatsApp Hero"
        variant="secondary"
        href="https://wa.me/573208663691"
        target="_blank">
        Contactar por WhatsApp
      </app-button>
    </section>
  `
})
export class HeroComponent {}

// ============================================
// EJEMPLO 5: Tracking Programático
// ============================================

import { AnalyticsService } from '../../core/services/analytics.service';

@Component({
  selector: 'app-catalog',
  standalone: true
})
export class CatalogComponent {
  constructor(private analytics: AnalyticsService) {}

  onProductClick(productId: string): void {
    // Track custom event
    this.analytics.track('view_catalog', {
      placement: 'section',
      page_path: '/catalog'
    });
  }

  onFilterApplied(filterType: string): void {
    // Track filter usage (custom event - add to union type if needed)
    this.analytics.track('view_catalog', {
      placement: 'section'
    });
  }
}

// ============================================
// EJEMPLO 6: Multiple CTAs en misma página
// ============================================

@Component({
  selector: 'app-regalos-corporativos',
  standalone: true,
  imports: [TrackEventDirective],
  template: `
    <!-- Hero CTA -->
    <button
      trackEvent="click_solicitar_propuesta"
      trackPlacement="hero"
      trackLabel="Solicitar Propuesta Hero">
      Solicitar Propuesta
    </button>

    <!-- Section CTA -->
    <button
      trackEvent="click_solicitar_propuesta"
      trackPlacement="section"
      trackLabel="Solicitar Propuesta Beneficios">
      Solicitar Propuesta
    </button>

    <!-- Footer CTA -->
    <button
      trackEvent="click_solicitar_propuesta"
      trackPlacement="footer"
      trackLabel="Solicitar Propuesta Footer">
      Solicitar Propuesta
    </button>

    <!-- WhatsApp en diferentes ubicaciones -->
    <a
      href="https://wa.me/573208663691"
      trackEvent="click_whatsapp"
      trackPlacement="cta_section"
      trackLabel="WhatsApp CTA Section">
      Contactar
    </a>
  `
})
export class RegalosCorporativosComponent {}
