import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: `Objects`,
    },
    children: [
      {
        path: '',
        redirectTo: 'customer',
        pathMatch: 'full',
      },
      {
        path: 'customer',
        loadComponent: () =>
          import('./customer/customer.component').then(
            (m) => m.CustomerComponent
          ),
        data: {
          title: `Customer`,
        },
      },
      {
        path: 'contractor',
        loadComponent: () =>
          import('./contractor/contractor.component').then(
            (m) => m.ContractorComponent
          ),
        data: {
          title: `Contractor`,
        },
      },
      {
        path: 'expert',
        loadComponent: () =>
          import('./expert/expert.component').then((m) => m.ExpertComponent),
        data: {
          title: `Expert`,
        },
      },
      {
        path: 'designer',
        loadComponent: () =>
          import('./designer/designer.component').then(
            (m) => m.DesignerComponent
          ),
        data: {
          title: `Designer`,
        },
      },
    ],
  },
];
