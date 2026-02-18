import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guard/auth.guard';
import { ROLES } from 'src/app/shared/constants';

export const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },

  {
    path: 'search',
    loadChildren: () =>
      import('./pages/crm-contact-list/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
];
