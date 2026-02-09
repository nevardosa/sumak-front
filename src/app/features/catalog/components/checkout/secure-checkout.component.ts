import { Component, Output, EventEmitter, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { SecureFormValidatorService } from '../../../../shared/services/secure-form-validator.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { CheckboxComponent } from '../../../../shared/components/checkbox/checkbox.component';
import { DEPARTMENTS } from '../../constants/municipalities.constants';
import { WhatsAppService } from '../../../../core/services/whatsapp.service';

@Component({
  selector: 'app-secure-checkout',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonComponent, 
    InputComponent, 
    SelectComponent, 
    CheckboxComponent
  ],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-sumak-green/10">
          <h2 class="font-angainc text-2xl font-medium text-sumak-green">Finalizar Pedido</h2>
          <button (click)="onClose()" class="close-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Security Alert -->
        <div *ngIf="!integrityValid()" class="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div class="flex items-center gap-2 text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <span class="font-medium">Error de Seguridad</span>
          </div>
          <p class="text-sm text-red-600 mt-1">
            Se detectó una manipulación en el carrito. Por favor, actualice la página y vuelva a agregar los productos.
          </p>
        </div>

        <form [formGroup]="checkoutForm" (ngSubmit)="onSubmit()" class="p-6">
          <!-- Customer Information -->
          <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <app-input
                label="Nombres"
                formControlName="firstName"
                [required]="true"
                [error]="getFieldError('firstName')"
              ></app-input>
              
              <app-input
                label="Apellidos"
                formControlName="lastName"
                [required]="true"
                [error]="getFieldError('lastName')"
              ></app-input>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <app-select
                label="Tipo de Identificación"
                formControlName="identificationType"
                [options]="identificationTypes"
                [required]="true"
                [error]="getFieldError('identificationType')"
              ></app-select>
              
              <app-input
                label="Número de Identificación"
                formControlName="identificationNumber"
                type="text"
                [required]="true"
                [error]="getFieldError('identificationNumber')"
              ></app-input>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <app-input
                label="Email"
                formControlName="email"
                type="email"
                [required]="true"
                [error]="getFieldError('email')"
              ></app-input>
              
              <app-input
                label="Teléfono"
                formControlName="phone"
                type="tel"
                [required]="true"
                [error]="getFieldError('phone')"
              ></app-input>
            </div>

            <!-- Address Information -->
            <div class="border-t border-sumak-green/10 pt-6">
              <h3 class="font-angainc text-lg font-medium text-sumak-green mb-4">Dirección de Entrega</h3>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <app-select
                  label="Departamento"
                  formControlName="department"
                  [options]="departments"
                  [required]="true"
                  [error]="getFieldError('department')"
                  (selectionChange)="onDepartmentChange($event)"
                ></app-select>
                
                <app-select
                  label="Municipio"
                  formControlName="municipality"
                  [options]="municipalities()"
                  [required]="true"
                  [error]="getFieldError('municipality')"
                  [disabled]="!checkoutForm.get('department')?.value"
                ></app-select>
              </div>

              <app-input
                label="Dirección Completa"
                formControlName="address"
                [required]="true"
                [error]="getFieldError('address')"
                placeholder="Ej: Calle 123 #45-67, Apartamento 8B"
              ></app-input>
            </div>

            <!-- Data Processing Consent -->
            <div class="border-t border-sumak-green/10 pt-6">
              <app-checkbox
                formControlName="acceptsDataProcessing"
                [required]="true"
                [error]="getFieldError('acceptsDataProcessing')"
              >
                Acepto el tratamiento de mis datos personales según la política de privacidad
              </app-checkbox>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="border-t border-sumak-green/10 pt-6 mt-6">
            <h3 class="font-angainc text-lg font-medium text-sumak-green mb-4">Resumen del Pedido</h3>
            
            <div class="space-y-3 mb-4">
              <div *ngFor="let item of cartService.cart().items" class="flex justify-between items-center">
                <span class="text-sm">{{ item.product.name }} (x{{ item.quantity }})</span>
                <span class="font-medium">{{ cartService.formatPrice(item.product.price * item.quantity) }}</span>
              </div>
            </div>
            
            <div class="border-t border-sumak-green/10 pt-3 flex justify-between items-center">
              <span class="font-angainc text-lg font-medium text-sumak-green">Total:</span>
              <span class="font-angainc text-xl font-semibold text-sumak-brown">
                {{ cartService.formatPrice(cartService.cart().total) }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-8">
            <button
              type="button"
              (click)="onClose()"
              class="flex-1 px-6 py-3 border border-sumak-green/20 text-sumak-green font-medium rounded-lg hover:bg-sumak-green/5 transition-colors"
            >
              Cancelar
            </button>
            
            <app-button
              type="submit"
              variant="primary"
              size="lg"
              class="flex-1"
              [disabled]="!checkoutForm.valid || !integrityValid() || isProcessing()"
            >
              <span *ngIf="!isProcessing()">Enviar Pedido por WhatsApp</span>
              <span *ngIf="isProcessing()" class="flex items-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Procesando...
              </span>
            </app-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .close-btn {
      @apply p-2 text-gray-400 hover:text-sumak-green rounded-lg transition-colors duration-200
             focus:outline-none focus:ring-2 focus:ring-sumak-gold/50;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SecureCheckoutComponent {
  @Output() close = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly secureValidator = inject(SecureFormValidatorService);
  private readonly whatsappService = inject(WhatsAppService);
  readonly cartService = inject(CartService);

  readonly integrityValid = signal(true);
  readonly isProcessing = signal(false);
  readonly municipalities = signal<Array<{value: string, label: string}>>([]);

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
    municipality: ['', Validators.required],
    address: ['', [Validators.required, this.secureValidator.addressValidator()]],
    acceptsDataProcessing: [false, Validators.requiredTrue]
  });

  async ngOnInit() {
    // Validate cart integrity with military-grade security on component load
    const isValid = await this.cartService.validateMilitaryCartIntegrity();
    this.integrityValid.set(isValid);
  }

  onDepartmentChange(departmentId: string): void {
    const department = DEPARTMENTS.find(d => d.id === departmentId);
    if (department) {
      this.municipalities.set(
        department.municipalities.map(mun => ({
          value: mun.id,
          label: mun.name
        }))
      );
      this.checkoutForm.get('municipality')?.setValue('');
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
      // Final integrity check with military-grade validation
      const isValid = await this.cartService.validateMilitaryCartIntegrity();
      if (!isValid) {
        this.integrityValid.set(false);
        this.isProcessing.set(false);
        return;
      }

      // Sanitize form data
      const formData = this.secureValidator.sanitizeFormData(this.checkoutForm.value);
      
      // Validate for security issues
      const securityCheck = this.secureValidator.validateFormSecurity(formData);
      if (!securityCheck.isSecure) {
        console.error('[MILITARY SECURITY] Form contains security issues:', securityCheck.issues);
        this.isProcessing.set(false);
        return;
      }

      // Generate military-grade secure WhatsApp message
      const whatsappMessage = await this.cartService.generateMilitarySecureOrder(formData);
      
      // Send to WhatsApp with security (new tab, noopener, noreferrer)
      this.whatsappService.openWhatsAppOrder(whatsappMessage, 'secure_checkout');
      
      this.onClose();
    } catch (error) {
      console.error('[SECURITY] Checkout failed:', error);
      alert('Error al procesar el pedido. Por favor, intente nuevamente.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}