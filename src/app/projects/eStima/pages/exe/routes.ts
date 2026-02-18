import { Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/guard/can-deactivate.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./exe.component').then((m) => m.ExeComponent),
    data: {
      title: 'USERS.EXE',
    },
    canDeactivate: [CanDeactivateGuard],
  },
];
