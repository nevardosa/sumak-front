import { Component, Output, EventEmitter, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SecureFormValidatorService } from '../../../../shared/services/secure-form-validator.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { CheckoutStatusModalComponent } from '../../../../shared/components/checkout-status-modal/checkout-status-modal.component';
import { DEPARTMENTS } from '../../constants/municipalities.constants';
import { ConfirmCheckoutUseCase, CheckoutStatus } from '../../../../core/use-cases/confirm-checkout.use-case';
import { CheckoutAnalyticsService } from '../../../../core/services/checkout-analytics.service';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-secure-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent, 
    SelectComponent, 
    CheckboxComponent,
    CheckoutStatusModalComponent
  ],
  templateUrl: './secure-checkout.component.html',
  styleUrl: './secure-checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureCheckoutComponent {
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly secureValidator = inject(SecureFormValidatorService);
  private readonly confirmCheckoutUseCase = inject(ConfirmCheckoutUseCase);
  private readonly analytics = inject(CheckoutAnalyticsService);
  readonly cartService = inject(CartService);

  readonly integrityValid = signal(true);
  readonly isProcessing = signal(false);
  readonly municipalities = signal<Array<{value: string, label: string}>>([]);
  readonly showStatusModal = signal(false);
  readonly checkoutStatus = signal<CheckoutStatus>({
    step: 'validating',
    message: 'Preparando...',
    progress: 0
  });
  readonly pdfUrl = signal<string | undefined>(undefined);
  readonly whatsappMessage = signal<string | undefined>(undefined);
  readonly breAccount = environment.payment.breAccount;

  readonly identificationTypes = [
    { value: 'CC', label: 'Cédula de Ciudadanía' },
    { value: 'CE', label: 'Cédula de Extranjería' },
    { value: 'TI', label: 'Tarjeta de Identidad' },
    { value: 'PP', label: 'Pasaporte' }
  ];

  readonly departments = DEPARTMENTS.map(dept => ({
    value: dept.id,
    label: dept.name
  }));

  readonly checkoutForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, this.secureValidator.nameValidator()]],
    lastName: ['', [Validators.required, this.secureValidator.nameValidator()]],
    identificationType: ['', Validators.required],
    identificationNumber: ['', [Validators.required, this.secureValidator.identificationValidator()]],
    email: ['', [Validators.required, this.secureValidator.secureEmailValidator()]],
    phone: ['', [Validators.required, this.secureValidator.securePhoneValidator()]],
    department: ['', Validators.required],
    municipality: [{ value: '', disabled: true }, Validators.required],
    address: ['', [Validators.required, this.secureValidator.addressValidator()]],
    acceptsDataProcessing: [false, Validators.requiredTrue]
  });

  async ngOnInit() {
    this.analytics.track('checkout_opened');
    const isValid = await this.cartService.validateMilitaryCartIntegrity();
    this.integrityValid.set(isValid);
  }

  onDepartmentChange(departmentId: string): void {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    const municipalityControl = this.checkoutForm.get('municipality');
    
    if (department) {
      this.municipalities.set(
        department.municipalities.map(mun => ({
          value: mun.id,
          label: mun.name
        }))
      );
      municipalityControl?.enable();
      municipalityControl?.setValue('');
    } else {
      this.municipalities.set([]);
      municipalityControl?.disable();
      municipalityControl?.setValue('');
    }
  }

  async copyBreAccount(): Promise<void> {
    try {
      await navigator.clipboard.writeText(this.breAccount);
      alert('Llave Bre-B copiada al portapapeles');
    } catch {
      alert('No se pudo copiar la llave');
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (field?.errors && field.touched) {
      const errors = field.errors;
      if (errors['required']) return 'Este campo es obligatorio';
      if (errors['invalidEmail']) return 'Email inválido';
      if (errors['invalidPhone']) return 'Teléfono inválido';
      if (errors['invalidName']) return 'Nombre inválido';
      if (errors['maliciousContent']) return 'Contenido no permitido';
      if (errors['minLength']) return `Mínimo ${errors['minLength'].minLength} caracteres`;
      if (errors['maxLength']) return `Máximo ${errors['maxLength'].maxLength} caracteres`;
    }
    return '';
  }

  async onSubmit(): Promise<void> {
    if (!this.checkoutForm.valid || !this.integrityValid()) return;

    this.isProcessing.set(true);

    try {
      const formData = this.secureValidator.sanitizeFormData(this.checkoutForm.value);
      
      const securityCheck = this.secureValidator.validateFormSecurity(formData);
      if (!securityCheck.isSecure) {
        console.error('[SECURITY] Form contains security issues:', securityCheck.issues);
        this.isProcessing.set(false);
        return;
      }

      this.showStatusModal.set(true);

      const result = await this.confirmCheckoutUseCase.execute(
        formData,
        (status) => this.checkoutStatus.set(status)
      );

      if (result.success) {
        this.pdfUrl.set(result.pdfUrl);
        this.whatsappMessage.set(result.whatsappMessage);
      } else {
        this.checkoutStatus.set({
          step: 'error',
          message: result.error || 'Error al procesar el pedido',
          progress: 0
        });
      }
    } catch (error) {
      console.error('[SECURITY] Checkout failed:', error);
      this.checkoutStatus.set({
        step: 'error',
        message: 'Error al procesar el pedido. Por favor, intente nuevamente.',
        progress: 0
      });
    } finally {
      this.isProcessing.set(false);
    }
  }

  onCloseStatusModal(): void {
    this.showStatusModal.set(false);
    if (this.checkoutStatus().step === 'completed') {
      this.onClose();
    }
  }

  onRetryCheckout(): void {
    this.showStatusModal.set(false);
    this.onSubmit();
  }

  async onCopyPdfLink(): Promise<void> {
    const url = this.pdfUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      alert('Link del PDF copiado al portapapeles');
    } catch {
      alert('No se pudo copiar el link');
    }
  }

  async onCopyWhatsAppMessage(): Promise<void> {
    const message = this.whatsappMessage();
    if (!message) return;

    const copied = await this.confirmCheckoutUseCase.copyMessageToClipboard(message);
    if (copied) {
      alert('Mensaje copiado al portapapeles');
    } else {
      alert('No se pudo copiar el mensaje');
    }
  }

  onOpenWhatsAppManual(): void {
    const message = this.whatsappMessage();
    if (message) {
      window.open(`https://wa.me/573208663691?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    }
  }

  onClose(): void {
    this.close.emit();
  }
}