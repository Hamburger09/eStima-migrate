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
  // ✅ strip both leading slash AND trailing slash
  const url = state.url.toLowerCase().replace(/^\/|\/$/g, '');

  // Only ADMIN can access exactly /construction
  if (url === 'cabinet/transfers') {
    return role === ROLES.ADMIN
      ? true
      : router.parseUrl('/cabinet/transfers/incoming-transfers');
  }

  // Only USER can access these child routes
  if (
    role === ROLES.USER &&
    (url.startsWith('cabinet/transfers/incoming-transfers') ||
      url.startsWith('cabinet/transfers/outgoing-transfers'))
  ) {
    return true;
  }

  // Block anything else
  return router.parseUrl('/404');
};
