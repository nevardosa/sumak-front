import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EnterpriseSEOService } from '../services/enterprise-seo.service';

/**
 * Guard SEO para automatizar optimización de páginas
 * Aplica SEO básico según la ruta
 */
@Injectable({ providedIn: 'root' })
export class SEOGuard implements CanActivate {

  constructor(private seoService: EnterpriseSEOService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Aplicar SEO automático según la ruta
    this.applySEOByRoute(state.url, route);
    return true;
  }

  private applySEOByRoute(url: string, route: ActivatedRouteSnapshot): void {
    if (url === '/') {
      this.seoService.updateHomePage();
    } else if (url === '/catalog') {
      this.seoService.updateCatalogPage();
    } else if (url.startsWith('/ritual/')) {
      // SEO de producto se maneja en el componente con datos reales
      return;
    } else if (url === '/faq') {
      // FAQ SEO se maneja en el componente con datos reales
      return;
    } else if (url.includes('/search')) {
      const query = route.queryParams['q'] || '';
      this.seoService.updateSearchPage(query, false);
    }
  }
}