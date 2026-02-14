import { Injectable, inject } from '@angular/core';
import { AnalyticsService } from './analytics.service';

export type CheckoutEventName =
  | 'checkout_opened'
  | 'checkout_confirm_clicked'
  | 'pdf_generated'
  | 'pdf_downloaded'
  | 'pdf_link_created'
  | 'whatsapp_opened'
  | 'whatsapp_message_copied'
  | 'checkout_completed_intent'
  | 'checkout_error';

@Injectable({
  providedIn: 'root'
})
export class CheckoutAnalyticsService {
  private readonly analytics = inject(AnalyticsService);

  track(event: CheckoutEventName, metadata?: Record<string, any>): void {
    this.analytics.track(event as any, {
      ...metadata,
      timestamp: Date.now()
    });
  }
}
