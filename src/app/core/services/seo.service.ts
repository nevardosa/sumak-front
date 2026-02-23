import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: string;
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly baseUrl = 'https://sumakgourmet.co';

  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private titleService: Title,
    private metaService: Meta
  ) {}

  updateMetaTags(config: SeoConfig): void {
    // Title
    this.titleService.setTitle(config.title);

    // Description
    this.metaService.updateTag({
      name: 'description',
      content: config.description
    });

    // Keywords
    if (config.keywords) {
      this.metaService.updateTag({
        name: 'keywords',
        content: config.keywords
      });
    }

    // Open Graph
    this.metaService.updateTag({
      property: 'og:title',
      content: config.ogTitle || config.title
    });

    this.metaService.updateTag({
      property: 'og:description',
      content: config.ogDescription || config.description
    });

    if (config.ogImage) {
      this.metaService.updateTag({
        property: 'og:image',
        content: config.ogImage
      });
    }

    if (config.ogUrl) {
      this.metaService.updateTag({
        property: 'og:url',
        content: config.ogUrl
      });
    }

    this.metaService.updateTag({
      property: 'og:type',
      content: 'website'
    });

    // Twitter Card
    this.metaService.updateTag({
      name: 'twitter:card',
      content: config.twitterCard || 'summary_large_image'
    });

    this.metaService.updateTag({
      name: 'twitter:title',
      content: config.ogTitle || config.title
    });

    this.metaService.updateTag({
      name: 'twitter:description',
      content: config.ogDescription || config.description
    });

    if (config.ogImage) {
      this.metaService.updateTag({
        name: 'twitter:image',
        content: config.ogImage
      });
    }

    // Canonical URL
    if (config.canonicalUrl) {
      this.setCanonicalUrl(config.canonicalUrl);
    }
  }

  setCanonicalUrl(url: string): void {
    const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    
    link.setAttribute('href', fullUrl);
  }

  addOrganizationSchema(): void {
    const existingScript = this.doc.getElementById('organization-schema');
    if (existingScript) {
      return;
    }

    const script = this.doc.createElement('script');
    script.id = 'organization-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Sumak Gourmet",
      "url": "https://sumakgourmet.co",
      "logo": "https://sumakgourmet.co/assets/images/logo.png",
      "description": "Rituales gastronómicos premium y experiencias gourmet curadas en Colombia. Regalos corporativos con curaduría experta.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "CO",
        "addressLocality": "Colombia"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+57-320-866-3691",
        "contactType": "customer service",
        "email": "suumak25@gmail.com",
        "availableLanguage": ["Spanish"],
        "areaServed": "CO"
      },
      "sameAs": [
        "https://www.instagram.com/sumakgourmet",
        "https://www.facebook.com/sumakgourmet"
      ]
    });
    this.doc.head.appendChild(script);
  }

  addWebSiteSchema(): void {
    const existingScript = this.doc.getElementById('website-schema');
    if (existingScript) {
      return;
    }

    const script = this.doc.createElement('script');
    script.id = 'website-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Sumak Gourmet",
      "url": "https://sumakgourmet.co",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://sumakgourmet.co/catalog?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    });
    this.doc.head.appendChild(script);
  }

  addLocalBusinessSchema(): void {
    const existingScript = this.doc.getElementById('local-business-schema');
    if (existingScript) {
      return;
    }

    const script = this.doc.createElement('script');
    script.id = 'local-business-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": "Sumak Gourmet",
      "image": "https://sumakgourmet.co/assets/images/logo.png",
      "@id": "https://sumakgourmet.co",
      "url": "https://sumakgourmet.co",
      "telephone": "+57-320-866-3691",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Bogotá",
        "addressLocality": "Bogotá",
        "addressRegion": "Cundinamarca",
        "postalCode": "110111",
        "addressCountry": "CO"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 4.7110,
        "longitude": -74.0721
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "18:00"
      },
      "sameAs": [
        "https://www.instagram.com/sumakgourmet",
        "https://www.facebook.com/sumakgourmet"
      ],
      "areaServed": {
        "@type": "GeoCircle",
        "geoMidpoint": {
          "@type": "GeoCoordinates",
          "latitude": 4.7110,
          "longitude": -74.0721
        },
        "geoRadius": "500000"
      },
      "servesCuisine": "Gourmet Colombian",
      "paymentAccepted": "Cash, Credit Card, Debit Card",
      "currenciesAccepted": "COP"
    });
    this.doc.head.appendChild(script);
  }

  addBreadcrumbSchema(items: Array<{name: string, url: string}>): void {
    const existingScript = this.doc.getElementById('breadcrumb-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.doc.createElement('script');
    script.id = 'breadcrumb-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": `${this.baseUrl}${item.url}`
      }))
    });
    this.doc.head.appendChild(script);
  }

  removeSchema(id: string): void {
    const script = this.doc.getElementById(id);
    if (script) {
      script.remove();
    }
  }

  addProductSchema(product: any): void {
    const existingScript = this.doc.getElementById('product-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const schema: any = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": [`${this.baseUrl}/${product.imageUrl}`],
      "description": product.description,
      "sku": product.id,
      "brand": {
        "@type": "Brand",
        "name": "Sumak Gourmet"
      },
      "offers": {
        "@type": "Offer",
        "url": `${this.baseUrl}/ritual/${product.slug}`,
        "priceCurrency": "COP",
        "price": product.price,
        "availability": "https://schema.org/InStock",
        "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "name": "Sumak Gourmet"
        }
      },
      "category": product.category
    };

    // Solo agregar aggregateRating si hay reseñas reales
    // TODO: Integrar con sistema de reseñas real (Google Reviews, Trustpilot, etc.)
    // if (product.reviews && product.reviews.count > 0) {
    //   schema.aggregateRating = {
    //     "@type": "AggregateRating",
    //     "ratingValue": product.reviews.rating,
    //     "reviewCount": product.reviews.count,
    //     "bestRating": "5",
    //     "worstRating": "1"
    //   };
    // }

    const script = this.doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'product-schema';
    script.text = JSON.stringify(schema);
    this.doc.head.appendChild(script);
  }

  removeProductSchema(productId: string): void {
    const script = this.doc.getElementById('product-schema');
    if (script) {
      script.remove();
    }
  }

  addFAQSchema(faqs: any[]): void {
    const existingScript = this.doc.getElementById('faq-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = this.doc.createElement('script');
    script.id = 'faq-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    });
    this.doc.head.appendChild(script);
  }

  addSpeakableSchema(): void {
    const existingScript = this.doc.getElementById('speakable-schema');
    if (existingScript) {
      return;
    }

    const script = this.doc.createElement('script');
    script.id = 'speakable-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Rituales Gastronómicos Premium Colombia",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["h1", ".hero-subtitle", ".benefit-item h3"]
      }
    });
    this.doc.head.appendChild(script);
  }

  addHowToSchema(): void {
    const existingScript = this.doc.getElementById('howto-schema');
    if (existingScript) {
      return;
    }

    const script = this.doc.createElement('script');
    script.id = 'howto-schema';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "HowTo",
      "name": "Cómo comprar rituales gastronómicos en Sumak Gourmet",
      "description": "Guía paso a paso para comprar experiencias gourmet premium",
      "totalTime": "PT5M",
      "step": [
        {
          "@type": "HowToStep",
          "position": 1,
          "name": "Explora el catálogo",
          "text": "Navega por nuestros rituales premium, clásicos y exclusivos",
          "url": "https://sumakgourmet.co/catalog"
        },
        {
          "@type": "HowToStep",
          "position": 2,
          "name": "Selecciona tu ritual",
          "text": "Elige el ritual perfecto para tu ocasión especial"
        },
        {
          "@type": "HowToStep",
          "position": 3,
          "name": "Completa tu pedido",
          "text": "Proporciona datos de entrega y confirma tu compra por WhatsApp"
        }
      ]
    });
    this.doc.head.appendChild(script);
  }
}
