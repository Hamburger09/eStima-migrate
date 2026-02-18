import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./crm-contact-list.component').then(
        (m) => m.CrmContactListComponent
      ),
    data: {
      title: `Contact List`,
    },
  },
];
