import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private readonly platformId = inject(PLATFORM_ID);
  private loaded = false;
  private loading = false;
  private readonly siteKey = '6Lf1yGUsAAAAAPWDonLO7z9GlhDvJzF0zpuk9kSv';

  /**
   * Lazy load reCAPTCHA script only when needed
   * Improves initial page load performance
   */
  loadRecaptcha(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return Promise.resolve();
    }

    if (this.loaded) {
      return Promise.resolve();
    }

    if (this.loading) {
      return this.waitForLoad();
    }

    this.loading = true;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.loaded = true;
        this.loading = false;
        resolve();
      };

      script.onerror = () => {
        this.loading = false;
        reject(new Error('Failed to load reCAPTCHA'));
      };

      document.head.appendChild(script);
    });
  }

  private waitForLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.loaded) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);
    });
  }

  async execute(action: string): Promise<string> {
    await this.loadRecaptcha();

    if (!isPlatformBrowser(this.platformId)) {
      return '';
    }

    return new Promise((resolve, reject) => {
      (window as any).grecaptcha.ready(() => {
        (window as any).grecaptcha
          .execute(this.siteKey, { action })
          .then((token: string) => resolve(token))
          .catch((error: any) => reject(error));
      });
    });
  }

  // Alias for backward compatibility
  executeRecaptcha(action: string): Promise<string> {
    return this.execute(action);
  }

  isLoaded(): boolean {
    return this.loaded;
  }
}
