import { Component, ChangeDetectionStrategy, signal, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CorporateQuoteService } from '../../services/corporate-quote.service';
import { CheckoutService } from '../../../catalog/services/checkout.service';
import { FormStatus } from '../../models/corporate-quote.interface';

@Component({
  selector: 'app-corporate-quote-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './corporate-quote-form.component.html',
  styleUrls: ['./corporate-quote-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CorporateQuoteFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly quoteService = inject(CorporateQuoteService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly router = inject(Router);

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
    honeypot: ['']
  });

  onSubmit(): void {
    if (this.quoteForm.invalid || this.formStatus() === FormStatus.SUBMITTING) {
      this.quoteForm.markAllAsTouched();
      return;
    }

    this.formStatus.set(FormStatus.SUBMITTING);
    this.errorMessage.set('');

    this.quoteService.submitQuote(this.quoteForm.value).subscribe({
      next: () => {
        this.formStatus.set(FormStatus.SUCCESS);
        this.showSuccessScreen.set(true);
        this.successScreenChange.emit(true);
        this.quoteForm.reset();
      },
      error: (error) => {
        this.formStatus.set(FormStatus.ERROR);
        this.errorMessage.set(error.message || 'Error al enviar la solicitud');
        
        setTimeout(() => {
          this.formStatus.set(FormStatus.IDLE);
          this.errorMessage.set('');
        }, 5000);
      }
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
