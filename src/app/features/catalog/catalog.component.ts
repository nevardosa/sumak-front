import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogService } from './services/catalog.service';
import { CartService } from './services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product, ProductCategory } from './models/catalog.models';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CartComponent } from './components/cart/cart.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { MiniCartDrawerComponent } from './components/mini-cart-drawer/mini-cart-drawer.component';
import { CheckoutModalComponent } from './components/checkout/checkout-modal.component';
import { CustomConciergeSectionComponent } from '../../shared/components/custom-concierge-section/custom-concierge-section.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [
    CommonModule, 
    ProductCardComponent, 
    ProductModalComponent, 
    CartComponent, 
    ToastComponent, 
    MiniCartDrawerComponent, 
    CheckoutModalComponent,
    CustomConciergeSectionComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit, OnDestroy {
  private readonly catalogService = inject(CatalogService);
  private readonly seoService = inject(SeoService);
  private readonly router = inject(Router);
  readonly cartService = inject(CartService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  selectedProduct: Product | null = null;
  showProductModal = false;
  showCart = false;
  selectedCategory: ProductCategory | 'all' = 'all';

  // Toast notification
  showToast = signal(false);
  toastTitle = signal('');
  toastMessage = signal('');
  cartShake = signal(false);
  
  // Mini cart drawer
  showMiniCart = signal(false);
  miniCartProduct = signal<Product | null>(null);
  miniCartSubtotal = signal(0);
  
  // Checkout modal
  showCheckoutModal = signal(false);
  
  // CTA button state
  ctaButtonAdded = signal(false);

  readonly categories = [
    { value: 'all', label: 'Todos los rituales', count: 0 },
    { value: ProductCategory.CLASSIC, label: 'Clásicos', count: 0 },
    { value: ProductCategory.PREMIUM, label: 'Premium', count: 0 },
    { value: ProductCategory.EXCLUSIVE, label: 'Exclusivos', count: 0 }
  ];

  ngOnInit(): void {
    this.setSeoMetadata();
    this.loadProducts();
    this.updateCategoryCounts();
  }

  ngOnDestroy(): void {
    this.seoService.removeSchema('breadcrumb-schema');
  }

  private setSeoMetadata(): void {
    this.seoService.updateMetaTags({
      title: 'Catálogo de Rituales Gastronómicos Premium | Sumak Gourmet',
      description: 'Explora nuestros rituales gastronómicos premium: clásicos, premium y exclusivos. Chocolate 70% cacao, frutos secos seleccionados, mieles infusionadas. Envíos a toda Colombia.',
      keywords: 'catálogo sumak, rituales gastronómicos, chocolate premium colombia, regalos gourmet, experiencias gastronómicas, comprar rituales sumak',
      ogTitle: 'Catálogo de Rituales Gastronómicos | Sumak Gourmet',
      ogDescription: 'Descubre rituales gastronómicos curados con ingredientes premium. Clásicos, Premium y Exclusivos.',
      ogImage: 'https://sumakgourmet.co/assets/images/og-cover.jpg',
      ogUrl: 'https://sumakgourmet.co/catalog',
      canonicalUrl: '/catalog'
    });

    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Catálogo', url: '/catalog' }
    ]);
  }

  private loadProducts(): void {
    this.products = this.catalogService.getProducts();
    this.filterProducts();
  }

  private updateCategoryCounts(): void {
    this.categories[0].count = this.products.length;
    this.categories[1].count = this.products.filter(p => p.category === ProductCategory.CLASSIC).length;
    this.categories[2].count = this.products.filter(p => p.category === ProductCategory.PREMIUM).length;
    this.categories[3].count = this.products.filter(p => p.category === ProductCategory.EXCLUSIVE).length;
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category as ProductCategory | 'all';
    this.filterProducts();
  }

  private filterProducts(): void {
    if (this.selectedCategory === 'all') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product =>
        product.category === this.selectedCategory
      );
    }
  }

  onProductClick(product: Product): void {
    this.selectedProduct = product;
    this.showProductModal = true;
    this.seoService.addProductSchema(product);
  }

  onCloseModal(): void {
    if (this.selectedProduct) {
      this.seoService.removeProductSchema(this.selectedProduct.id);
    }
    this.showProductModal = false;
    this.selectedProduct = null;
    this.ctaButtonAdded.set(false);
  }

  onAddToCart(product: Product): void {
    // 1. Feedback inmediato en botón
    this.ctaButtonAdded.set(true);
    
    // 2. Agregar al carrito
    this.cartService.addToCart(product);
    
    // 3. Mostrar toast premium
    this.showAddToCartNotification(product);
    
    // 4. Animar FAB
    this.triggerCartShake();
    
    // 5. Cerrar modal después de 700ms
    setTimeout(() => {
      this.onCloseModal();
    }, 700);
    
    // 6. Mostrar mini cart drawer después de 800ms
    setTimeout(() => {
      this.showMiniCartDrawer(product);
    }, 800);
  }

  private showMiniCartDrawer(product: Product): void {
    this.miniCartProduct.set(product);
    this.miniCartSubtotal.set(this.cartService.cart().total);
    this.showMiniCart.set(true);
  }

  onCloseMiniCart(): void {
    this.showMiniCart.set(false);
    this.miniCartProduct.set(null);
  }

  onMiniCartViewCart(): void {
    this.showCart = true;
  }

  onMiniCartCheckout(): void {
    // Cerrar mini cart y abrir checkout modal
    this.onCloseMiniCart();
    setTimeout(() => {
      this.openCheckoutModal();
    }, 300);
  }

  openCheckoutModal(): void {
    // Cerrar cualquier modal o drawer activo
    this.showProductModal = false;
    this.showCart = false;
    this.showMiniCart.set(false);
    
    // Abrir checkout modal
    setTimeout(() => {
      this.showCheckoutModal.set(true);
    }, 100);
  }

  onCloseCheckoutModal(): void {
    this.showCheckoutModal.set(false);
  }

  openCustomRitualContact(): void {
    const message = encodeURIComponent(
      'Hola, quiero diseñar un ritual personalizado con una bebida específica.'
    );
    window.open(
      `https://wa.me/573208663691?text=${message}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  private triggerCartShake(): void {
    this.cartShake.set(true);
    setTimeout(() => this.cartShake.set(false), 600);
  }

  private showAddToCartNotification(product: Product): void {
    this.toastTitle.set('Producto agregado');
    this.toastMessage.set(`${product.name} se agregó al carrito`);
    this.showToast.set(true);
  }

  onToastClosed(): void {
    this.showToast.set(false);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
