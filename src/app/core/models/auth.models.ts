export interface AuthState {
  readonly isAuthenticated: boolean;
  readonly sessionToken: string | null;
  readonly expiresAt: number | null;
  readonly lastActivity: number;
}

export interface LoginCredentials {
  readonly username: string;
  readonly password: string;
}

export interface AuthSession {
  readonly token: string;
  readonly expiresAt: number;
  readonly createdAt: number;
}

export type UserRole = 'admin' | 'guest';

export interface AuthUser {
  readonly id: string;
  readonly role: UserRole;
  readonly sessionId: string;
}