import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartService } from '../features/catalog/services/cart.service';
import { CartComponent } from '../features/catalog/components/cart/cart.component';
import { CheckoutModalComponent } from '../features/catalog/components/checkout/checkout-modal.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, CartComponent, CheckoutModalComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  readonly cartService = inject(CartService);
  private readonly router = inject(Router);
  
  readonly showCart = signal(false);
  readonly showCheckoutModal = signal(false);

  ngOnInit(): void {
    this.checkQueryParams();
  }

  private checkQueryParams(): void {
    this.router.events.subscribe(() => {
      const params = this.router.routerState.root.snapshot.queryParams;
      if (params['checkout'] === 'true' && this.cartService.cart().items.length > 0) {
        setTimeout(() => {
          this.showCheckoutModal.set(true);
        }, 300);
      }
    });
  }

  toggleCart(): void {
    this.showCart.set(!this.showCart());
  }

  onCloseCart(): void {
    this.showCart.set(false);
  }

  onCheckout(): void {
    this.showCart.set(false);
    setTimeout(() => {
      this.showCheckoutModal.set(true);
    }, 100);
  }

  onCloseCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }
}