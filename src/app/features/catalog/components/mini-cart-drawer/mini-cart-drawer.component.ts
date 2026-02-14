import { Component, Output, EventEmitter, Input, ChangeDetectionStrategy, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Product } from '../../models/catalog.models';

@Component({
  selector: 'app-mini-cart-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mini-cart-drawer.component.html',
  styleUrl: './mini-cart-drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MiniCartDrawerComponent implements OnInit, OnDestroy {
  @Input({ required: true }) product!: Product;
  @Input() subtotal: number = 0;
  @Output() close = new EventEmitter<void>();
  @Output() viewCart = new EventEmitter<void>();
  @Output() checkout = new EventEmitter<void>();

  private previousFocusedElement: HTMLElement | null = null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Guardar elemento con foco actual
    this.previousFocusedElement = document.activeElement as HTMLElement;
    
    // Bloquear scroll del fondo
    document.body.style.overflow = 'hidden';
    
    // Enfocar el drawer para accesibilidad
    setTimeout(() => {
      const drawer = document.querySelector('.mini-cart-drawer') as HTMLElement;
      drawer?.focus();
    }, 100);
  }

  ngOnDestroy(): void {
    // Restaurar scroll
    document.body.style.overflow = '';
    
    // Restaurar foco
    if (this.previousFocusedElement) {
      this.previousFocusedElement.focus();
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    event.preventDefault();
    this.onClose();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onViewCart(): void {
    this.viewCart.emit();
    this.onClose();
  }

  onCheckout(): void {
    this.checkout.emit();
    this.onClose();
  }

  onContinueShopping(): void {
    this.onClose();
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
