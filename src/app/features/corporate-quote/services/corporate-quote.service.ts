import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, lastValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { CorporateQuoteForm, CorporateQuotePayload } from '../models/corporate-quote.interface';
import { RECAPTCHA_CONSTANTS } from '../../../core/constants/recaptcha.constants';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CorporateQuoteService {
  // Use environment configuration for endpoint
  private readonly FORM_ENDPOINT = environment.forms.corporateQuote.endpoint;
  private readonly TIMEOUT_MS = 15000;
  private readonly COOLDOWN_MS = 10000;
  private lastSubmitTime = 0;

  constructor(private readonly http: HttpClient) {}

  submitQuote(formData: CorporateQuoteForm): Promise<any> {
    // Anti-spam: Honeypot check
    if (formData.honeypot) {
      return Promise.reject(new Error('Solicitud inválida'));
    }

    // Anti-spam: Cooldown check
    const now = Date.now();
    if (now - this.lastSubmitTime < this.COOLDOWN_MS) {
      return Promise.reject(new Error('Por favor espera unos segundos antes de enviar otra solicitud'));
    }

    // Sanitize and validate
    const payload = this.sanitizeAndValidate(formData);

    // Update last submit time
    this.lastSubmitTime = now;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const request$ = this.http.post(this.FORM_ENDPOINT, payload, { headers })
      .pipe(
        timeout(this.TIMEOUT_MS),
        catchError(error => {
          console.error('Error submitting quote:', error);
          return throwError(() => new Error('Error al enviar la solicitud. Por favor intenta nuevamente.'));
        })
      );

    return lastValueFrom(request$);
  }

  private sanitizeAndValidate(formData: CorporateQuoteForm): CorporateQuotePayload {
    // Validate required fields
    if (!formData.nombreCompleto || !formData.empresa || !formData.email || 
        !formData.telefono || !formData.cantidad) {
      throw new Error('Todos los campos requeridos deben estar completos');
    }

    // Validate reCAPTCHA token
    if (!formData.recaptchaToken || formData.recaptchaToken.length < 20) {
      throw new Error('Token de seguridad inválido. Recarga la página e intenta nuevamente.');
    }

    return {
      nombreCompleto: this.sanitizeText(formData.nombreCompleto, 2, 80),
      empresa: this.sanitizeText(formData.empresa, 2, 120),
      cargo: formData.cargo ? this.sanitizeText(formData.cargo, 2, 80) : '',
      email: this.sanitizeEmail(formData.email),
      telefono: this.sanitizePhone(formData.telefono),
      cantidad: this.sanitizeQuantity(formData.cantidad),
      nota: formData.nota ? this.sanitizeText(formData.nota, 0, 400) : '',
      _recaptcha: formData.recaptchaToken // Formcarry field name for reCAPTCHA validation
    };
  }

  private sanitizeText(text: string, minLength: number, maxLength: number): string {
    if (typeof text !== 'string') {
      throw new Error('Texto inválido');
    }

    // Remove HTML tags, scripts, and dangerous characters
    let sanitized = text
      .replace(/<[^>]*>/g, '')
      .replace(/[<>\"'`]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+=/gi, '')
      .trim();

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ');

    // Validate length
    if (sanitized.length < minLength || sanitized.length > maxLength) {
      throw new Error(`El texto debe tener entre ${minLength} y ${maxLength} caracteres`);
    }

    // Validate only safe characters (letters, numbers, spaces, accents, basic punctuation)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s.,;:()\-]+$/.test(sanitized)) {
      throw new Error('El texto contiene caracteres no permitidos');
    }

    return sanitized;
  }

  private sanitizeEmail(email: string): string {
    if (typeof email !== 'string') {
      throw new Error('Email inválido');
    }

    const sanitized = email.toLowerCase().trim();
    
    // Strict email validation
    const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(sanitized)) {
      throw new Error('Formato de email inválido');
    }

    if (sanitized.length > 254) {
      throw new Error('Email demasiado largo');
    }

    return sanitized;
  }

  private sanitizePhone(phone: string): string {
    if (typeof phone !== 'string') {
      throw new Error('Teléfono inválido');
    }

    // Remove all non-digit characters
    let sanitized = phone.replace(/\D/g, '');

    // Validate Colombian mobile format: 3XX XXX XXXX (10 digits)
    if (!/^3[0-5][0-9]{8}$/.test(sanitized)) {
      throw new Error('Teléfono debe ser celular colombiano válido (10 dígitos, inicia con 3)');
    }

    // Add country code +57
    return '+57' + sanitized;
  }

  private sanitizeQuantity(quantity: any): number {
    const num = Number(quantity);

    if (isNaN(num) || !Number.isInteger(num)) {
      throw new Error('La cantidad debe ser un número entero');
    }

    if (num < 10 || num > 5000) {
      throw new Error('La cantidad debe estar entre 10 y 5000 unidades');
    }

    return num;
  }

  generateWhatsAppMessage(payload: CorporateQuotePayload): string {
    return `🏢 *COTIZACIÓN CORPORATIVA SUMAK*\n\n` +
           `👤 *Contacto*\n` +
           `• Nombre: ${payload.nombreCompleto}\n` +
           `• Empresa: ${payload.empresa}\n` +
           `${payload.cargo ? `• Cargo: ${payload.cargo}\n` : ''}` +
           `• Email: ${payload.email}\n` +
           `• Teléfono: ${payload.telefono}\n\n` +
           `📦 *Solicitud*\n` +
           `• Cantidad: ${payload.cantidad} unidades\n` +
           `${payload.nota ? `• Nota: ${payload.nota}\n` : ''}`;
  }
}
