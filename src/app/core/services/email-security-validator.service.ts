import { Injectable } from '@angular/core';
import { SecureValidators } from '../../shared/validators/secure-validators';

interface SecurityValidationResult {
  readonly isValid: boolean;
  readonly errors: string[];
  readonly warnings: string[];
  readonly securityScore: number;
}

interface EmailSecurityContext {
  readonly contentSize: number;
  readonly hasPersonalData: boolean;
  readonly hasFinancialData: boolean;
  readonly riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Injectable({
  providedIn: 'root'
})
export class EmailSecurityValidatorService {
  private readonly MAX_CONTENT_SIZE = 50000;
  private readonly MALICIOUS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /eval\s*\(/gi,
    /document\.write/gi,
    /window\.location/gi,
    /\.innerHTML/gi
  ];

  private readonly PERSONAL_DATA_PATTERNS = [
    /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
    /\b\d{8,11}\b/g,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    /\b\d{10}\b/g
  ];

  private readonly FINANCIAL_PATTERNS = [
    /\$[\d,]+\.?\d*/g,
    /\b\d+\.\d{2}\b/g,
    /precio|total|pago|factura|cuenta/gi,
    /tarjeta|credito|debito|banco/gi
  ];

  validateEmailSecurity(content: string, customerData: any): SecurityValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let securityScore = 10.0;

    // Input validation
    if (!content || typeof content !== 'string') {
      errors.push('Invalid content provided');
      securityScore -= 3.0;
    }

    if (!customerData || typeof customerData !== 'object') {
      errors.push('Invalid customer data provided');
      securityScore -= 2.0;
    }

    // Extract recipient email from customer data
    const recipient = customerData?.email || '';
    if (!recipient || typeof recipient !== 'string') {
      errors.push('Invalid recipient email provided');
      securityScore -= 2.0;
    }

    // Content size validation
    if (content && content.length > this.MAX_CONTENT_SIZE) {
      errors.push(`Content size exceeds maximum allowed (${this.MAX_CONTENT_SIZE} characters)`);
      securityScore -= 2.0;
    }

    // Malicious content detection
    for (const pattern of this.MALICIOUS_PATTERNS) {
      if (content && pattern.test(content)) {
        errors.push('Potentially malicious content detected');
        securityScore -= 3.0;
        break;
      }
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (recipient && !emailRegex.test(recipient)) {
      errors.push('Invalid recipient email format');
      securityScore -= 1.0;
    }

    // Domain validation
    if (recipient && recipient.includes('@')) {
      const domain = recipient.split('@')[1];
      if (domain && (domain.length < 3 || domain.includes('..'))) {
        errors.push('Invalid email domain');
        securityScore -= 1.0;
      }
    }

    // Personal data detection
    let personalDataCount = 0;
    if (content) {
      for (const pattern of this.PERSONAL_DATA_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          personalDataCount += matches.length;
        }
      }
    }

    if (personalDataCount > 3) {
      warnings.push('High volume of personal data detected');
      securityScore -= 0.5;
    }

    // Financial data detection
    let financialDataCount = 0;
    if (content) {
      for (const pattern of this.FINANCIAL_PATTERNS) {
        const matches = content.match(pattern);
        if (matches) {
          financialDataCount += matches.length;
        }
      }
    }

    if (financialDataCount > 2) {
      warnings.push('Financial information detected');
      securityScore -= 0.3;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      securityScore: Math.max(0, Math.min(10, securityScore))
    };
  }

  analyzeSecurityContext(content: string): EmailSecurityContext {
    const contentSize = content.length;
    
    let hasPersonalData = false;
    for (const pattern of this.PERSONAL_DATA_PATTERNS) {
      if (pattern.test(content)) {
        hasPersonalData = true;
        break;
      }
    }

    let hasFinancialData = false;
    for (const pattern of this.FINANCIAL_PATTERNS) {
      if (pattern.test(content)) {
        hasFinancialData = true;
        break;
      }
    }

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    
    if (contentSize > 30000) riskLevel = 'MEDIUM';
    if (hasPersonalData && hasFinancialData) riskLevel = 'HIGH';
    
    for (const pattern of this.MALICIOUS_PATTERNS) {
      if (pattern.test(content)) {
        riskLevel = 'CRITICAL';
        break;
      }
    }

    return {
      contentSize,
      hasPersonalData,
      hasFinancialData,
      riskLevel
    };
  }

  sanitizeContent(content: string): string {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    let sanitized = content;
    
    // Remove potentially dangerous HTML tags and attributes
    sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '');
    sanitized = sanitized.replace(/<object[^>]*>.*?<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed[^>]*>.*?<\/embed>/gi, '');
    sanitized = sanitized.replace(/<link[^>]*>/gi, '');
    sanitized = sanitized.replace(/<meta[^>]*>/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/vbscript:/gi, '');
    sanitized = sanitized.replace(/data:text\/html/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    sanitized = sanitized.replace(/expression\(/gi, '');
    sanitized = sanitized.replace(/@import/gi, '');
    
    // Escape HTML entities
    sanitized = sanitized.replace(/&/g, '&amp;');
    sanitized = sanitized.replace(/</g, '&lt;');
    sanitized = sanitized.replace(/>/g, '&gt;');
    sanitized = sanitized.replace(/"/g, '&quot;');
    sanitized = sanitized.replace(/'/g, '&#x27;');
    sanitized = sanitized.replace(/\//g, '&#x2F;');
    
    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Limit length
    return sanitized.substring(0, 10000);
  }

  generateSecurityReport(validation: SecurityValidationResult, context: EmailSecurityContext): string {
    const report: string[] = [];
    
    report.push('=== EMAIL SECURITY VALIDATION REPORT ===');
    report.push(`Security Score: ${validation.securityScore.toFixed(1)}/10.0`);
    report.push(`Risk Level: ${context.riskLevel}`);
    report.push(`Content Size: ${context.contentSize} bytes`);
    report.push(`Personal Data: ${context.hasPersonalData ? 'Detected' : 'None'}`);
    report.push(`Financial Data: ${context.hasFinancialData ? 'Detected' : 'None'}`);
    report.push('');
    
    if (validation.errors.length > 0) {
      report.push('ERRORS:');
      validation.errors.forEach(error => report.push(`- ${error}`));
      report.push('');
    }
    
    if (validation.warnings.length > 0) {
      report.push('WARNINGS:');
      validation.warnings.forEach(warning => report.push(`- ${warning}`));
    }

    return report.join('\n');
  }

  private calculateEntropy(data: string): number {
    if (!data) return 0;
    
    const frequency: { [key: string]: number } = {};
    for (const char of data) {
      frequency[char] = (frequency[char] || 0) + 1;
    }
    
    let entropy = 0;
    const length = data.length;
    
    for (const count of Object.values(frequency)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }
    
    return entropy;
  }
}