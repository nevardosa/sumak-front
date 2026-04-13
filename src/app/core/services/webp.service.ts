import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class WebPService {
  private readonly platformId = inject(PLATFORM_ID);
  private supportsWebP: boolean | null = null;

  /**
   * Check if browser supports WebP
   */
  async checkWebPSupport(): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    if (this.supportsWebP !== null) {
      return this.supportsWebP;
    }

    return new Promise((resolve) => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        this.supportsWebP = webP.height === 2;
        resolve(this.supportsWebP);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Get optimized image URL (WebP if supported, fallback to original)
   */
  async getOptimizedImageUrl(originalUrl: string): Promise<string> {
    const supportsWebP = await this.checkWebPSupport();
    
    if (!supportsWebP) {
      return originalUrl;
    }

    // Convert .jpg/.png to .webp
    const webpUrl = originalUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    // Check if WebP version exists
    if (await this.imageExists(webpUrl)) {
      return webpUrl;
    }

    return originalUrl;
  }

  /**
   * Check if image URL exists
   */
  private async imageExists(url: string): Promise<boolean> {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  /**
   * Get picture element sources for responsive images
   */
  getPictureSources(baseUrl: string, sizes: number[] = [400, 800, 1200]): Array<{srcset: string, type: string, sizes?: string}> {
    const sources: Array<{srcset: string, type: string, sizes?: string}> = [];
    
    // WebP sources
    const webpSrcset = sizes.map(size => {
      const url = baseUrl.replace(/\.(jpg|jpeg|png)$/i, `-${size}w.webp`);
      return `${url} ${size}w`;
    }).join(', ');
    
    sources.push({
      srcset: webpSrcset,
      type: 'image/webp',
      sizes: '(max-width: 768px) 100vw, 50vw'
    });

    // Fallback sources
    const fallbackSrcset = sizes.map(size => {
      const ext = baseUrl.match(/\.(jpg|jpeg|png)$/i)?.[0] || '.jpg';
      const url = baseUrl.replace(/\.(jpg|jpeg|png)$/i, `-${size}w${ext}`);
      return `${url} ${size}w`;
    }).join(', ');
    
    sources.push({
      srcset: fallbackSrcset,
      type: 'image/jpeg',
      sizes: '(max-width: 768px) 100vw, 50vw'
    });

    return sources;
  }
}
