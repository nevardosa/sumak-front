import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';
import { SecuritySanitizerService } from '../../core/services/security-sanitizer.service';

@Directive({
  selector: '[appSecureContent]',
  standalone: true
})
export class SecureContentDirective implements OnInit {
  @Input() appSecureContent: string = '';
  @Input() maxLength: number = 255;

  private readonly el = inject(ElementRef);
  private readonly securityService = inject(SecuritySanitizerService);

  ngOnInit(): void {
    this.updateContent();
  }

  @Input() set content(value: string) {
    this.appSecureContent = value;
    this.updateContent();
  }

  private updateContent(): void {
    if (!this.appSecureContent) return;

    // Check for malicious content
    if (this.securityService.containsMaliciousContent(this.appSecureContent)) {
      console.warn('[SECURITY] Malicious content blocked in directive');
      this.el.nativeElement.textContent = '[Content blocked for security]';
      return;
    }

    // Sanitize and set content
    const sanitized = this.securityService.sanitizeInput(this.appSecureContent, this.maxLength);
    this.el.nativeElement.textContent = sanitized;
  }
}

@Directive({
  selector: '[appSecureHtml]',
  standalone: true
})
export class SecureHtmlDirective implements OnInit {
  @Input() appSecureHtml: string = '';

  private readonly el = inject(ElementRef);
  private readonly securityService = inject(SecuritySanitizerService);

  ngOnInit(): void {
    this.updateHtml();
  }

  @Input() set html(value: string) {
    this.appSecureHtml = value;
    this.updateHtml();
  }

  private updateHtml(): void {
    if (!this.appSecureHtml) return;

    // Check for malicious content
    if (this.securityService.containsMaliciousContent(this.appSecureHtml)) {
      console.warn('[SECURITY] Malicious HTML content blocked');
      this.el.nativeElement.innerHTML = '<span style="color: red;">[HTML content blocked for security]</span>';
      return;
    }

    // Sanitize HTML content
    const sanitizedHtml = this.securityService.sanitizeHtml(this.appSecureHtml);
    this.el.nativeElement.innerHTML = sanitizedHtml;
  }
}

@Directive({
  selector: '[appSecureInput]',
  standalone: true
})
export class SecureInputDirective implements OnInit {
  @Input() maxLength: number = 255;
  @Input() allowedPattern: string = '';

  private readonly el = inject(ElementRef);
  private readonly securityService = inject(SecuritySanitizerService);

  ngOnInit(): void {
    this.setupInputValidation();
  }

  private setupInputValidation(): void {
    const input = this.el.nativeElement as HTMLInputElement;

    input.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      let value = target.value;

      // Check for malicious content
      if (this.securityService.containsMaliciousContent(value)) {
        console.warn('[SECURITY] Malicious input blocked');
        target.value = '';
        return;
      }

      // Apply pattern if specified
      if (this.allowedPattern) {
        const regex = new RegExp(this.allowedPattern);
        if (!regex.test(value)) {
          target.value = value.slice(0, -1); // Remove last character
          return;
        }
      }

      // Sanitize input
      const sanitized = this.securityService.sanitizeInput(value, this.maxLength);
      if (sanitized !== value) {
        target.value = sanitized;
      }
    });

    input.addEventListener('paste', (event) => {
      event.preventDefault();
      const paste = (event.clipboardData || (window as any).clipboardData).getData('text');
      
      if (this.securityService.containsMaliciousContent(paste)) {
        console.warn('[SECURITY] Malicious paste content blocked');
        return;
      }

      const sanitized = this.securityService.sanitizeInput(paste, this.maxLength);
      input.value = sanitized;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  }
}