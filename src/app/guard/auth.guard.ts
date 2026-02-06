import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    // CRITICAL: Prevent multiple emissions that could cause loops
    map((loggedIn) => {
      if (!loggedIn) {
        console.log('User not logged in, redirecting to sign-in');
        router.navigate(['/auth/sign-in'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      const requiredRoles = (route.data?.['roles'] ?? []) as string[];
      if (!requiredRoles.length) return true;

      const userRoleName = authService.getRoleFromStorage();
      if (userRoleName && requiredRoles.includes(userRoleName)) {
        return true;
      }

      console.log('User does not have required role, redirecting');
      router.navigate(['/auth/sign-in']);
      return false;
    }),
    catchError((err) => {
      console.error('Auth guard error:', err);
      // Don't call logout here - it might cause a loop
      authService.logout().subscribe();
      router.navigate(['/auth/sign-in'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    })
  );
};
