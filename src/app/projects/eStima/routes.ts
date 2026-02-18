import { Routes } from '@angular/router';
import { authGuard } from 'src/app/guard/auth.guard';
import { ROLES } from 'src/app/shared/constants';

export const routes: Routes = [
  {
    path: 'users',
    loadChildren: () => import('./pages/users/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'online-users',
    loadChildren: () =>
      import('./pages/online-users/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'roles',
    loadChildren: () => import('./pages/roles/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN],
    },
    canActivate: [authGuard],
  },
  {
    path: 'countries',
    loadChildren: () =>
      import('./pages/countries/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'cities',
    loadChildren: () => import('./pages/cities/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'organizations',
    loadChildren: () =>
      import('./pages/organizations/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN],
    },
    canActivate: [authGuard],
  },
  {
    path: 'transfers',
    loadChildren: () =>
      import('./pages/construction/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'updates',
    loadChildren: () => import('./pages/updates/routes').then((m) => m.routes),
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
    canActivate: [authGuard],
  },
  {
    path: 'exe',
    loadChildren: () => import('./pages/exe/routes').then((m) => m.routes),
    canActivate: [authGuard],
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
  },
  {
    path: 'objects',
    loadChildren: () => import('./pages/objects/routes').then((m) => m.routes),
    canActivate: [authGuard],
    data: {
      roles: [ROLES.ADMIN, ROLES.USER],
    },
  },
  {
    path: 'logs',
    loadChildren: () => import('./pages/logs/routes').then((m) => m.routes),
    canActivate: [authGuard],
    data: {
      roles: [ROLES.ADMIN],
    },
  },
];
