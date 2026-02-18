import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./roles.component').then(m => m.RolesComponent),
    data: {
      title: 'USERS.ROLE'
    }
  }
];

