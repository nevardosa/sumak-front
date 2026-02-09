import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RECAPTCHA_CONSTANTS } from '../constants/recaptcha.constants';

declare global {
  interface Window {
    grecaptcha: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class RecaptchaService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly siteKey = environment.recaptcha.siteKey;

  /**
   * Execute reCAPTCHA v3 and get token with timeout and retry
   * @param action - Action name for analytics (use RECAPTCHA_CONSTANTS.ACTIONS)
   * @returns Promise with reCAPTCHA token
   * @throws Error if reCAPTCHA fails or times out
   */
  async executeRecaptcha(action: string): Promise<string> {
    if (!this.isBrowser) {
      throw new Error('reCAPTCHA solo funciona en navegador');
    }

    if (!window.grecaptcha) {
      throw new Error('reCAPTCHA no está cargado. Verifica tu conexión.');
    }

    try {
      return await this.executeWithTimeout(action, RECAPTCHA_CONSTANTS.EXECUTION_TIMEOUT_MS);
    } catch (error) {
      // Retry once
      console.warn('reCAPTCHA first attempt failed, retrying...', error);
      return await this.executeWithTimeout(action, RECAPTCHA_CONSTANTS.EXECUTION_TIMEOUT_MS);
    }
  }

  /**
   * Execute reCAPTCHA with timeout
   */
  private executeWithTimeout(action: string, timeoutMs: number): Promise<string> {
    return Promise.race([
      this.executeRecaptchaInternal(action),
      this.createTimeout(timeoutMs)
    ]);
  }

  /**
   * Internal reCAPTCHA execution
   */
  private executeRecaptchaInternal(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(this.siteKey, { action })
          .then((token: string) => {
            if (!token || token.length < 20) {
              reject(new Error('Token de reCAPTCHA inválido'));
            } else {
              resolve(token);
            }
          })
          .catch((error: any) => {
            reject(new Error(`Error de reCAPTCHA: ${error.message || 'Desconocido'}`));
          });
      });
    });
  }

  /**
   * Create timeout promise
   */
  private createTimeout(ms: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('reCAPTCHA timeout. Intenta nuevamente.'));
      }, ms);
    });
  }

  /**
   * Check if reCAPTCHA is loaded
   */
  isLoaded(): boolean {
    return this.isBrowser && !!window.grecaptcha;
  }
}
