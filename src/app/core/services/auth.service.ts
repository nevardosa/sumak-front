import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from './crypto.service';
import { SecurityAuditService, SecurityEventType } from './security-audit.service';
import { AuthState, LoginCredentials, AuthSession } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly cryptoService = inject(CryptoService);
  private readonly auditService = inject(SecurityAuditService);

  private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private readonly maxInactivity = 15 * 60 * 1000; // 15 minutes

  // Encrypted credentials with obfuscated key derivation
  private readonly encData = {
    u: 'F/XwHgRzPWPgyd1O7C1m/WI3zND54oOqRjBjQic82gALbCyigKe4CpoBYXKyZdV26jOQ4z9dP4SFrA==',
    p: 'pfn4qJgOrFiqSxQcdTfNS5itUr/pmufwOs0zIwNcY+XH5k3D708zxhAuBPkouXfi1sHouaYp7PVXJ6FAO4XZ',
    s: [115, 117, 109, 97, 107, 95, 50, 48, 50, 52, 95, 115, 101, 99, 117, 114, 101, 95, 97, 117, 116, 104, 95, 107, 101, 121, 95, 118, 49]
  };

  private credentialsCache: WeakMap<object, { u?: string; p?: string; t: number }> = new WeakMap();
  private readonly cacheKey = {};

  private readonly authState = signal<AuthState>({
    isAuthenticated: false,
    sessionToken: null,
    expiresAt: null,
    lastActivity: Date.now()
  });

  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly sessionToken = computed(() => this.authState().sessionToken);
  readonly currentUser = computed(() => {
    if (this.authState().isAuthenticated) {
      return {
        firstName: 'Sadyanda',
        lastName: 'Sumak',
        email: 'sadyanda.sumak@sumak.com'
      };
    }
    return null;
  });

  constructor() {
    this.initializeAuth();
    this.startSessionMonitoring();
    this.setupAntiDebug();
    // Pre-decrypt credentials for performance
    this.preloadCredentials();
  }

  private async preloadCredentials(): Promise<void> {
    try {
      await this.getValidCredentials();
    } catch {
      // Silent fail - credentials will be decrypted on demand
    }
  }

  private async initializeAuth(): Promise<void> {
    const storedSession = await this.getStoredSession();
    if (storedSession && this.isValidSession(storedSession)) {
      this.authState.set({
        isAuthenticated: true,
        sessionToken: storedSession.token,
        expiresAt: storedSession.expiresAt,
        lastActivity: Date.now()
      });
    }
  }

  private setupAntiDebug(): void {
    // Production anti-debug protection
    setInterval(() => {
      const start = performance.now();
      debugger;
      const end = performance.now();
      if (end - start > 100) {
        this.auditService.logSecurityEvent(
          SecurityEventType.ANTI_DEBUG_TRIGGERED,
          'CRITICAL',
          { detectionMethod: 'performance_timing', delay: end - start }
        );
        this.logout();
        window.location.reload();
      }
    }, 3000);

    // Advanced console detection
    let devtools = { open: false };
    const threshold = 160;
    setInterval(() => {
      if (window.outerHeight - window.innerHeight > threshold ||
          window.outerWidth - window.innerWidth > threshold) {
        devtools.open = true;
      }
      if (devtools.open) {
        this.auditService.logSecurityEvent(
          SecurityEventType.ANTI_DEBUG_TRIGGERED,
          'CRITICAL',
          { detectionMethod: 'window_size_detection' }
        );
        this.logout();
        window.location.reload();
      }
    }, 1000);

    // Clear console logs
    setInterval(() => {
      console.clear();
    }, 2000);
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    const startTime = Date.now();

    try {
      const isValid = await this.validateCredentials(credentials);

      if (isValid) {
        const session = await this.createSession();
        await this.storeSession(session);

        this.authState.set({
          isAuthenticated: true,
          sessionToken: session.token,
          expiresAt: session.expiresAt,
          lastActivity: Date.now()
        });

        await this.auditService.logSecurityEvent(
          SecurityEventType.LOGIN_SUCCESS,
          'LOW',
          {
            username: credentials.username.substring(0, 3) + '***',
            loginDuration: Date.now() - startTime
          },
          session.token
        );

        return true;
      }

      await this.auditService.logSecurityEvent(
        SecurityEventType.LOGIN_FAILED,
        'MEDIUM',
        {
          username: credentials.username.substring(0, 3) + '***',
          reason: 'invalid_credentials'
        }
      );

      // Add delay to prevent brute force
      await this.delay(2000);
      return false;
    } catch (error) {
      await this.auditService.logSecurityEvent(
        SecurityEventType.ENCRYPTION_ERROR,
        'HIGH',
        { error: error instanceof Error ? error.message : 'unknown_error' }
      );

      console.error('Authentication error:', error);
      return false;
    }
  }

  private async validateCredentials(credentials: LoginCredentials): Promise<boolean> {
    try {
      const validCreds = await this.getValidCredentials();
      const inputUsername = credentials.username.trim();
      const inputPassword = credentials.password.trim();

      return inputUsername === validCreds.username && inputPassword === validCreds.password;
    } catch {
      return false;
    }
  }

  private async getValidCredentials() {
    const cached = this.credentialsCache.get(this.cacheKey);
    const now = Date.now();

    // Cache expires after 5 minutes
    if (cached && (now - cached.t) < 300000) {
      return { username: cached.u || '', password: cached.p || '' };
    }

    try {
      const key = String.fromCharCode(...this.encData.s);
      const username = await this.cryptoService.decrypt(this.encData.u, key);
      const password = await this.cryptoService.decrypt(this.encData.p, key);

      // Store in WeakMap with timestamp
      this.credentialsCache.set(this.cacheKey, { u: username, p: password, t: now });

      // Clear key from memory
      setTimeout(() => {
        this.credentialsCache.delete(this.cacheKey);
      }, 300000); // 5 minutes

      return { username, password };
    } catch {
      return { username: '', password: '' };
    }
  }

  private async createSession(): Promise<AuthSession> {
    const token = this.cryptoService.generateSecureToken();
    const expiresAt = Date.now() + this.sessionTimeout;

    return {
      token,
      expiresAt,
      createdAt: Date.now()
    };
  }

  private async storeSession(session: AuthSession): Promise<void> {
    try {
      const sessionData = JSON.stringify(session);
      const sessionKey = await this.getSessionKey();
      const encrypted = await this.cryptoService.encrypt(sessionData, sessionKey);
      sessionStorage.setItem('sumak_auth_session', encrypted);
    } catch {
      // Fallback to basic encoding if encryption fails
      const encoded = btoa(JSON.stringify(session));
      sessionStorage.setItem('sumak_auth_session', encoded);
    }
  }

  private async getStoredSession(): Promise<AuthSession | null> {
    try {
      const stored = sessionStorage.getItem('sumak_auth_session');
      if (!stored) return null;

      // Try AES decryption first
      try {
        const sessionKey = await this.getSessionKey();
        const decrypted = await this.cryptoService.decrypt(stored, sessionKey);
        return JSON.parse(decrypted);
      } catch {
        // Fallback to base64 decoding
        const decoded = atob(stored);
        return JSON.parse(decoded);
      }
    } catch {
      return null;
    }
  }

  private async getSessionKey(): Promise<string> {
    const creds = await this.getValidCredentials();
    const key = creds.username + '_session_key_2024';
    // Clear credentials from memory after use
    setTimeout(() => {
      this.credentialsCache.delete(this.cacheKey);
    }, 1000);
    return key;
  }

  private isValidSession(session: AuthSession): boolean {
    const now = Date.now();
    return session.expiresAt > now && (now - session.createdAt) < this.sessionTimeout;
  }

  private startSessionMonitoring(): void {
    setInterval(() => {
      const state = this.authState();
      if (state.isAuthenticated) {
        const now = Date.now();
        const inactiveTime = now - state.lastActivity;

        if (inactiveTime > this.maxInactivity || (state.expiresAt && now > state.expiresAt)) {
          this.logout();
        }
      }
    }, 30000); // Check every 30 seconds
  }

  updateActivity(): void {
    if (this.authState().isAuthenticated) {
      this.authState.update(state => ({
        ...state,
        lastActivity: Date.now()
      }));
    }
  }

  getAccessToken(): string | null {
    return this.authState().sessionToken;
  }

  async logout(): Promise<void> {
    const currentSession = this.authState().sessionToken;

    sessionStorage.removeItem('sumak_auth_session');
    this.authState.set({
      isAuthenticated: false,
      sessionToken: null,
      expiresAt: null,
      lastActivity: Date.now()
    });

    await this.auditService.logSecurityEvent(
      SecurityEventType.LOGOUT,
      'LOW',
      { method: 'manual' },
      currentSession || undefined
    );

    this.router.navigate(['/']);
  }

  async getAuditReport(hours: number = 24) {
    return await this.auditService.getAuditReport(hours);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
