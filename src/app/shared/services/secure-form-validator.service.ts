import { Injectable, inject } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { SecuritySanitizerService } from '../../../core/services/security-sanitizer.service';

@Injectable({
  providedIn: 'root'
})
export class SecureFormValidatorService {
  private readonly securityService = inject(SecuritySanitizerService);

  // Custom validator for secure text input
  secureTextValidator(maxLength: number = 255): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString();
      
      // Check for malicious content
      if (this.securityService.containsMaliciousContent(value)) {
        return { maliciousContent: { value } };
      }

      // Length validation
      if (value.length > maxLength) {
        return { maxLength: { actualLength: value.length, maxLength } };
      }

      return null;
    };
  }

  // Email validator with security checks
  secureEmailValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const validation = this.securityService.validateEmail(control.value);
      
      if (!validation.isValid) {
        return { invalidEmail: { errors: validation.errors } };
      }

      return null;
    };
  }

  // Phone validator with security checks
  securePhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const validation = this.securityService.validatePhone(control.value);
      
      if (!validation.isValid) {
        return { invalidPhone: { errors: validation.errors } };
      }

      return null;
    };
  }

  // Quantity validator
  quantityValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const validation = this.securityService.validateQuantity(Number(control.value));
      
      if (!validation.isValid) {
        return { invalidQuantity: { errors: validation.errors } };
      }

      return null;
    };
  }

  // Price validator
  priceValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const validation = this.securityService.validatePrice(Number(control.value));
      
      if (!validation.isValid) {
        return { invalidPrice: { errors: validation.errors } };
      }

      return null;
    };
  }

  // Address validator
  addressValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString();
      
      // Check for malicious content
      if (this.securityService.containsMaliciousContent(value)) {
        return { maliciousContent: { value } };
      }

      // Basic address validation
      if (value.length < 5) {
        return { minLength: { actualLength: value.length, minLength: 5 } };
      }

      if (value.length > 200) {
        return { maxLength: { actualLength: value.length, maxLength: 200 } };
      }

      return null;
    };
  }

  // Identification number validator
  identificationValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString().replace(/\D/g, ''); // Remove non-digits
      
      if (value.length < 6) {
        return { minLength: { actualLength: value.length, minLength: 6 } };
      }

      if (value.length > 15) {
        return { maxLength: { actualLength: value.length, maxLength: 15 } };
      }

      return null;
    };
  }

  // Name validator (first name, last name)
  nameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const value = control.value.toString();
      
      // Check for malicious content
      if (this.securityService.containsMaliciousContent(value)) {
        return { maliciousContent: { value } };
      }

      // Only letters, spaces, and common name characters
      const namePattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
      if (!namePattern.test(value)) {
        return { invalidName: { value } };
      }

      if (value.length < 2) {
        return { minLength: { actualLength: value.length, minLength: 2 } };
      }

      if (value.length > 50) {
        return { maxLength: { actualLength: value.length, maxLength: 50 } };
      }

      return null;
    };
  }

  // Sanitize form data before submission
  sanitizeFormData(formData: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        sanitized[key] = this.securityService.sanitizeInput(value);
      } else if (typeof value === 'number') {
        sanitized[key] = value;
      } else if (value instanceof Date) {
        sanitized[key] = value;
      } else if (typeof value === 'boolean') {
        sanitized[key] = value;
      } else {
        // For complex objects, convert to string and sanitize
        sanitized[key] = this.securityService.sanitizeInput(JSON.stringify(value));
      }
    }

    return sanitized;
  }

  // Validate entire form for security issues
  validateFormSecurity(formData: Record<string, any>): { isSecure: boolean; issues: string[] } {
    const issues: string[] = [];

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        if (this.securityService.containsMaliciousContent(value)) {
          issues.push(`Field '${key}' contains potentially malicious content`);
        }
      }
    }

    return {
      isSecure: issues.length === 0,
      issues
    };
  }
}