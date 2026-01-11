import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, of } from 'rxjs';
import { BaseHttpService } from './base-http.service';
import { User, LoginRequest, RegisterRequest, AuthTokens } from '../models';
import { APP_CONSTANTS, ROUTES } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends BaseHttpService {
  private readonly router = inject(Router);
  
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);
  private readonly isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  
  public readonly currentUser$ = this.currentUserSubject.asObservable();
  public readonly isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // Signals para estado reactivo
  public readonly currentUser = signal<User | null>(null);
  public readonly isAuthenticated = signal<boolean>(false);

  constructor() {
    super();
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      this.loadUserProfile();
    } else {
      this.clearAuthData();
    }
  }

  login(credentials: LoginRequest): Observable<AuthTokens> {
    return this.post<AuthTokens>(APP_CONSTANTS.API_ENDPOINTS.AUTH.LOGIN, credentials)
      .pipe(
        tap(tokens => {
          this.setTokens(tokens);
          this.loadUserProfile();
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthTokens> {
    return this.post<AuthTokens>(APP_CONSTANTS.API_ENDPOINTS.AUTH.REGISTER, userData)
      .pipe(
        tap(tokens => {
          this.setTokens(tokens);
          this.loadUserProfile();
        })
      );
  }

  logout(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    
    if (refreshToken) {
      return this.post(APP_CONSTANTS.API_ENDPOINTS.AUTH.LOGOUT, { refreshToken })
        .pipe(
          tap(() => this.performLogout())
        );
    }
    
    this.performLogout();
    return of(null);
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    return this.post<AuthTokens>(APP_CONSTANTS.API_ENDPOINTS.AUTH.REFRESH, { refreshToken })
      .pipe(
        tap(tokens => this.setTokens(tokens))
      );
  }

  private loadUserProfile(): void {
    this.get<User>(APP_CONSTANTS.API_ENDPOINTS.AUTH.PROFILE)
      .subscribe({
        next: (user) => {
          this.setCurrentUser(user);
        },
        error: () => {
          this.clearAuthData();
        }
      });
  }

  private performLogout(): void {
    this.clearAuthData();
    this.router.navigate([ROUTES.AUTH.LOGIN]);
  }

  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.currentUser.set(user);
    this.isAuthenticated.set(true);
    
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  private setTokens(tokens: AuthTokens): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
  }

  private clearAuthData(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}