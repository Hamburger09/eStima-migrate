import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./updates.component').then(m => m.UpdatesComponent),
    data: {
      title: $localize`Updates`
    }
  }
];

