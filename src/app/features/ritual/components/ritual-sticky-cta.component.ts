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
            [attr.aria-label]="'Reservar este ritual ' + ritualName">
            {{ loading ? 'Agregando...' : 'Reservar este ritual' }}
          </app-button>
          <button
            class="btn-icon"
            type="button"
            (click)="onSecondaryClick()"
            [attr.aria-label]="'Solicitar propuesta corporativa para ' + ritualName">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
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
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(8px);
      border-top: 1px solid #f0f0f0;
      padding: 0.875rem 1rem;
      z-index: 50;
      box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.06);
    }

    .sticky-cta__content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.875rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .sticky-cta__info {
      flex-shrink: 0;
    }

    .sticky-cta__price {
      font-size: 1.375rem;
      font-weight: 600;
      color: var(--sumak-green, #1a4d2e);
      letter-spacing: -0.02em;
    }

    .sticky-cta__actions {
      display: flex;
      gap: 0.625rem;
      flex: 1;
      justify-content: flex-end;
    }

    .btn-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 48px;
      height: 48px;
      background: #fafafa;
      border: 1px solid #f0f0f0;
      border-radius: 0.375rem;
      color: var(--sumak-green, #1a4d2e);
      cursor: pointer;
      transition: all 0.15s ease;
      padding: 0;
    }

    .btn-icon:hover {
      background: #f5f5f5;
      border-color: rgba(212, 175, 55, 0.3);
    }

    .btn-icon:active {
      transform: scale(0.97);
    }

    .icon {
      width: 22px;
      height: 22px;
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
