import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, ProductCategory } from '../../models/catalog.models';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-modal.component.html',
  styleUrl: './product-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductModalComponent {
  @Input({ required: true }) product!: Product;
  @Output() close = new EventEmitter<void>();
  @Output() addToCart = new EventEmitter<Product>();

  showImageZoom = false;

  onClose(): void {
    this.close.emit();
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onImageClick(): void {
    this.showImageZoom = true;
  }

  onCloseImageZoom(): void {
    this.showImageZoom = false;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getCategoryClass(category: ProductCategory): string {
    const classes = {
      [ProductCategory.PREMIUM]: 'bg-sumak-green/10 text-sumak-green',
      [ProductCategory.CLASSIC]: 'bg-sumak-gold/10 text-sumak-brown',
      [ProductCategory.EXCLUSIVE]: 'bg-sumak-wine/10 text-sumak-wine'
    };
    return classes[category] || 'bg-gray-100 text-gray-600';
  }

  getCategoryLabel(category: ProductCategory): string {
    const labels = {
      [ProductCategory.PREMIUM]: 'Premium',
      [ProductCategory.CLASSIC]: 'Clásico',
      [ProductCategory.EXCLUSIVE]: 'Exclusivo'
    };
    return labels[category] || category;
  }
}