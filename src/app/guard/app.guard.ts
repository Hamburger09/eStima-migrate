import { inject } from '@angular/core';
import { AuthService } from '../services';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, take } from 'rxjs';

export const appGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    take(1), // ✅ Ensure observable completes after first emission
    map((loggedIn) => {
      if (!loggedIn) {
        console.log('User not logged in, redirecting to sign-in');
        router.navigate(['/auth/sign-in'], {
          queryParams: { returnUrl: state.url },
        });
        return false;
      }

      // 🔐 PROJECT CHECK
      const requiredProject = route.data?.['project'];
      if (requiredProject) {
        const appType = authService.getAppTypeFromStorage();
        if (appType !== requiredProject) {
          console.log('Wrong project, redirecting to forbidden');
          router.navigate(['/forbidden']);
          return false;
        }
      }

      // 🔐 ROLE CHECK
      const requiredRoles = route.data?.['roles'] ?? [];
      if (requiredRoles.length) {
        const role = authService.getRoleFromStorage();
        if (!role || !requiredRoles.includes(role)) {
          console.log('Insufficient role, redirecting to forbidden');
          router.navigate(['/forbidden']);
          return false;
        }
      }

      return true;
    }),
    catchError((err) => {
      console.error('Auth guard error:', err);
      // Clear token and redirect
      localStorage.removeItem('accessToken');
      router.navigate(['/auth/sign-in'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    })
  );
};
