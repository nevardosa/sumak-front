import { Injectable, inject } from '@angular/core';
import { CatalogService } from '../../features/catalog/services/catalog.service';

interface SitemapUrl {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  image?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SitemapService {
  private readonly catalogService = inject(CatalogService);
  private readonly baseUrl = 'https://sumakgourmet.co';

  generateSitemap(): string {
    const today = new Date().toISOString().split('T')[0];
    const urls: SitemapUrl[] = [
      // Main pages
      { loc: '/', lastmod: today, changefreq: 'weekly', priority: 1.0 },
      { loc: '/catalog', lastmod: today, changefreq: 'daily', priority: 0.9 },
      
      // Product pages (dynamic)
      ...this.getProductUrls(today),
      
      // Corporate & Services
      { loc: '/regalos-corporativos', lastmod: today, changefreq: 'weekly', priority: 0.9 },
      { loc: '/experiencias', lastmod: today, changefreq: 'weekly', priority: 0.8 },
      { loc: '/cotizacion-corporativa', lastmod: today, changefreq: 'monthly', priority: 0.8 },
      
      // Info pages
      { loc: '/about', lastmod: today, changefreq: 'monthly', priority: 0.7 },
      { loc: '/contact', lastmod: today, changefreq: 'monthly', priority: 0.7 },
      { loc: '/faq', lastmod: today, changefreq: 'monthly', priority: 0.6 },
      { loc: '/politica-tratamiento-datos', lastmod: today, changefreq: 'yearly', priority: 0.3 },
    ];

    return this.buildXML(urls);
  }

  private getProductUrls(date: string): SitemapUrl[] {
    const products = this.catalogService.getProducts();
    return products.map(product => ({
      loc: `/ritual/${product.slug}`,
      lastmod: date,
      changefreq: 'weekly' as const,
      priority: 0.9,
      image: product.imageUrl
    }));
  }

  private buildXML(urls: SitemapUrl[]): string {
    const urlsXML = urls.map(url => {
      const imageTag = url.image 
        ? `\n    <image:image>\n      <image:loc>${this.baseUrl}/${url.image}</image:loc>\n    </image:image>`
        : '';
      
      return `  <url>
    <loc>${this.baseUrl}${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>${imageTag}
  </url>`;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlsXML}
</urlset>`;
  }
}
