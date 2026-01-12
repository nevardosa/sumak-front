import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { EmailValidationService } from '../services/email-validation.service';

export class SecureValidators {
  
  static secureNameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim();
      const namePattern = /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/;
      
      if (!namePattern.test(value)) {
        return { invalidName: { message: 'Solo se permiten letras y espacios (2-50 caracteres)' } };
      }
      
      if (value.replace(/\s/g, '').length < 2) {
        return { invalidName: { message: 'El nombre debe contener al menos 2 letras' } };
      }
      
      return null;
    };
  }

  static colombianIdValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim();
      const idPattern = /^[0-9]{6,12}$/;
      
      if (!idPattern.test(value)) {
        return { invalidId: { message: 'Debe contener entre 6 y 12 dígitos' } };
      }
      
      if (/^(\d)\1+$/.test(value)) {
        return { invalidId: { message: 'Número de identificación inválido' } };
      }
      
      return null;
    };
  }

  static colombianPhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim();
      const phonePattern = /^3[0-9]{9}$/;
      
      if (!phonePattern.test(value)) {
        return { invalidPhone: { message: 'Formato: 3XXXXXXXXX (10 dígitos)' } };
      }
      
      return null;
    };
  }

  static secureEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim().toLowerCase();
      const emailPattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
      
      if (!emailPattern.test(value)) {
        return { invalidEmail: { message: 'Formato de email inválido' } };
      }
      
      if (value.length > 254) {
        return { invalidEmail: { message: 'Email demasiado largo' } };
      }
      
      return null;
    };
  }

  static emailExistsValidator(emailService: EmailValidationService): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      // Deshabilitar validación externa temporalmente debido a problemas de conectividad
      return of(null);
      
      /*
      if (!control.value) {
        return of(null);
      }

      const email = control.value.toString().trim().toLowerCase();
      
      // Primero validar formato
      const formatError = SecureValidators.secureEmailValidator()(control);
      if (formatError) {
        return of(null); // Dejar que el validador síncrono maneje el formato
      }

      return emailService.validateEmailRealTime(email).pipe(
        debounceTime(800),
        distinctUntilChanged(),
        map(result => {
          if (!result.isValid || !result.isDeliverable) {
            return {
              emailNotExists: {
                message: result.reason || 'Email no válido o no existe',
                suggestion: result.suggestion
              }
            };
          }
          return null;
        }),
        catchError(() => of(null)) // En caso de error, no bloquear el formulario
      );
      */
    };
  }

  static secureAddressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim();
      
      // Patrón más estricto para direcciones
      const addressPattern = /^[a-zA-Z0-9À-ÿ\u00f1\u00d1\s#\-.,°()]+$/;
      
      if (!addressPattern.test(value)) {
        return { 
          invalidAddress: { 
            message: 'Solo se permiten letras, números, espacios y caracteres: # - . , ° ( )' 
          } 
        };
      }
      
      if (value.length < 3) {
        return { 
          invalidAddress: { 
            message: 'Mínimo 3 caracteres' 
          } 
        };
      }
      
      if (value.length > 200) {
        return { 
          invalidAddress: { 
            message: 'Máximo 200 caracteres' 
          } 
        };
      }
      
      // Validar que no sea solo espacios o caracteres especiales
      if (!/[a-zA-Z0-9À-ÿ\u00f1\u00d1]/.test(value)) {
        return { 
          invalidAddress: { 
            message: 'Debe contener al menos una letra o número' 
          } 
        };
      }
      
      return null;
    };
  }

  static numericValidator(maxLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;
      
      const value = control.value.toString().trim();
      const numericPattern = new RegExp(`^[0-9]{1,${maxLength}}$`);
      
      if (!numericPattern.test(value)) {
        return { 
          invalidNumeric: { 
            message: `Solo números, máximo ${maxLength} dígitos` 
          } 
        };
      }
      
      return null;
    };
  }

  static sanitizeText(text: string): string {
    if (!text || typeof text !== 'string') return '';
    
    return text
      .trim()
      // Remove HTML tags and dangerous characters
      .replace(/<[^>]*>/g, '')
      // Remove script-related content
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      // Remove SQL injection patterns
      .replace(/('|(\-\-)|(;)|(\|)|(\*)|(%))/g, '')
      // Remove XSS patterns
      .replace(/[<>\"'&]/g, '')
      // Remove null bytes and control characters
      .replace(/[\x00-\x1F\x7F]/g, '')
      .substring(0, 200);
  }
}