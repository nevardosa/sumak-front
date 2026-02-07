import { inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AnalyticsService } from '../services/analytics.service';
import { Title } from '@angular/platform-browser';

/**
 * Route-to-Event mapping for key pages
 */
const ROUTE_EVENT_MAP: Record<string, string> = {
  '/regalos-corporativos': 'view_regalos_corporativos',
  '/contact': 'view_contacto',
  '/experiencias': 'view_experiencias',
  '/catalog': 'view_catalog'
};

/**
 * Analytics Route Tracking Provider
 * 
 * Automatically tracks SPA navigation and fires page_view + specific view events.
 * 
 * Usage: Add to app.config.ts providers array
 * 
 * @example
 * ```typescript
 * export const appConfig: ApplicationConfig = {
 *   providers: [
 *     provideRouter(routes),
 *     provideAnalyticsRouteTracking()
 *   ]
 * };
 * ```
 */
export function provideAnalyticsRouteTracking() {
  return {
    provide: 'ANALYTICS_ROUTE_TRACKING',
    useFactory: () => {
      const router = inject(Router);
      const analytics = inject(AnalyticsService);
      const titleService = inject(Title);

      // Track initial page view (only in browser)
      if (typeof window !== 'undefined') {
        const initialPath = window.location.pathname;
        const initialTitle = titleService.getTitle();
        
        // Small delay to ensure GTM is loaded
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            analytics.trackPageView(initialPath, initialTitle);
            trackSpecificViewEvent(initialPath, analytics);
          }
        }, 100);
      }

      // Track subsequent navigation
      router.events
        .pipe(
          filter((event): event is NavigationEnd => event instanceof NavigationEnd)
        )
        .subscribe((event: NavigationEnd) => {
          // Get current page title
          const pageTitle = titleService.getTitle();
          const pagePath = event.urlAfterRedirects;

          // Track page view
          analytics.trackPageView(pagePath, pageTitle);

          // Track specific view events for key pages
          trackSpecificViewEvent(pagePath, analytics);
        });

      return null;
    },
    multi: true
  };
}

/**
 * Track specific view events for key pages
 */
function trackSpecificViewEvent(path: string, analytics: AnalyticsService): void {
  // Remove query params and hash for matching
  const cleanPath = path.split('?')[0].split('#')[0];
  
  const eventName = ROUTE_EVENT_MAP[cleanPath];
  if (eventName) {
    analytics.track(eventName as any, {
      page_path: cleanPath
    });
  }
}
