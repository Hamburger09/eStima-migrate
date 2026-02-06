import { Routes } from '@angular/router';
import { constructionGuard } from 'src/app/guard/construction.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./all-constructions.component').then(
        (m) => m.AllConstructionsComponent
      ),
    canActivate: [constructionGuard],
    canActivateChild: [constructionGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./construction.component').then(
            (m) => m.ConstructionComponent
          ),
        data: {
          title: `All Transfers`,
        },
      },
      {
        path: 'incoming-transfers',
        loadComponent: () =>
          import('./incoming-transfers.component').then(
            (m) => m.IncomingTransfersComponent
          ),
        data: {
          title: `Incoming Transfers`,
        },
      },
      {
        path: 'outgoing-transfers',
        loadComponent: () =>
          import('./outgoing-transfers.component').then(
            (m) => m.OutgoingTransfersComponent
          ),
        data: {
          title: `Outgoing Transfers`,
        },
      },
    ],
  },
];
