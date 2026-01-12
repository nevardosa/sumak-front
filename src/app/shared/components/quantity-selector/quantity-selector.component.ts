import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center gap-1">
      <button
        (click)="onDecrease()"
        [disabled]="quantity <= 1 || disabled"
        class="quantity-btn"
        [class.disabled]="quantity <= 1 || disabled"
        type="button"
        aria-label="Disminuir cantidad"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
        </svg>
      </button>
      
      <span class="quantity-display">{{ quantity }}</span>
      
      <button
        (click)="onIncrease()"
        [disabled]="quantity >= maxQuantity || disabled"
        class="quantity-btn"
        [class.disabled]="quantity >= maxQuantity || disabled"
        type="button"
        aria-label="Aumentar cantidad"
      >
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>
    </div>
  `,
  styles: [`
    .quantity-btn {
      @apply w-7 h-7 rounded-full border border-sumak-green/20 bg-white hover:bg-sumak-green/5 
             flex items-center justify-center text-sumak-green transition-all duration-200
             focus:outline-none focus:ring-2 focus:ring-sumak-gold/50 focus:ring-offset-1;
    }
    
    .quantity-btn:hover:not(.disabled) {
      @apply border-sumak-green/40 bg-sumak-green/10;
    }
    
    .quantity-btn.disabled {
      @apply opacity-40 cursor-not-allowed hover:bg-white hover:border-sumak-green/20;
    }
    
    .quantity-display {
      @apply w-8 text-center text-sm font-medium text-sumak-green;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuantitySelectorComponent {
  @Input() quantity: number = 1;
  @Input() maxQuantity: number = 99;
  @Input() disabled: boolean = false;
  @Output() quantityChange = new EventEmitter<number>();

  onIncrease(): void {
    if (this.quantity < this.maxQuantity && !this.disabled) {
      this.quantityChange.emit(this.quantity + 1);
    }
  }

  onDecrease(): void {
    if (this.quantity > 1 && !this.disabled) {
      this.quantityChange.emit(this.quantity - 1);
    }
  }
}