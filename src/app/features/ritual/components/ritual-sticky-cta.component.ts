import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-ritual-sticky-cta',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="sticky-cta">
      <div class="sticky-cta__content">
        <div class="sticky-cta__info">
          <span class="sticky-cta__price">{{ price }}</span>
        </div>
        <div class="sticky-cta__actions">
          <app-button
            variant="secondary"
            size="md"
            [loading]="loading"
            (clicked)="onPrimaryClick()"
            [attr.aria-label]="'Regalar ' + ritualName">
            {{ loading ? 'Agregando...' : 'Regalar' }}
          </app-button>
          <button 
            class="btn-secondary-cta"
            (click)="onSecondaryClick()"
            [attr.aria-label]="'Solicitar propuesta corporativa para ' + ritualName">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sticky-cta {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fff;
      border-top: 1px solid #e5e7eb;
      padding: 1rem;
      z-index: 50;
      box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .sticky-cta__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .sticky-cta__info {
      flex-shrink: 0;
    }

    .sticky-cta__price {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--sumak-green, #1a4d2e);
    }

    .sticky-cta__actions {
      display: flex;
      gap: 0.75rem;
      flex: 1;
      justify-content: flex-end;
    }

    .btn-secondary-cta {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      color: var(--sumak-green, #1a4d2e);
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary-cta:hover {
      background: #e5e7eb;
      border-color: var(--sumak-gold, #D4AF37);
    }

    .btn-secondary-cta:active {
      transform: scale(0.95);
    }

    .icon {
      width: 24px;
      height: 24px;
    }

    @media (min-width: 1024px) {
      .sticky-cta {
        display: none;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RitualStickyCTAComponent {
  @Input() price: string = '';
  @Input() ritualName: string = '';
  @Input() loading: boolean = false;
  @Output() primaryClick = new EventEmitter<void>();
  @Output() secondaryClick = new EventEmitter<void>();

  onPrimaryClick(): void {
    this.primaryClick.emit();
  }

  onSecondaryClick(): void {
    this.secondaryClick.emit();
  }
}
