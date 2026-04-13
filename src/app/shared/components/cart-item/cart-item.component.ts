import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../features/catalog/models/catalog.models';
import { QuantitySelectorComponent } from '../quantity-selector/quantity-selector.component';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, QuantitySelectorComponent],
  template: `
    <div class="cart-item">
      <div class="item-image">
        <img 
          [src]="item.product.imageUrl" 
          [alt]="item.product.name"
          class="w-full h-full object-cover"
          loading="lazy"
        >
        <div class="category-badge">{{ getCategoryLabel(item.product.category) }}</div>
      </div>
      
      <div class="item-content">
        <div class="item-header">
          <h3 class="item-name">{{ item.product.name }}</h3>
          <button
            (click)="onRemove()"
            class="remove-btn"
            type="button"
            aria-label="Eliminar producto"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
        
        <p class="item-description">{{ item.product.experience }}</p>
        
        <div class="item-footer">
          <div class="price-section">
            <span class="unit-price">{{ formatPrice(item.product.price) }}</span>
            <span class="total-price">{{ formatPrice(item.product.price * item.quantity) }}</span>
          </div>
          
          <app-quantity-selector
            [quantity]="item.quantity"
            (quantityChange)="onQuantityChange($event)"
          ></app-quantity-selector>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cart-item {
      @apply flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-sumak-gold/30 
             transition-all duration-300 hover:shadow-md;
    }
    
    .item-image {
      @apply relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100;
    }
    
    .category-badge {
      @apply absolute top-1 right-1 px-1.5 py-0.5 bg-sumak-green/90 text-white text-xs 
             rounded-md font-medium backdrop-blur-sm;
    }
    
    .item-content {
      @apply flex-1 min-w-0;
    }
    
    .item-header {
      @apply flex items-start justify-between gap-2 mb-2;
    }
    
    .item-name {
      @apply font-against text-base font-medium text-sumak-green leading-tight;
    }
    
    .remove-btn {
      @apply p-1 text-gray-400 hover:text-red-500 rounded-md transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-red-500/20;
    }
    
    .item-description {
      @apply text-sm text-text-body line-clamp-2 mb-3 leading-relaxed;
    }
    
    .item-footer {
      @apply flex items-center justify-between;
    }
    
    .price-section {
      @apply flex flex-col;
    }
    
    .unit-price {
      @apply text-xs text-text-body;
    }
    
    .total-price {
      @apply text-base font-semibold text-sumak-green;
    }
    
    /* Responsive adjustments */
    @media (max-width: 640px) {
      .cart-item {
        @apply p-3 gap-3;
      }
      
      .item-image {
        @apply w-16 h-16;
      }
      
      .item-name {
        @apply text-sm;
      }
      
      .item-description {
        @apply text-xs;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<{ productId: string; quantity: number }>();
  @Output() remove = new EventEmitter<string>();

  private readonly priceFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  formatPrice(price: number): string {
    return this.priceFormatter.format(price);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      'premium': 'Premium',
      'classic': 'Clásico',
      'exclusive': 'Exclusivo'
    };
    return labels[category] || category;
  }

  onQuantityChange(quantity: number): void {
    this.quantityChange.emit({ productId: this.item.product.id, quantity });
  }

  onRemove(): void {
    this.remove.emit(this.item.product.id);
  }
}