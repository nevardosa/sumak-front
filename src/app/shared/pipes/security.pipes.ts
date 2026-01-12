import { Pipe, PipeTransform, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SecuritySanitizerService } from '../../core/services/security-sanitizer.service';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  private readonly securityService = inject(SecuritySanitizerService);

  transform(value: string): SafeHtml {
    if (!value) return '';
    
    // Check for malicious content first
    if (this.securityService.containsMaliciousContent(value)) {
      console.warn('[SECURITY] Malicious content detected and blocked');
      return '';
    }

    return this.securityService.sanitizeHtml(value);
  }
}

@Pipe({
  name: 'secureText',
  standalone: true
})
export class SecureTextPipe implements PipeTransform {
  private readonly securityService = inject(SecuritySanitizerService);

  transform(value: string, maxLength: number = 255): string {
    if (!value) return '';
    
    return this.securityService.sanitizeInput(value, maxLength);
  }
}

@Pipe({
  name: 'securePrice',
  standalone: true
})
export class SecurePricePipe implements PipeTransform {
  private readonly securityService = inject(SecuritySanitizerService);

  transform(value: number, originalHash?: string): string {
    const validation = this.securityService.validatePrice(value, originalHash);
    
    if (!validation.isValid) {
      console.warn('[SECURITY] Price validation failed:', validation.errors);
      return '0';
    }

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(Number(validation.sanitizedValue));
  }
}