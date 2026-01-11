import { Component, Output, EventEmitter, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CheckoutModalComponent } from '../checkout/checkout-modal.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, ButtonComponent, CheckoutModalComponent],
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

  updateQuantity(productId: string, quantity: number): void {
    if (!productId || typeof productId !== 'string' || 
        typeof quantity !== 'number' || quantity < 1 || quantity > 99) {
      return;
    }
    this.cartService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string): void {
    if (!productId || typeof productId !== 'string') {
      return;
    }
    this.cartService.removeFromCart(productId);
  }

  onCheckout(): void {
    if (this.cartService.cart().items.length > 0) {
      this.showCheckoutModal.set(true);
    }
  }

  onCloseCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }
}