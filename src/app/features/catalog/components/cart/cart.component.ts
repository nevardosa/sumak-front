import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CheckoutModalComponent } from '../checkout/checkout-modal.component';
import { CartItemComponent } from '../../../../shared/components/cart-item/cart-item.component';
import { CartItem } from '../../models/catalog.models';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CheckoutModalComponent, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartComponent {
  @Output() close = new EventEmitter<void>();
  
  private readonly priceFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  });

  readonly cartService = inject(CartService);
  readonly showCheckoutModal = signal(false);
  readonly isProcessing = signal(false);

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  formatPrice(price: number): string {
    if (typeof price !== 'number' || isNaN(price) || price < 0) {
      return '$0';
    }
    return this.priceFormatter.format(price);
  }

  onQuantityChange(event: { productId: string; quantity: number }): void {
    if (!event.productId || typeof event.productId !== 'string' || 
        typeof event.quantity !== 'number' || event.quantity < 1 || event.quantity > 99) {
      return;
    }
    this.cartService.updateQuantity(event.productId, event.quantity);
  }

  onRemoveItem(productId: string): void {
    if (!productId || typeof productId !== 'string') {
      return;
    }
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    if (this.cartService.cart().items.length > 0 && !this.isProcessing()) {
      this.isProcessing.set(true);
      
      // Simulate processing delay for better UX
      setTimeout(() => {
        this.showCheckoutModal.set(true);
        this.isProcessing.set(false);
      }, 800);
    }
  }

  onCloseCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }

  trackByProductId(index: number, item: CartItem): string {
    return item.product.id;
  }

  // Legacy methods for backward compatibility
  updateQuantity(productId: string, quantity: number): void {
    this.onQuantityChange({ productId, quantity });
  }

  removeItem(productId: string): void {
    this.onRemoveItem(productId);
  }
}