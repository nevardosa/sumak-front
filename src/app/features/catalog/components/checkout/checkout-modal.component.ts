import { Component, Output, EventEmitter, inject, OnInit, OnDestroy, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { OrderExportService } from '../../services/order-export.service';
import { EmailValidationService } from '../../../../shared/services/email-validation.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent, SelectOption } from '../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { AlertComponent } from '../../../../shared/components/alert/alert.component';
import { TooltipComponent } from '../../../../shared/components/tooltip/tooltip.component';
import { CustomerData } from '../../models/catalog.models';
import { CHECKOUT_CONSTANTS } from '../../constants/checkout.constants';
import { SecureValidators } from '../../../../shared/validators/secure-validators';

@Component({
  selector: 'app-checkout-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    SelectComponent,
    CheckboxComponent,
    AlertComponent,
    TooltipComponent
  ],
  templateUrl: './checkout-modal.component.html',
  styleUrl: './checkout-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly cartService = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  private readonly orderExportService = inject(OrderExportService);
  private readonly emailValidationService = inject(EmailValidationService);

  checkoutForm: FormGroup;
  selectedDepartment = signal<string>('');
  emailAlert = signal<{
    show: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    suggestion?: string;
  }>({ show: false, type: 'info', title: '', message: '' });

  municipalities = computed(() => {
    const deptId = this.selectedDepartment();
    return deptId ? this.checkoutService.getMunicipalitiesByDepartment(deptId) : [];
  });

  readonly departments = this.checkoutService.getDepartments();
  readonly paymentInstructions = this.checkoutService.getPaymentInstructions();
  readonly cart = this.cartService.cart;

  readonly departmentOptions = computed(() =>
    this.departments.map(dept => ({ value: dept.id, label: dept.name }))
  );

  readonly municipalityOptions = computed(() =>
    this.municipalities().map(mun => ({ value: mun.id, label: mun.name }))
  );

  readonly identificationOptions: SelectOption[] =
    CHECKOUT_CONSTANTS.IDENTIFICATION_TYPES.map(type => ({
      value: type.value,
      label: type.label
    }));

  constructor() {
    this.checkoutForm = this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormSubscriptions();
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private initializeForm(): FormGroup {
    const form = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        SecureValidators.secureNameValidator()
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        SecureValidators.secureNameValidator()
      ]],
      identificationType: ['', [Validators.required]],
      identificationNumber: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        SecureValidators.colombianIdValidator()
      ]],
      department: ['', [Validators.required]],
      municipality: [{ value: '', disabled: true }, [Validators.required]],
      urbanization: ['', [
        Validators.maxLength(100),
        SecureValidators.secureAddressValidator()
      ]],
      houseNumber: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(100),
        SecureValidators.secureAddressValidator()
      ]],
      apartmentNumber: ['', [
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]{1,5}$/)
      ]],
      tower: ['', [
        Validators.maxLength(4),
        Validators.pattern(/^[0-9]{1,4}$/)
      ]],
      block: ['', [
        Validators.maxLength(4),
        Validators.pattern(/^[0-9]{1,4}$/)
      ]],
      additionalInfo: ['', [
        Validators.maxLength(200),
        SecureValidators.secureAddressValidator()
      ]],
      email: ['',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(254),
          SecureValidators.secureEmailValidator()
        ],
        [SecureValidators.emailExistsValidator(this.emailValidationService)]
      ],
      phone: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        SecureValidators.colombianPhoneValidator()
      ]],
      acceptsDataProcessing: [false, [Validators.requiredTrue]]
    });

    // Marcar todos los campos como touched para mostrar errores inmediatamente
    form.markAllAsTouched();

    return form;
  }

  private setupFormSubscriptions(): void {
    this.checkoutForm.get('department')?.valueChanges.subscribe(departmentId => {
      if (departmentId && typeof departmentId === 'string') {
        this.selectedDepartment.set(departmentId);
        const municipalityControl = this.checkoutForm.get('municipality');
        municipalityControl?.setValue('');
        municipalityControl?.enable();
      } else {
        this.checkoutForm.get('municipality')?.disable();
      }
    });

    // Validación en tiempo real para todos los campos
    Object.keys(this.checkoutForm.controls).forEach(key => {
      const control = this.checkoutForm.get(key);
      if (control) {
        control.valueChanges.subscribe(() => {
          // Marcar como touched para mostrar errores inmediatamente
          if (!control.touched) {
            control.markAsTouched();
          }
        });
      }
    });

    // Suscribirse a cambios en el email para mostrar alertas
    const emailControl = this.checkoutForm.get('email');
    if (emailControl) {
      emailControl.statusChanges.subscribe(status => {
        const errors = emailControl.errors;

        if (errors?.['emailNotExists']) {
          this.showEmailAlert(
            'error',
            'Email no válido',
            errors['emailNotExists'].message,
            errors['emailNotExists'].suggestion
          );
        } else if (errors && emailControl.touched) {
          // No mostrar alerta si hay otros errores de formato
          this.hideEmailAlert();
        } else if (status === 'PENDING') {
          this.showEmailAlert(
            'info',
            'Verificando email...',
            'Validando la existencia del correo electrónico'
          );
        } else {
          this.hideEmailAlert();
        }
      });
    }
  }

  showEmailAlert(type: 'success' | 'error' | 'warning' | 'info', title: string, message: string, suggestion?: string): void {
    this.emailAlert.set({
      show: true,
      type,
      title,
      message,
      suggestion
    });
  }

  hideEmailAlert(): void {
    this.emailAlert.set({ show: false, type: 'info', title: '', message: '' });
  }

  onEmailSuggestionClick(suggestion: string): void {
    this.checkoutForm.get('email')?.setValue(suggestion);
    this.hideEmailAlert();
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  formatPrice(price: number): string {
    if (typeof price !== 'number' || isNaN(price) || price < 0) return '$0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  getFieldError(fieldName: string): string {
    const field = this.checkoutForm.get(fieldName);
    if (!field || (!field.errors && !field.pending) || !field.touched) {
      return '';
    }

    const errors = field.errors;

    // Errores de validación personalizada
    if (errors?.['invalidName']) {
      return errors['invalidName'].message;
    }

    if (errors?.['invalidId']) {
      return errors['invalidId'].message;
    }

    if (errors?.['invalidPhone']) {
      return errors['invalidPhone'].message;
    }

    if (errors?.['invalidEmail']) {
      return errors['invalidEmail'].message;
    }

    if (errors?.['invalidAddress']) {
      return errors['invalidAddress'].message;
    }

    if (errors?.['emailNotExists']) {
      return errors['emailNotExists'].message;
    }

    // Errores estándar de Angular
    if (errors?.['required']) {
      return this.getRequiredMessage(fieldName);
    }

    if (errors?.['email']) {
      return 'Formato de email inválido';
    }

    if (errors?.['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      const actualLength = errors['minlength'].actualLength;
      return `Mínimo ${requiredLength} caracteres (actual: ${actualLength})`;
    }

    if (errors?.['maxlength']) {
      const requiredLength = errors['maxlength'].requiredLength;
      return `Máximo ${requiredLength} caracteres`;
    }

    if (errors?.['pattern']) {
      return this.getPatternMessage(fieldName);
    }

    return 'Campo inválido';
  }

  private getRequiredMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      'firstName': 'Los nombres son requeridos',
      'lastName': 'Los apellidos son requeridos',
      'identificationType': 'Selecciona el tipo de identificación',
      'identificationNumber': 'El número de identificación es requerido',
      'department': 'Selecciona el departamento',
      'municipality': 'Selecciona el municipio',
      'houseNumber': 'La dirección es requerida',
      'email': 'El correo electrónico es requerido',
      'phone': 'El número de teléfono es requerido',
      'acceptsDataProcessing': 'Debes aceptar el tratamiento de datos'
    };

    return messages[fieldName] || 'Este campo es requerido';
  }

  private getPatternMessage(fieldName: string): string {
    const messages: { [key: string]: string } = {
      'identificationNumber': 'Solo se permiten números (6-12 dígitos)',
      'phone': 'Formato inválido. Debe ser: 3XXXXXXXXX',
      'email': 'Formato de email inválido',
      'apartmentNumber': 'Solo números, máximo 5 dígitos',
      'tower': 'Solo números, máximo 4 dígitos',
      'block': 'Solo números, máximo 4 dígitos'
    };

    return messages[fieldName] || 'Formato inválido';
  }

  onSubmit(): void {
    if (!this.checkoutForm.valid) {
      this.markFormGroupTouched();
      console.error('Form is invalid:', this.checkoutForm.errors);
      return;
    }

    this.processCheckout();
  }

  private async processCheckout(): Promise<void> {
    try {
      const formData = this.checkoutForm.value;
      console.log('Form data:', formData);

      // Security validation before processing
      if (!this.validateFormData(formData)) {
        throw new Error('Datos del formulario inválidos');
      }

      const customerData: CustomerData = {
        firstName: SecureValidators.sanitizeText(formData.firstName),
        lastName: SecureValidators.sanitizeText(formData.lastName),
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber.replace(/\D/g, ''),
        department: this.getDepartmentName(formData.department),
        municipality: this.getMunicipalityName(formData.municipality),
        address: {
          urbanization: formData.urbanization ? SecureValidators.sanitizeText(formData.urbanization) : undefined,
          houseNumber: SecureValidators.sanitizeText(formData.houseNumber),
          apartmentNumber: formData.apartmentNumber ? formData.apartmentNumber.toString() : undefined,
          tower: formData.tower ? formData.tower.toString() : undefined,
          block: formData.block ? formData.block.toString() : undefined,
          additionalInfo: formData.additionalInfo ? SecureValidators.sanitizeText(formData.additionalInfo) : undefined
        },
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        acceptsDataProcessing: formData.acceptsDataProcessing
      };

      console.log('Customer data:', customerData);

      const checkoutData = {
        customer: customerData,
        cart: this.cart(),
        paymentInstructions: this.paymentInstructions
      };

      console.log('Checkout data:', checkoutData);

      // 1. Generar PDF (sin descargar aún)
      const pdfResult = await this.orderExportService.exportOrderToPDF(checkoutData);
      console.log('PDF generated:', pdfResult.orderNumber);

      // 2. Generar mensaje WhatsApp con número de orden
      const message = this.checkoutService.generateWhatsAppMessage(checkoutData, pdfResult.orderNumber);
      console.log('WhatsApp message generated:', message);

      // 3. Abrir WhatsApp INMEDIATAMENTE (antes de descargar PDF)
      this.checkoutService.openWhatsApp(message);
      console.log('WhatsApp opened');

      // 4. Descargar PDF DESPUÉS (con pequeño delay para evitar bloqueo)
      setTimeout(() => {
        this.orderExportService.downloadPDF(pdfResult.pdfBase64, pdfResult.filename);
        console.log('PDF downloaded');
      }, 500);

      // 5. Cerrar modal
      this.onClose();
      
    } catch (error) {
      console.error('Error en checkout:', error);
      // Mostrar mensaje de error más específico
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
        if (error.message.includes('WhatsApp')) {
          alert('No se pudo abrir WhatsApp. Verifica que no esté bloqueado por el navegador o intenta desde un dispositivo móvil.');
        } else if (error.message.includes('PDF')) {
          alert('Error al generar el PDF del pedido. Por favor, inténtalo de nuevo.');
        } else {
          alert(`Error al procesar el pedido: ${error.message}`);
        }
      } else {
        alert('Error al procesar el pedido. Por favor, verifica los datos e inténtalo nuevamente.');
      }
    }
  }

  private getDepartmentName(departmentId: string): string {
    return this.departments.find(d => d.id === departmentId)?.name || '';
  }

  private getMunicipalityName(municipalityId: string): string {
    return this.municipalities().find(m => m.id === municipalityId)?.name || '';
  }

  private markFormGroupTouched(): void {
    Object.keys(this.checkoutForm.controls).forEach(key => {
      this.checkoutForm.get(key)?.markAsTouched();
    });
  }

  private validateFormData(formData: any): boolean {
    if (!formData || typeof formData !== 'object') {
      console.error('Form data is not an object:', formData);
      return false;
    }

    // Validate required string fields exist and are not empty
    const requiredFields = ['firstName', 'lastName', 'houseNumber', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field] || typeof formData[field] !== 'string' || !formData[field].trim()) {
        console.error(`Required field missing or invalid: ${field}`, formData[field]);
        return false;
      }
    }

    // Validate required non-string fields
    if (!formData.identificationType || !formData.identificationNumber ||
        !formData.department || !formData.municipality ||
        !formData.acceptsDataProcessing) {
      console.error('Required non-string fields missing:', {
        identificationType: formData.identificationType,
        identificationNumber: formData.identificationNumber,
        department: formData.department,
        municipality: formData.municipality,
        acceptsDataProcessing: formData.acceptsDataProcessing
      });
      return false;
    }

    // Basic format validation for critical fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      console.error('Invalid email format:', formData.email);
      return false;
    }

    const phoneRegex = /^3[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      console.error('Invalid phone format:', formData.phone);
      return false;
    }

    console.log('Form data validation passed');
    return true;
  }
}
