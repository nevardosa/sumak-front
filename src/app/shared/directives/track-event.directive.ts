import { Directive, HostListener, Input } from '@angular/core';
import { AnalyticsService, AnalyticsEventName, AnalyticsPlacement } from '../../core/services/analytics.service';

/**
 * TrackEvent Directive
 * 
 * Reusable directive for tracking click events on buttons, links, and other elements.
 * Maintains accessibility and doesn't interfere with navigation.
 * 
 * @example
 * ```html
 * <!-- Button tracking -->
 * <button 
 *   trackEvent="click_solicitar_propuesta"
 *   trackPlacement="hero"
 *   trackLabel="Solicitar Propuesta">
 *   Solicitar Propuesta
 * </button>
 * 
 * <!-- Link tracking -->
 * <a 
 *   href="mailto:info@sumakgourmet.co"
 *   trackEvent="click_email"
 *   trackPlacement="footer">
 *   Contáctanos
 * </a>
 * 
 * <!-- WhatsApp tracking -->
 * <a 
 *   href="https://wa.me/573208663691"
 *   trackEvent="click_whatsapp"
 *   trackPlacement="floating"
 *   target="_blank">
 *   WhatsApp
 * </a>
 * ```
 */
@Directive({
  selector: '[trackEvent]',
  standalone: true
})
export class TrackEventDirective {
  @Input() trackEvent!: AnalyticsEventName;
  @Input() trackPlacement?: AnalyticsPlacement;
  @Input() trackLabel?: string;
  @Input() trackFormId?: string;

  constructor(private analytics: AnalyticsService) {}

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    // Don't prevent default behavior - let navigation/actions happen
    this.analytics.track(this.trackEvent, {
      placement: this.trackPlacement,
      cta_label: this.trackLabel,
      form_id: this.trackFormId
    });
  }
}
