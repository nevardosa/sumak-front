import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Multiple security layers
  if (!authService.isAuthenticated()) {
    router.navigate(['/auth/login']);
    return false;
  }
  
  // Update activity on route access
  authService.updateActivity();
  
  // Additional validation for sensitive routes
  const protectedRoutes = ['/dashboard', '/profile', '/settings'];
  if (protectedRoutes.includes(state.url)) {
    const sessionToken = authService.sessionToken();
    if (!sessionToken || sessionToken.length < 32) {
      authService.logout();
      return false;
    }
  }
  
  return true;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    router.navigate(['/dashboard']);
    return false;
  }
  
  return true;
};