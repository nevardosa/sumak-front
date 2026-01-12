import { Injectable, inject } from '@angular/core';
import { CryptoService } from './crypto.service';

export enum SecurityEventType {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  SESSION_RESTORED = 'SESSION_RESTORED',
  ANTI_DEBUG_TRIGGERED = 'ANTI_DEBUG_TRIGGERED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  ENCRYPTION_ERROR = 'ENCRYPTION_ERROR',
  LOGOUT = 'LOGOUT',
  CREDENTIAL_VALIDATION = 'CREDENTIAL_VALIDATION'
}

export interface SecurityEvent {
  readonly id: string;
  readonly type: SecurityEventType;
  readonly timestamp: number;
  readonly userAgent: string;
  readonly sessionId?: string;
  readonly details?: Record<string, unknown>;
  readonly severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

@Injectable({
  providedIn: 'root'
})
export class SecurityAuditService {
  private readonly cryptoService = inject(CryptoService);
  private readonly maxLogEntries = 1000;
  private readonly logKey = 'sumak_security_audit_2024';

  async logSecurityEvent(
    type: SecurityEventType,
    severity: SecurityEvent['severity'] = 'MEDIUM',
    details?: Record<string, unknown>,
    sessionId?: string
  ): Promise<void> {
    try {
      const event: SecurityEvent = {
        id: this.cryptoService.generateSecureToken().substring(0, 16),
        type,
        timestamp: Date.now(),
        userAgent: this.sanitizeUserAgent(navigator.userAgent),
        sessionId: sessionId?.substring(0, 8), // Only first 8 chars for privacy
        details: this.sanitizeDetails(details),
        severity
      };

      await this.storeSecurityEvent(event);
      
      // Critical events also go to console for immediate visibility
      if (severity === 'CRITICAL') {
        console.warn(`[SECURITY] ${type}:`, {
          timestamp: new Date(event.timestamp).toISOString(),
          id: event.id
        });
      }
    } catch (error) {
      // Fallback logging - never fail silently on security events
      console.error('[SECURITY AUDIT] Failed to log event:', type, error);
    }
  }

  private async storeSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const existingLogs = await this.getSecurityLogs();
      const updatedLogs = [event, ...existingLogs].slice(0, this.maxLogEntries);
      
      const encrypted = await this.cryptoService.encrypt(
        JSON.stringify(updatedLogs),
        this.logKey
      );
      
      localStorage.setItem('sumak_sec_audit', encrypted);
    } catch {
      // Fallback to unencrypted if encryption fails
      const existingLogs = this.getUnencryptedLogs();
      const updatedLogs = [event, ...existingLogs].slice(0, this.maxLogEntries);
      localStorage.setItem('sumak_sec_audit_fallback', JSON.stringify(updatedLogs));
    }
  }

  async getSecurityLogs(): Promise<SecurityEvent[]> {
    try {
      const encrypted = localStorage.getItem('sumak_sec_audit');
      if (!encrypted) return [];
      
      const decrypted = await this.cryptoService.decrypt(encrypted, this.logKey);
      return JSON.parse(decrypted) as SecurityEvent[];
    } catch {
      return this.getUnencryptedLogs();
    }
  }

  private getUnencryptedLogs(): SecurityEvent[] {
    try {
      const fallback = localStorage.getItem('sumak_sec_audit_fallback');
      return fallback ? JSON.parse(fallback) : [];
    } catch {
      return [];
    }
  }

  async getAuditReport(hours: number = 24): Promise<{
    events: SecurityEvent[];
    summary: Record<SecurityEventType, number>;
    criticalEvents: SecurityEvent[];
  }> {
    const logs = await this.getSecurityLogs();
    const cutoff = Date.now() - (hours * 60 * 60 * 1000);
    
    const recentEvents = logs.filter(event => event.timestamp >= cutoff);
    const summary = recentEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    }, {} as Record<SecurityEventType, number>);
    
    const criticalEvents = recentEvents.filter(event => 
      event.severity === 'CRITICAL' || event.severity === 'HIGH'
    );

    return { events: recentEvents, summary, criticalEvents };
  }

  async clearAuditLogs(): Promise<void> {
    localStorage.removeItem('sumak_sec_audit');
    localStorage.removeItem('sumak_sec_audit_fallback');
    
    await this.logSecurityEvent(
      SecurityEventType.UNAUTHORIZED_ACCESS,
      'HIGH',
      { action: 'audit_logs_cleared' }
    );
  }

  private sanitizeUserAgent(userAgent: string): string {
    // Remove potentially sensitive info but keep browser/OS info
    return userAgent.replace(/\d+\.\d+\.\d+\.\d+/g, '[IP_REMOVED]')
                   .substring(0, 200);
  }

  private sanitizeDetails(details?: Record<string, unknown>): Record<string, unknown> | undefined {
    if (!details) return undefined;
    
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(details)) {
      // Never log sensitive data
      if (key.toLowerCase().includes('password') || 
          key.toLowerCase().includes('token') ||
          key.toLowerCase().includes('secret')) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string' && value.length > 500) {
        sanitized[key] = value.substring(0, 500) + '...[TRUNCATED]';
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }
}