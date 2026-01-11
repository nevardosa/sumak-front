import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CryptoService } from './crypto.service';
import { AuthState, LoginCredentials, AuthSession } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly cryptoService = inject(CryptoService);

  private readonly sessionTimeout = 30 * 60 * 1000; // 30 minutes
  private readonly maxInactivity = 15 * 60 * 1000; // 15 minutes

  // Obfuscated credentials
  private readonly c1 = 'sadyanda';
  private readonly c2 = '.sumak';
  private readonly p1 = 'LA9_ds*De';
  private readonly p2 = '.SX2026-+.';

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

        return true;
      }

      // Add delay to prevent brute force
      await this.delay(2000);
      return false;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  private async validateCredentials(credentials: LoginCredentials): Promise<boolean> {
    try {
      const validCreds = this.getValidCredentials();
      const inputUsername = credentials.username.trim();
      const inputPassword = credentials.password.trim();
      
      return inputUsername === validCreds.username && inputPassword === validCreds.password;
    } catch {
      return false;
    }
  }

  private getValidCredentials() {
    return {
      username: this.c1 + this.c2,
      password: this.p1 + this.p2
    };
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
      const encrypted = await this.cryptoService.encrypt(sessionData, this.getSessionKey());
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
        const decrypted = await this.cryptoService.decrypt(stored, this.getSessionKey());
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

  private getSessionKey(): string {
    return this.c1 + this.c2 + '_session_key_2024';
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

  logout(): void {
    sessionStorage.removeItem('sumak_auth_session');
    this.authState.set({
      isAuthenticated: false,
      sessionToken: null,
      expiresAt: null,
      lastActivity: Date.now()
    });
    this.router.navigate(['/']);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
