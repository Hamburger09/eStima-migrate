import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { inject } from '@angular/core';
import { of } from 'rxjs';
import { ROLES } from '../shared/constants';

export const constructionGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRoleFromStorage();
  const url = state.url.toLowerCase().replace(/\/$/, ''); // Remove trailing slash

  // Only ADMIN can access exactly /construction
  if (url === '/transfers') {
    return role === ROLES.ADMIN
      ? true
      : router.parseUrl('/transfers/incoming-transfers');
  }

  // Only USER can access these child routes
  if (
    role === ROLES.USER &&
    (url.startsWith('/transfers/incoming-transfers') ||
      url.startsWith('/transfers/outgoing-transfers'))
  ) {
    return true;
  }

  // Block anything else
  return router.parseUrl('/404');
};
