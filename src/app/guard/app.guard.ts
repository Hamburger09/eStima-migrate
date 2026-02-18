import { inject } from '@angular/core';
import { AuthService } from '../services';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

export const appGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map((loggedIn) => {
      if (!loggedIn) {
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
          router.navigate(['/forbidden']);
          return false;
        }
      }

      // 🔐 ROLE CHECK
      const requiredRoles = route.data?.['roles'] ?? [];
      if (requiredRoles.length) {
        const role = authService.getRoleFromStorage();
        if (!role || !requiredRoles.includes(role)) {
          router.navigate(['/forbidden']);
          return false;
        }
      }

      return true;
    }),
    catchError(() => {
      router.navigate(['/auth/sign-in']);
      return of(false);
    })
  );
};
