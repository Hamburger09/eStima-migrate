import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { map, catchError, of, take } from 'rxjs';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Synchronous check first - if no token, allow access immediately
  const token = authService.getTokenFromStorage();
  if (!token) {
    return true;
  }

  // If token exists but is expired, allow access (don't try to refresh)
  if (authService.isTokenExpired()) {
    return true;
  }

  // Token exists and is valid - redirect to dashboard
  return authService.isLoggedIn().pipe(
    take(1), // Prevent multiple emissions
    map((loggedIn) => {
      if (loggedIn) {
        console.log('User already logged in, redirecting to dashboard');
        return router.createUrlTree(['/analytics-dashboard']);
      }
      return true; // Allow access to login page
    }),
    catchError((err) => {
      console.error('NoAuth guard error:', err);
      // On error, allow access to login page
      return of(true);
    })
  );
};
