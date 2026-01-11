import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/catalog.models';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
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
}