import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ROUTES } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ButtonComponent, InputComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <!-- Header -->
        <div class="text-center">
          <div class="mx-auto w-16 h-16 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
            <span class="text-white font-bold text-2xl">S</span>
          </div>
          <h2 class="text-3xl font-bold text-gray-900 mb-2">
            Crear Cuenta
          </h2>
          <p class="text-gray-600">
            Únete a SumakFront hoy mismo
          </p>
        </div>

        <!-- Form -->
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <app-input
                id="firstName"
                label="Nombre"
                type="text"
                placeholder="Juan"
                [required]="true"
                formControlName="firstName"
                [errorMessage]="getFieldError('firstName')"
              ></app-input>

              <app-input
                id="lastName"
                label="Apellido"
                type="text"
                placeholder="Pérez"
                [required]="true"
                formControlName="lastName"
                [errorMessage]="getFieldError('lastName')"
              ></app-input>
            </div>

            <app-input
              id="email"
              label="Correo Electrónico"
              type="email"
              placeholder="tu@email.com"
              [required]="true"
              formControlName="email"
              [errorMessage]="getFieldError('email')"
            ></app-input>

            <app-input
              id="password"
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              [required]="true"
              formControlName="password"
              [errorMessage]="getFieldError('password')"
              helpText="Mínimo 8 caracteres"
            ></app-input>

            <app-input
              id="confirmPassword"
              label="Confirmar Contraseña"
              type="password"
              placeholder="••••••••"
              [required]="true"
              formControlName="confirmPassword"
              [errorMessage]="getFieldError('confirmPassword')"
            ></app-input>
          </div>

          <!-- Terms and conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="acceptTerms"
                name="acceptTerms"
                type="checkbox"
                formControlName="acceptTerms"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              >
            </div>
            <div class="ml-3 text-sm">
              <label for="acceptTerms" class="text-gray-700">
                Acepto los
                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                  términos y condiciones
                </a>
                y la
                <a href="#" class="font-medium text-primary-600 hover:text-primary-500">
                  política de privacidad
                </a>
              </label>
              <p *ngIf="getFieldError('acceptTerms')" class="mt-1 text-red-600 text-xs">
                {{ getFieldError('acceptTerms') }}
              </p>
            </div>
          </div>

          <!-- Error message -->
          <div *ngIf="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex">
              <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
              </svg>
              <div class="ml-3">
                <p class="text-sm text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <app-button
            type="submit"
            variant="primary"
            size="lg"
            [fullWidth]="true"
            [loading]="isLoading"
            [disabled]="registerForm.invalid"
          >
            {{ isLoading ? 'Creando cuenta...' : 'Crear Cuenta' }}
          </app-button>
        </form>

        <!-- Login link -->
        <div class="text-center">
          <p class="text-sm text-gray-600">
            ¿Ya tienes una cuenta?
            <a
              [routerLink]="routes.AUTH.LOGIN"
              class="font-medium text-primary-600 hover:text-primary-500 transition-colors"
            >
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  routes = ROUTES;
  isLoading = false;
  errorMessage = '';

  registerForm = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      const { firstName, lastName, email, password } = this.registerForm.value;

      this.authService.register({
        firstName: firstName!,
        lastName: lastName!,
        email: email!,
        password: password!
      }).subscribe({
        next: () => {
          this.router.navigate([ROUTES.DASHBOARD]);
        },
        error: (error: any) => {
          this.errorMessage = error.message || 'Error al crear la cuenta';
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['requiredTrue']) {
        return 'Debes aceptar los términos y condiciones';
      }
      if (field.errors['email']) {
        return 'Ingresa un correo electrónico válido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['passwordMismatch']) {
        return 'Las contraseñas no coinciden';
      }
    }
    
    return '';
  }
}