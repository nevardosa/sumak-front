import { Component, inject, OnInit, OnDestroy, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from './services/catalog.service';
import { CartService } from './services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { Product, ProductCategory } from './models/catalog.models';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductModalComponent } from './components/product-modal/product-modal.component';
import { CartComponent } from './components/cart/cart.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, ProductCardComponent, ProductModalComponent, CartComponent, ToastComponent],
  templateUrl: './catalog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CatalogComponent implements OnInit, OnDestroy {
  private readonly catalogService = inject(CatalogService);
  private readonly seoService = inject(SeoService);
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
  }

  onCloseModal(): void {
    this.showProductModal = false;
    this.selectedProduct = null;
  }

  onAddToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.showAddToCartNotification(product);
    this.triggerCartShake();
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
