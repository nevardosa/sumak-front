import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Servicio para gestionar prerendering de páginas críticas
 * Páginas a prerender: Home, Catálogo, Detalle de ritual, FAQ
 */
@Injectable({ providedIn: 'root' })
export class PrerenderService {
  
  private readonly CRITICAL_ROUTES = [
    '/',
    '/catalog',
    '/faq'
  ] as const;

  constructor(private router: Router) {}

  /**
   * Verifica si la ruta actual es crítica para SEO
   */
  isCriticalRoute(url: string): boolean {
    return this.CRITICAL_ROUTES.includes(url as any) || 
           this.isProductRoute(url);
  }

  /**
   * Verifica si es una ruta de producto/ritual
   */
  private isProductRoute(url: string): boolean {
    return /^\/ritual\/[a-z0-9-]+$/.test(url);
  }

  /**
   * Obtiene rutas para prerendering estático
   */
  getStaticRoutes(): string[] {
    return [...this.CRITICAL_ROUTES];
  }

  /**
   * Genera rutas dinámicas de productos para prerendering
   */
  generateProductRoutes(products: { name: string }[]): string[] {
    return products.map(product => 
      `/ritual/${this.createSlug(product.name)}`
    );
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