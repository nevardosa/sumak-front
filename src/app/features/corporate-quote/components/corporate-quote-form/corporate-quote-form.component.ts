import { Component, ChangeDetectionStrategy, signal, inject, output, OnInit, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CorporateQuoteService } from '../../services/corporate-quote.service';
import { CheckoutService } from '../../../catalog/services/checkout.service';
import { RecaptchaService } from '../../../../core/services/recaptcha.service';
import { FormStatus } from '../../models/corporate-quote.interface';
import { environment } from '../../../../../environments/environment';
import { RECAPTCHA_CONSTANTS } from '../../../../core/constants/recaptcha.constants';

@Component({
  selector: 'app-corporate-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './corporate-quote-form.component.html',
  styleUrls: ['./corporate-quote-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateQuoteFormComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly quoteService = inject(CorporateQuoteService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly recaptchaService = inject(RecaptchaService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  // Security state
  private readonly securityViolations = signal(0);
  private securityIntervals: ReturnType<typeof setInterval>[] = [];
  private formAccessTime = Date.now();
  private interactionCount = 0;
  private lastInteractionTime = Date.now();

  readonly formStatus = signal<FormStatus>(FormStatus.IDLE);
  readonly errorMessage = signal<string>('');
  readonly showSuccessScreen = signal<boolean>(false);
  readonly successScreenChange = output<boolean>();
  readonly FormStatus = FormStatus;

  readonly quoteForm: FormGroup = this.fb.group({
    nombreCompleto: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(80),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]],
    empresa: ['', [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(120),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,&\-()]+$/)
    ]],
    cargo: ['', [
      Validators.minLength(2),
      Validators.maxLength(80),
      Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
    ]],
    email: ['', [
      Validators.required,
      Validators.email,
      Validators.maxLength(254),
      Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/)
    ]],
    telefono: ['', [
      Validators.required,
      Validators.pattern(/^3[0-5][0-9]{8}$/),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]],
    cantidad: ['', [
      Validators.required,
      Validators.min(10),
      Validators.max(5000),
      Validators.pattern(/^[0-9]+$/)
    ]],
    nota: ['', [
      Validators.maxLength(400)
    ]],
    honeypot: [''] // Anti-bot honeypot
  });

  constructor() {
    if (this.isBrowser && environment.security.antiDebugEnabled) {
      this.initializeSecurityMeasures();
    }
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.startSecurityMonitoring();
      this.logSecurityAccess();
      this.setupFormInteractionTracking();
    }
  }

  ngOnDestroy(): void {
    this.cleanupSecurityMeasures();
  }

  /**
   * Initialize comprehensive security measures
   * Military-grade protection against tampering
   */
  private initializeSecurityMeasures(): void {
    this.preventDevTools();
    this.preventInspection();
    this.preventTampering();
  }

  /**
   * Prevent developer tools access
   */
  private preventDevTools(): void {
    if (!this.isBrowser) return;

    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 's') ||
          (e.ctrlKey && e.key === 'a') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        this.handleSecurityViolation('DevTools access attempt on corporate form');
        return false;
      }
      return true;
    });

    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleSecurityViolation('Context menu access attempt on corporate form');
      return false;
    });
  }

  /**
   * Prevent code inspection and tampering
   */
  private preventInspection(): void {
    if (!this.isBrowser) return;

    const consoleInterval = setInterval(() => {
      console.clear();
      console.log('%cSUMAK CORPORATE SECURITY', 'color: #C5A572; font-size: 24px; font-weight: bold;');
      console.log('%cFormulario protegido - Acceso no autorizado prohibido', 'color: #dc2626; font-size: 16px;');
      console.log('%cTodas las actividades son monitoreadas', 'color: #dc2626; font-size: 14px;');
    }, 1000);
    
    this.securityIntervals.push(consoleInterval);
  }

  /**
   * Advanced anti-tampering measures
   */
  private preventTampering(): void {
    if (!this.isBrowser) return;

    const tamperInterval = setInterval(() => {
      const threshold = 160;
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        this.handleSecurityViolation('DevTools detected by window analysis');
      }
    }, 500);
    
    this.securityIntervals.push(tamperInterval);

    const debugInterval = setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        this.handleSecurityViolation('Debugger detected on corporate form');
      }
    }, 3000);
    
    this.securityIntervals.push(debugInterval);
  }

  /**
   * Start continuous security monitoring
   */
  private startSecurityMonitoring(): void {
    if (!this.isBrowser) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                this.handleSecurityViolation('Suspicious DOM manipulation detected');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Track form interactions for bot detection
   */
  private setupFormInteractionTracking(): void {
    if (!this.isBrowser) return;

    this.quoteForm.valueChanges.subscribe(() => {
      this.interactionCount++;
      this.lastInteractionTime = Date.now();
    });
  }

  /**
   * Handle security violations with escalating responses
   */
  private handleSecurityViolation(reason: string): void {
    const currentViolations = this.securityViolations() + 1;
    this.securityViolations.set(currentViolations);
    
    console.warn(`CORPORATE FORM SECURITY VIOLATION #${currentViolations}: ${reason}`);
    
    if (currentViolations >= 3) {
      this.executeSecurityLockdown();
    } else if (currentViolations >= 2) {
      this.redirectToSafePage();
    }
  }

  /**
   * Execute security lockdown procedures
   */
  private executeSecurityLockdown(): void {
    if (!this.isBrowser) return;

    this.quoteForm.reset();
    this.quoteForm.disable();
    this.errorMessage.set('Actividad sospechosa detectada. Formulario bloqueado por seguridad.');
    
    setTimeout(() => {
      window.location.href = '/home';
    }, 2000);
  }

  /**
   * Redirect to safe page after security violation
   */
  private redirectToSafePage(): void {
    setTimeout(() => {
      this.router.navigate(['/home']);
    }, 2000);
  }

  /**
   * Log security access for audit purposes
   */
  private logSecurityAccess(): void {
    if (!this.isBrowser) return;

    const accessLog = {
      timestamp: new Date().toISOString(),
      component: 'CorporateQuoteFormComponent',
      action: 'form_access',
      userAgent: navigator.userAgent,
      formType: 'corporate_quote'
    };
    
    console.log('CORPORATE FORM ACCESS LOG:', accessLog);
  }

  /**
   * Clean up security measures on component destruction
   */
  private cleanupSecurityMeasures(): void {
    this.securityIntervals.forEach(interval => clearInterval(interval));
    this.securityIntervals = [];
  }

  /**
   * Validate submission timing (bot detection)
   */
  private validateSubmissionTiming(): boolean {
    const timeSinceAccess = Date.now() - this.formAccessTime;
    const timeSinceLastInteraction = Date.now() - this.lastInteractionTime;

    // Too fast (< 3 seconds) = likely bot
    if (timeSinceAccess < 3000) {
      this.handleSecurityViolation('Form submitted too quickly (bot suspected)');
      return false;
    }

    // Too slow with no interactions = suspicious
    if (timeSinceLastInteraction > 300000 && this.interactionCount < 5) {
      this.handleSecurityViolation('Suspicious form behavior detected');
      return false;
    }

    // Too few interactions for complete form = suspicious
    if (this.interactionCount < 6) {
      this.handleSecurityViolation('Insufficient form interactions (bot suspected)');
      return false;
    }

    return true;
  }

  onSubmit(): void {
    if (this.quoteForm.invalid || this.formStatus() === FormStatus.SUBMITTING) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    // Honeypot check (anti-bot)
    if (this.quoteForm.get('honeypot')?.value) {
      this.handleSecurityViolation('Honeypot triggered - bot detected');
      return;
    }

    // Validate submission timing (bot detection)
    if (!this.validateSubmissionTiming()) {
      this.errorMessage.set('Error de validación. Por favor, intente nuevamente.');
      return;
    }

    this.formStatus.set(FormStatus.SUBMITTING);
    this.errorMessage.set('');

    // Execute reCAPTCHA v3 with centralized action
    this.recaptchaService.executeRecaptcha(RECAPTCHA_CONSTANTS.ACTIONS.CORPORATE_QUOTE)
      .then(token => {
        // Add token to form data using centralized constant
        const formData = {
          ...this.quoteForm.value,
          [RECAPTCHA_CONSTANTS.TOKEN_FIELD_NAME]: token
        };

        return this.quoteService.submitQuote(formData);
      })
      .then(() => {
        this.formStatus.set(FormStatus.SUCCESS);
        this.showSuccessScreen.set(true);
        this.successScreenChange.emit(true);
        this.quoteForm.reset();
        
        // Reset security counters
        this.interactionCount = 0;
        this.formAccessTime = Date.now();
        this.lastInteractionTime = Date.now();
      })
      .catch((error) => {
        this.formStatus.set(FormStatus.ERROR);
        const errorMsg = error.message || 'Error al enviar la solicitud';
        this.errorMessage.set(errorMsg);
        console.error('Submit error:', error);
        
        setTimeout(() => {
          this.formStatus.set(FormStatus.IDLE);
          this.errorMessage.set('');
        }, 5000);
      });
  }

  openWhatsApp(): void {
    if (this.quoteForm.invalid) {
      return;
    }

    try {
      const payload = this.quoteService['sanitizeAndValidate'](this.quoteForm.value);
      const message = this.quoteService.generateWhatsAppMessage(payload);
      this.checkoutService.openWhatsApp(message);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al abrir WhatsApp');
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.quoteForm.get(fieldName);
    if (!field || !field.touched || !field.errors) {
      return '';
    }

    const errors = field.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) {
      if (fieldName === 'email') return 'Email inválido. Formato: usuario@dominio.com';
      if (fieldName === 'telefono') return 'Celular inválido. Debe iniciar con 3 y tener 10 dígitos';
      return 'Formato inválido';
    }
    if (errors['email']) return 'Email inválido. Formato: usuario@dominio.com';
    if (errors['min']) return `Mínimo ${errors['min'].min} unidades`;
    if (errors['max']) return `Máximo ${errors['max'].max} unidades`;

    return 'Campo inválido';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToCatalog(): void {
    this.router.navigate(['/catalog']);
  }
}
