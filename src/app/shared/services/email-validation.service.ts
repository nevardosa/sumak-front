import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, timeout, switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';

export interface EmailValidationResult {
  isValid: boolean;
  isDeliverable: boolean;
  reason?: string;
  suggestion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailValidationService {
  private readonly http = inject(HttpClient);
  private readonly cache = new Map<string, EmailValidationResult>();
  private readonly TIMEOUT_MS = 5000;
  private readonly DEBOUNCE_MS = 800;

  validateEmailRealTime(email: string): Observable<EmailValidationResult> {
    return timer(this.DEBOUNCE_MS).pipe(
      switchMap(() => this.validateEmail(email)),
      debounceTime(this.DEBOUNCE_MS),
      distinctUntilChanged()
    );
  }

  private validateEmail(email: string): Observable<EmailValidationResult> {
    if (!email || !this.isValidEmailFormat(email)) {
      return of({
        isValid: false,
        isDeliverable: false,
        reason: 'Formato de email inválido'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    
    if (this.cache.has(normalizedEmail)) {
      return of(this.cache.get(normalizedEmail)!);
    }

    if (this.isCommonDomain(normalizedEmail)) {
      const result = { isValid: true, isDeliverable: true };
      this.cache.set(normalizedEmail, result);
      return of(result);
    }

    return this.validateWithAPI(normalizedEmail);
  }

  private validateWithAPI(email: string): Observable<EmailValidationResult> {
    const apiUrl = `https://api.eva.pingutil.com/email?email=${encodeURIComponent(email)}`;
    
    return this.http.get<any>(apiUrl).pipe(
      timeout(this.TIMEOUT_MS),
      map(response => this.parseAPIResponse(response, email)),
      catchError(error => this.handleAPIError(error, email))
    );
  }

  private parseAPIResponse(response: any, email: string): EmailValidationResult {
    const result: EmailValidationResult = {
      isValid: response.status === 'success' && response.data?.deliverable === true,
      isDeliverable: response.data?.deliverable === true,
      reason: response.data?.reason || undefined
    };

    if (!result.isValid && response.data?.suggestion) {
      result.suggestion = response.data.suggestion;
    }

    this.cache.set(email, result);
    return result;
  }

  private handleAPIError(error: HttpErrorResponse, email: string): Observable<EmailValidationResult> {
    const basicValidation = this.basicDomainValidation(email);
    this.cache.set(email, basicValidation);
    return of(basicValidation);
  }

  private isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return emailRegex.test(email.toLowerCase());
  }

  private isCommonDomain(email: string): boolean {
    const commonDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
      'icloud.com', 'aol.com', 'protonmail.com', 'zoho.com'
    ];
    
    const domain = email.split('@')[1];
    return commonDomains.includes(domain);
  }

  private basicDomainValidation(email: string): EmailValidationResult {
    const domain = email.split('@')[1];
    
    const tempDomains = [
      'tempmail.org', '10minutemail.com', 'guerrillamail.com',
      'mailinator.com', 'throwaway.email', 'temp-mail.org'
    ];

    if (tempDomains.includes(domain)) {
      return {
        isValid: false,
        isDeliverable: false,
        reason: 'No se permiten emails temporales'
      };
    }

    const hasValidTLD = /\.[a-z]{2,}$/i.test(domain);
    
    return {
      isValid: hasValidTLD,
      isDeliverable: hasValidTLD,
      reason: hasValidTLD ? undefined : 'Dominio inválido'
    };
  }
}