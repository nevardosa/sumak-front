import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CatalogService } from '../catalog/services/catalog.service';
import { CartService } from '../catalog/services/cart.service';
import { SeoService } from '../../core/services/seo.service';
import { AnalyticsService } from '../../core/services/analytics.service';
import { Product } from '../catalog/models/catalog.models';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RitualBadgesComponent } from './components/ritual-badges.component';
import { RitualCorporateBlockComponent } from './components/ritual-corporate-block.component';
import { RitualFaqComponent } from './components/ritual-faq.component';
import { RitualStickyCTAComponent } from './components/ritual-sticky-cta.component';
import { MiniCartDrawerComponent } from '../catalog/components/mini-cart-drawer/mini-cart-drawer.component';
import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-ritual-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    ButtonComponent,
    RitualBadgesComponent,
    RitualCorporateBlockComponent,
    RitualFaqComponent,
    RitualStickyCTAComponent,
    MiniCartDrawerComponent,
    ToastComponent
  ],
  templateUrl: './ritual-detail.component.html',
  styleUrls: ['./ritual-detail.component.scss']
})
export class RitualDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalogService = inject(CatalogService);
  private readonly cartService = inject(CartService);
  private readonly seoService = inject(SeoService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly destroy$ = new Subject<void>();

  readonly ritual = signal<Product | null>(null);
  readonly loading = signal(true);
  readonly addingToCart = signal(false);
  
  // Toast notification
  readonly showToast = signal(false);
  readonly toastTitle = signal('');
  readonly toastMessage = signal('');
  
  // Mini cart drawer
  readonly showMiniCart = signal(false);
  readonly miniCartProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const slug = params['slug'];
        this.loadRitual(slug);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.seoService.removeSchema('product-schema');
    this.seoService.removeSchema('breadcrumb-schema');
    this.seoService.removeSchema('faq-schema');
  }

  private loadRitual(slug: string): void {
    this.loading.set(true);
    
    const product = this.catalogService.getProductBySlug(slug);
    
    if (!product) {
      this.router.navigate(['/catalog']);
      return;
    }

    this.ritual.set(product);
    this.loading.set(false);
    this.setupSEO(product);
    this.trackRitualView(product);
  }

  private trackRitualView(product: Product): void {
    this.analyticsService.trackRitualView(product.name, product.id, product.price);
  }

  private setupSEO(product: Product): void {
    const title = product.metaTitle || `${product.name} | Ritual Gastronómico Premium | Sumak Gourmet`;
    const description = product.metaDescription || product.description;
    const url = `https://sumakgourmet.co/ritual/${product.slug}`;

    this.seoService.updateMetaTags({
      title,
      description,
      keywords: product.keywords?.join(', ') || `${product.name}, ritual gastronómico, regalo premium colombia`,
      ogTitle: product.ogTitle || title,
      ogDescription: product.ogDescription || description,
      ogImage: product.ogImage || `https://sumakgourmet.co/${product.imageUrl}`,
      ogUrl: url,
      canonicalUrl: `/ritual/${product.slug}`
    });

    // Product Schema
    this.seoService.addProductSchema(product);

    // Breadcrumb Schema
    this.seoService.addBreadcrumbSchema([
      { name: 'Inicio', url: '/' },
      { name: 'Catálogo', url: '/catalog' },
      { name: product.name, url: `/ritual/${product.slug}` }
    ]);

    // FAQ Schema (solo si hay FAQs en el producto)
    if (product.faqs && product.faqs.length > 0) {
      this.seoService.addFAQSchema(product.faqs);
    }
  }

  onAddToCart(): void {
    const product = this.ritual();
    if (!product || this.addingToCart()) return;

    this.addingToCart.set(true);
    this.cartService.addToCart(product);
    this.analyticsService.trackAddToCart(product.name, product.id, product.price);
    
    // Show toast notification
    this.showAddToCartNotification(product);
    
    // Show mini cart drawer after brief delay
    setTimeout(() => {
      this.addingToCart.set(false);
      this.showMiniCartDrawer(product);
    }, 400);
  }

  private showAddToCartNotification(product: Product): void {
    this.toastTitle.set('Producto agregado');
    this.toastMessage.set(`${product.name} se agregó al carrito`);
    this.showToast.set(true);
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
    this.onCloseMiniCart();
    this.router.navigate(['/catalog']);
  }

  onMiniCartCheckout(): void {
    this.onCloseMiniCart();
    // Navigate to catalog with checkout modal open
    this.router.navigate(['/catalog'], { 
      queryParams: { checkout: 'true' } 
    });
  }

  onToastClosed(): void {
    this.showToast.set(false);
  }

  onWhatsAppOrder(): void {
    const product = this.ritual();
    if (!product) return;

    this.analyticsService.trackWhatsAppClick(product.name, 'pdp');

    const message = encodeURIComponent(
      `Hola, me interesa el ritual ${product.name}. ¿Podrían darme más información?`
    );
    
    if (isPlatformBrowser(this.platformId)) {
      window.open(
        `https://wa.me/573208663691?text=${message}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  }

  onCorporateInquiry(): void {
    const ritual = this.ritual();
    this.analyticsService.trackCorporateInquiry(ritual?.name);
    
    this.router.navigate(['/cotizacion-corporativa'], {
      queryParams: { ritual: ritual?.slug }
    });
  }

  getHighlightedIngredients(): string {
    const ritual = this.ritual();
    if (!ritual?.decisionSummary?.highlightedIngredients) return '';
    return ritual.decisionSummary.highlightedIngredients.join(', ');
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }
}
