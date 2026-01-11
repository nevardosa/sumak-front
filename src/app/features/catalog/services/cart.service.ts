import { Injectable, signal, computed } from '@angular/core';
import { Cart, CartItem, Product, Order, OrderStatus, PaymentInfo } from '../models/catalog.models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItems = signal<CartItem[]>([]);
  
  // Computed signals para el estado del carrito
  readonly cart = computed<Cart>(() => {
    const items = this.cartItems();
    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    return { items, total, itemCount };
  });

  readonly paymentInfo: PaymentInfo = {
    bankAccount: 'Cuenta de Ahorros',
    accountType: 'Ahorros',
    accountNumber: '1234-5678-9012-3456',
    bankName: 'Banco SUMAK Gourmet'
  };

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Actualizar cantidad si el producto ya existe
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity
      };
      this.cartItems.set(updatedItems);
    } else {
      // Agregar nuevo producto
      const newItem: CartItem = {
        product,
        quantity,
        addedAt: new Date()
      };
      this.cartItems.set([...currentItems, newItem]);
    }
  }

  removeFromCart(productId: string): void {
    const currentItems = this.cartItems();
    this.cartItems.set(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItems();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    this.cartItems.set(updatedItems);
  }

  clearCart(): void {
    this.cartItems.set([]);
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}