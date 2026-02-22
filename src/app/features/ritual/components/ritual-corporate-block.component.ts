import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateOptions } from '../../catalog/models/catalog.models';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-ritual-corporate-block',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <section class="corporate-block" *ngIf="options?.available">
      <h2 class="corporate-title">Opciones Corporativas</h2>

      <div class="corporate-benefits">
        <div *ngFor="let benefit of getBenefits()" class="benefit-item">
          <svg class="benefit-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ benefit }}</span>
        </div>
      </div>

      <app-button
        variant="outline"
        size="md"
        (clicked)="onCorporateClick()">
        Solicitar cotización
      </app-button>
    </section>
  `,
  styles: [`
    .corporate-block {
      background: linear-gradient(135deg, #f9fafb 0%, #ffffff 100%);
      padding: 2rem 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #e5e7eb;
    }

    .corporate-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--sumak-green, #1a4d2e);
      margin-bottom: 1.5rem;
    }

    .corporate-benefits {
      display: grid;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .benefit-item {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      font-size: 0.9375rem;
      color: #374151;
      font-weight: 500;
    }

    .benefit-icon {
      width: 20px;
      height: 20px;
      color: var(--sumak-gold, #D4AF37);
      flex-shrink: 0;
      margin-top: 2px;
    }

    @media (min-width: 768px) {
      .corporate-benefits {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RitualCorporateBlockComponent {
  @Input() options?: CorporateOptions;
  @Output() corporateClick = new EventEmitter<void>();

  getBenefits(): string[] {
    if (!this.options) return [];

    const benefits = this.options.benefits || [];

    if (benefits.length > 0) {
      return benefits;
    }

    // Default benefits if not specified
    const defaultBenefits: string[] = [];

    if (this.options.customization) {
      defaultBenefits.push('Personalización disponible');
    }
    if (this.options.bulkDiscount) {
      defaultBenefits.push('Descuentos por volumen');
    }
    if (this.options.minQuantity) {
      defaultBenefits.push(`Pedido mínimo: ${this.options.minQuantity} unidades`);
    }
    if (this.options.multiDestination) {
      defaultBenefits.push('Envío a múltiples destinos');
    }
    if (this.options.invoicing) {
      defaultBenefits.push('Facturación empresarial');
    }
    if (this.options.sla) {
      defaultBenefits.push(`SLA garantizado: ${this.options.sla}`);
    }

    return defaultBenefits.length > 0 ? defaultBenefits : [
      'Personalización disponible',
      'Descuentos por volumen',
      'Facturación empresarial',
      'Soporte dedicado'
    ];
  }

  onCorporateClick(): void {
    this.corporateClick.emit();
  }
}
