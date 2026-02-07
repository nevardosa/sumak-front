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
}
