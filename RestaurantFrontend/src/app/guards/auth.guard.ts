/**
 * Authentication guard that protects routes from unauthorized access.
 * Implements the CanActivate interface to control navigation to protected routes.
 * 
 * @description
 * This guard performs the following functions:
 * - Checks if a user is currently authenticated before allowing route access
 * - Redirects unauthenticated users to the login page
 * - Preserves the originally requested URL as a query parameter for post-login redirection
 * 
 * Used in route configurations to restrict access to routes that require authentication.
 * Example usage in routing module:
 * { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const currentUser = authService.currentUserValue;
  if (currentUser) {
    return true;
  }
  
  router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
  return false;
};