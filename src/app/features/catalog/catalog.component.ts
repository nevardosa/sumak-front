import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CatalogService } from './services/catalog.service';
import { CartService } from './services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product, ProductCategory } from './models/catalog.models';
import { ProductCardComponent } from './components/product-card/product-card.component';
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
    ToastComponent, 
    MiniCartDrawerComponent,
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
  private readonly platformId = inject(PLATFORM_ID);
  readonly cartService = inject(CartService);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  showCart = false;
  selectedCategory: ProductCategory | 'all' = 'all';

  // Toast notification
  showToast = signal(false);
  toastTitle = signal('');
  toastMessage = signal('');
  
  // Mini cart drawer
  showMiniCart = signal(false);
  miniCartProduct = signal<Product | null>(null);

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
    this.checkQueryParams();
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

  private checkQueryParams(): void {
    this.router.routerState.root.queryParams.subscribe(params => {
      if (params['checkout'] === 'true' && this.cartService.cart().items.length > 0) {
        // Redirect to layout-level checkout
        this.router.navigate(['/catalog']);
      }
    });
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
    // Mobile-first: Navigate to PDP
    if (isPlatformBrowser(this.platformId)) {
      const isMobile = window.innerWidth < 768;
      if (isMobile || true) { // Always navigate to PDP for better SEO
        this.router.navigate(['/ritual', product.slug]);
        return;
      }
    }
    
    // Desktop fallback (optional quick view - currently disabled)
    this.router.navigate(['/ritual', product.slug]);
  }

  onAddToCart(product: Product): void {
    // Add to cart from catalog (if needed)
    this.cartService.addToCart(product);
    this.showAddToCartNotification(product);
    
    // Show mini cart drawer
    setTimeout(() => {
      this.showMiniCartDrawer(product);
    }, 300);
  }

  private showMiniCartDrawer(product: Product): void {
    this.miniCartProduct.set(product);
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
      this.router.navigate(['/catalog'], { 
        queryParams: { checkout: 'true' } 
      });
    }, 300);
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

  private showAddToCartNotification(product: Product): void {
    this.toastTitle.set('Producto agregado');
    this.toastMessage.set(`${product.name} se agregó al carrito`);
    this.showToast.set(true);
  }

  onToastClosed(): void {
    this.showToast.set(false);
  }

  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
