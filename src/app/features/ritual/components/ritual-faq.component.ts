import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RitualFAQ } from '../../catalog/models/catalog.models';

@Component({
  selector: 'app-ritual-faq',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="ritual-faq" *ngIf="faqs && faqs.length > 0">
      <h2 class="faq-title">Preguntas Frecuentes</h2>
      <div class="faq-list">
        <div *ngFor="let faq of faqs" class="faq-item">
          <h3 class="faq-question">{{ faq.question }}</h3>
          <p class="faq-answer">{{ faq.answer }}</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .ritual-faq {
      background: #f9fafb;
      padding: 1.5rem;
      border-radius: 0.5rem;
    }

    .faq-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sumak-green, #1a4d2e);
      margin-bottom: 1.5rem;
    }

    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .faq-item {
      background: #fff;
      padding: 1.25rem;
      border-radius: 0.5rem;
      border: 1px solid #e5e7eb;
    }

    .faq-question {
      font-size: 1rem;
      font-weight: 600;
      color: var(--sumak-green, #1a4d2e);
      margin-bottom: 0.75rem;
    }

    .faq-answer {
      font-size: 0.9375rem;
      line-height: 1.6;
      color: #4b5563;
      margin: 0;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RitualFaqComponent {
  @Input() faqs?: RitualFAQ[];
}
