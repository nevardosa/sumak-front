import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly showPassword = signal(false);

  readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  constructor() {
    this.setupSecurityMeasures();
  }

  private setupSecurityMeasures(): void {
    // Production security measures
    this.disableDevTools();
    this.preventInspection();
    this.obfuscateCredentials();
  }

  private disableDevTools(): void {
    // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F12' || 
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u') ||
          (e.ctrlKey && e.key === 's') ||
          (e.ctrlKey && e.shiftKey && e.key === 'C')) {
        e.preventDefault();
        this.handleSecurityViolation();
        return false;
      }
    });

    // Disable right-click
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      this.handleSecurityViolation();
    });
  }

  private preventInspection(): void {
    // Clear console periodically
    setInterval(() => {
      console.clear();
      console.log('%cAcceso Restringido', 'color: red; font-size: 50px; font-weight: bold;');
      console.log('%cEste sistema está protegido', 'color: red; font-size: 20px;');
    }, 1000);

    // Detect DevTools
    let devtools = { open: false };
    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold || 
          window.outerWidth - window.innerWidth > threshold) {
        this.handleSecurityViolation();
      }
    }, 500);
  }

  private handleSecurityViolation(): void {
    this.errorMessage.set('Violación de seguridad detectada');
    this.loginForm.reset();
    
    // Redirect after delay
    setTimeout(() => {
      window.location.href = '/home';
    }, 2000);
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const { username, password } = this.loginForm.value;
      
      // Additional client-side validation
      if (!this.validateInput(username, password)) {
        this.errorMessage.set('Credenciales inválidas');
        return;
      }

      const success = await this.authService.login({ username, password });

      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage.set('Usuario o contraseña incorrectos');
        this.loginForm.reset();
      }
    } catch (error) {
      this.errorMessage.set('Error de autenticación');
      console.error('Login error:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  private validateInput(username: string, password: string): boolean {
    const usernamePattern = /^[a-zA-Z0-9_.]+$/;
    const passwordPattern = /^[a-zA-Z0-9_.*+-]+$/;
    
    return usernamePattern.test(username) && passwordPattern.test(password);
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(show => !show);
  }

  onInputChange(): void {
    if (this.errorMessage()) {
      this.errorMessage.set(null);
    }
  }

  get usernameError(): string | null {
    const control = this.loginForm.get('username');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Usuario requerido';
      if (control.errors['minlength']) return 'Mínimo 3 caracteres';
    }
    return null;
  }

  get passwordError(): string | null {
    const control = this.loginForm.get('password');
    if (control?.errors && control.touched) {
      if (control.errors['required']) return 'Contraseña requerida';
      if (control.errors['minlength']) return 'Mínimo 8 caracteres';
    }
    return null;
  }
}