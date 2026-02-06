import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./countries.component').then((m) => m.CountriesComponent),
    data: {
      title: `Countries`,
    },
  },
];
