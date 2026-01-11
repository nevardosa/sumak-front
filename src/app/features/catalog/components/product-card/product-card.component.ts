import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/catalog.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  @Output() productClick = new EventEmitter<Product>();
  @Output() addToCart = new EventEmitter<Product>();

  // Cache optimizado
  private _priceCache = new Map<number, string>();
  private _categoryCache = new Map<string, { badge: string; label: string }>();

  onImageClick(): void {
    this.productClick.emit(this.product);
  }

  onAddToCart(event: Event): void {
    event.stopPropagation();
    this.addToCart.emit(this.product);
  }

  formatPrice(price: number): string {
    if (!this._priceCache.has(price)) {
      this._priceCache.set(price, new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      }).format(price));
    }
    return this._priceCache.get(price)!;
  }

  getCategoryBadgeClass(): string {
    const category = this.product.category;
    if (!this._categoryCache.has(category)) {
      const baseClass = 'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm';
      
      let badgeClass: string;
      switch (category) {
        case 'premium':
          badgeClass = `${baseClass} bg-sumak-gold/20 text-sumak-gold border border-sumak-gold/30`;
          break;
        case 'exclusive':
          badgeClass = `${baseClass} bg-sumak-wine/20 text-sumak-wine border border-sumak-wine/30`;
          break;
        default:
          badgeClass = `${baseClass} bg-sumak-green/20 text-sumak-green border border-sumak-green/30`;
      }
      
      const labels = {
        'classic': 'Clásico',
        'premium': 'Premium', 
        'exclusive': 'Exclusivo'
      };
      
      this._categoryCache.set(category, {
        badge: badgeClass,
        label: labels[category as keyof typeof labels] || 'Clásico'
      });
    }
    return this._categoryCache.get(category)!.badge;
  }

  getCategoryLabel(): string {
    const category = this.product.category;
    if (!this._categoryCache.has(category)) {
      this.getCategoryBadgeClass(); // Esto populará el cache
    }
    return this._categoryCache.get(category)!.label;
  }
}