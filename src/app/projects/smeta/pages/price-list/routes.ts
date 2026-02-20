import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./price-list.component').then((m) => m.PriceListComponent),
    data: {
      title: `Home`,
    },
  },
];
