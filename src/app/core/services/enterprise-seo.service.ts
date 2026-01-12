import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AdvancedSecurityService } from './advanced-security.service';

interface SEOConfig {
  readonly title: string;
  readonly description: string;
  readonly keywords?: string;
  readonly canonical?: string;
  readonly ogType?: 'website' | 'article' | 'product';
  readonly ogImage?: string;
  readonly structuredData?: Record<string, any>;
  readonly structuredDataId?: string;
  readonly noIndex?: boolean;
}

interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: string;
  readonly image?: string;
  readonly availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
}

interface FAQ {
  readonly question: string;
  readonly answer: string;
}

/**
 * Enterprise SEO Service
 * Implementa structured data real y mantenible según estándares Schema.org
 * Sin datos no verificables ni exageraciones
 */
@Injectable({ providedIn: 'root' })
export class EnterpriseSEOService {
  private readonly document = inject(DOCUMENT);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);
  private readonly router = inject(Router);
  private readonly security = inject(AdvancedSecurityService);

  private readonly BRAND_CONFIG = {
    name: 'SUMAK Gourmet',
    tagline: 'Experiencias Gastronómicas Premium',
    description: 'Experiencias gastronómicas premium y rituales gourmet en Colombia.',
    url: 'https://sumakgourmet.com',
    logo: 'https://sumakgourmet.com/assets/logo-sumak.png',
    foundingDate: '2024',
    phone: '+573208663691',
    email: 'suumak25@gmail.com',
    locale: 'es_CO'
  } as const;

  constructor() {
    this.injectGlobalStructuredData();
    this.setupRouteTracking();
  }

  private setupRouteTracking(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.updateCanonicalUrl(event.urlAfterRedirects);
      });
  }

  /**
   * Actualiza SEO de página con datos reales
   */
  updatePageSEO(config: SEOConfig): void {
    const sanitized = this.sanitizeConfig(config);
    const fullTitle = this.buildFullTitle(sanitized.title);
    
    this.updateTitle(fullTitle);
    this.updateMetaTags(sanitized);
    this.updateOpenGraph(fullTitle, sanitized);
    this.updateTwitterCards(fullTitle, sanitized);
    
    if (sanitized.canonical) {
      this.updateCanonicalUrl(sanitized.canonical);
    }
    
    if (sanitized.structuredData) {
      this.injectStructuredData(sanitized.structuredData, sanitized.structuredDataId || 'ld-page');
    }
  }

  /**
   * Home page SEO
   */
  updateHomePage(): void {
    this.updatePageSEO({
      title: 'Experiencias Gastronómicas Premium',
      description: 'Descubre rituales gourmet únicos y experiencias gastronómicas premium en Colombia.',
      keywords: 'experiencias gourmet, rituales gastronómicos, productos premium Colombia',
      canonical: '/',
      ogType: 'website'
    });
  }

  /**
   * Catálogo SEO
   */
  updateCatalogPage(): void {
    this.updatePageSEO({
      title: 'Catálogo de Rituales Gourmet',
      description: 'Explora nuestro catálogo de rituales gastronómicos y experiencias gourmet premium.',
      keywords: 'catálogo gourmet, rituales gastronómicos, experiencias premium',
      canonical: '/catalog',
      ogType: 'website',
      structuredData: this.createItemListSchema('catalog'),
      structuredDataId: 'ld-catalog'
    });
  }

  /**
   * Producto/Ritual SEO con datos reales
   */
  updateProductPage(product: Product): void {
    this.updatePageSEO({
      title: product.name,
      description: product.description,
      keywords: `${product.name}, ${product.category}, ritual gourmet`,
      canonical: `/ritual/${this.createSlug(product.name)}`,
      ogType: 'product',
      ogImage: product.image,
      structuredData: this.createProductSchema(product),
      structuredDataId: 'ld-product'
    });
    
    // Breadcrumbs para producto
    this.injectBreadcrumbs([
      { name: 'Inicio', url: '/' },
      { name: 'Catálogo', url: '/catalog' },
      { name: product.category, url: `/catalog?category=${encodeURIComponent(product.category)}` },
      { name: product.name }
    ]);
  }

  /**
   * FAQ page SEO (solo si hay FAQs reales)
   */
  updateFAQPage(faqs: FAQ[] = []): void {
    if (!faqs.length) {
      // SEO básico sin structured data si no hay FAQs
      this.updatePageSEO({
        title: 'Preguntas Frecuentes',
        description: 'Información sobre nuestros rituales gourmet y experiencias gastronómicas.',
        keywords: 'información, rituales gourmet, experiencias gastronómicas',
        canonical: '/faq',
        ogType: 'website'
      });
      return;
    }
    
    this.updatePageSEO({
      title: 'Preguntas Frecuentes',
      description: 'Respuestas a preguntas frecuentes sobre nuestros rituales gourmet y experiencias gastronómicas.',
      keywords: 'preguntas frecuentes, FAQ, rituales gourmet, experiencias gastronómicas',
      canonical: '/faq',
      ogType: 'website',
      structuredData: this.createFAQSchema(faqs),
      structuredDataId: 'ld-faq'
    });
  }

  /**
   * Páginas de búsqueda/filtros con noindex
   */
  updateSearchPage(query: string, hasResults: boolean): void {
    this.updatePageSEO({
      title: `Buscar: ${query}`,
      description: `Resultados de búsqueda para "${query}" en rituales gourmet.`,
      canonical: `/search?q=${encodeURIComponent(query)}`,
      ogType: 'website',
      noIndex: true // Siempre noindex para búsquedas
    });
  }

  /**
   * Breadcrumbs estructurados
   */
  injectBreadcrumbs(breadcrumbs: { name: string; url?: string }[]): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        ...(crumb.url && { item: this.normalizeUrl(crumb.url) })
      }))
    };
    this.injectStructuredData(schema, 'ld-breadcrumbs');
  }

  // PRIVATE METHODS

  private sanitizeConfig(config: SEOConfig): SEOConfig {
    return {
      title: this.security.sanitizeInput(config.title),
      description: this.security.sanitizeInput(config.description),
      keywords: config.keywords ? this.security.sanitizeInput(config.keywords) : undefined,
      canonical: config.canonical,
      ogType: config.ogType || 'website',
      ogImage: config.ogImage,
      structuredData: config.structuredData,
      structuredDataId: config.structuredDataId,
      noIndex: config.noIndex
    };
  }

  private buildFullTitle(pageTitle: string): string {
    return `${pageTitle} | ${this.BRAND_CONFIG.name}`;
  }

  private updateTitle(fullTitle: string): void {
    this.title.setTitle(fullTitle);
  }

  private updateMetaTags(config: SEOConfig): void {
    this.meta.updateTag({ name: 'description', content: config.description });
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }
    this.meta.updateTag({ name: 'robots', content: config.noIndex ? 'noindex,nofollow' : 'index,follow' });
    this.meta.updateTag({ name: 'language', content: 'es-CO' });
  }

  private updateOpenGraph(fullTitle: string, config: SEOConfig): void {
    const ogTags = [
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: config.description },
      { property: 'og:type', content: config.ogType || 'website' },
      { property: 'og:url', content: config.canonical ? this.normalizeUrl(config.canonical) : this.getCurrentUrl() },
      { property: 'og:site_name', content: this.BRAND_CONFIG.name },
      { property: 'og:image', content: config.ogImage || this.BRAND_CONFIG.logo },
      { property: 'og:locale', content: this.BRAND_CONFIG.locale }
    ];

    ogTags.forEach(tag => this.meta.updateTag(tag));
  }

  private updateTwitterCards(fullTitle: string, config: SEOConfig): void {
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: config.description },
      { name: 'twitter:image', content: config.ogImage || this.BRAND_CONFIG.logo }
    ];

    twitterTags.forEach(tag => this.meta.updateTag(tag));
  }

  private injectGlobalStructuredData(): void {
    this.injectStructuredData(this.createOrganizationSchema(), 'ld-org');
    this.injectStructuredData(this.createWebsiteSchema(), 'ld-website');
  }

  /**
   * Organization schema con datos reales únicamente
   */
  private createOrganizationSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.BRAND_CONFIG.url}#organization`,
      name: this.BRAND_CONFIG.name,
      url: this.BRAND_CONFIG.url,
      logo: {
        '@type': 'ImageObject',
        '@id': `${this.BRAND_CONFIG.url}#logo`,
        url: this.BRAND_CONFIG.logo
      },
      description: this.BRAND_CONFIG.description,
      foundingDate: this.BRAND_CONFIG.foundingDate,
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: this.BRAND_CONFIG.phone,
        email: this.BRAND_CONFIG.email,
        contactType: 'customer service',
        availableLanguage: 'Spanish'
      },
      sameAs: ['https://wa.me/573208663691']
    };
  }

  /**
   * Website schema enlazado semánticamente
   */
  private createWebsiteSchema(): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.BRAND_CONFIG.url}#website`,
      name: this.BRAND_CONFIG.name,
      url: this.BRAND_CONFIG.url,
      description: this.BRAND_CONFIG.description,
      publisher: {
        '@id': `${this.BRAND_CONFIG.url}#organization`
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.BRAND_CONFIG.url}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Product schema con datos reales únicamente
   */
  private createProductSchema(product: Product): Record<string, any> {
    const productUrl = `${this.BRAND_CONFIG.url}/ritual/${this.createSlug(product.name)}`;
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      '@id': productUrl,
      name: product.name,
      description: product.description,
      image: product.image || this.BRAND_CONFIG.logo,
      category: product.category,
      brand: {
        '@id': `${this.BRAND_CONFIG.url}#organization`
      },
      offers: {
        '@type': 'Offer',
        '@id': `${productUrl}#offer`,
        price: product.price,
        priceCurrency: 'COP',
        availability: `https://schema.org/${product.availability || 'InStock'}`,
        itemCondition: 'https://schema.org/NewCondition',
        url: productUrl,
        seller: {
          '@id': `${this.BRAND_CONFIG.url}#organization`
        }
      }
    };
  }

  /**
   * ItemList para catálogo
   */
  private createItemListSchema(listType: string): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      '@id': `${this.BRAND_CONFIG.url}/${listType}#itemlist`,
      name: `Catálogo ${this.BRAND_CONFIG.name}`,
      description: 'Lista de rituales gourmet y experiencias gastronómicas premium'
    };
  }

  /**
   * FAQ schema solo con datos reales
   */
  private createFAQSchema(faqs: FAQ[]): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      '@id': `${this.BRAND_CONFIG.url}/faq#faqpage`,
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };
  }

  private injectStructuredData(data: Record<string, any>, id: string): void {
    try {
      const safeId = this.security.sanitizeInput(id);
      const document = this.document as Document;
      
      let script = document.getElementById(safeId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = safeId;
        document.head.appendChild(script);
      }
      if (script) {
        script.textContent = JSON.stringify(data);
      }
    } catch (error) {
      console.error('Failed to inject structured data:', error);
    }
  }

  private updateCanonicalUrl(urlOrPath: string): void {
    try {
      const canonical = this.normalizeUrl(urlOrPath);
      const document = this.document as Document;
      
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      if (link) {
        link.href = canonical;
      }
    } catch (error) {
      console.error('Failed to update canonical URL:', error);
    }
  }

  private normalizeUrl(urlOrPath: string): string {
    if (!urlOrPath) return this.BRAND_CONFIG.url;
    if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
    const path = urlOrPath.startsWith('/') ? urlOrPath : `/${urlOrPath}`;
    return `${this.BRAND_CONFIG.url}${path}`;
  }

  private getCurrentUrl(): string {
    return `${this.BRAND_CONFIG.url}${this.router.url}`;
  }

  private createSlug(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}