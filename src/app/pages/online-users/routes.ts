import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./online-users.component').then(m => m.OnlineUsersComponent),
    data: {
      title: 'NAV.ONLINE_USERS',
    }
  }
];

