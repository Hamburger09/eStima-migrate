import { Routes } from '@angular/router';
import {
  LoginFormComponent,
  ResetPasswordFormComponent,
  CreateAccountFormComponent,
  ChangePasswordFormComponent,
} from './components';

import {
  SideNavOuterToolbarComponent,
  UnauthenticatedContentComponent,
} from './layouts';

import { CrmContactListComponent } from './pages/crm-contact-list/crm-contact-list.component';
import { CrmContactDetailsComponent } from './pages/crm-contact-details/crm-contact-details.component';
import { PlanningTaskListComponent } from './pages/planning-task-list/planning-task-list.component';
import { PlanningTaskDetailsComponent } from './pages/planning-task-details/planning-task-details.component';
import { AnalyticsDashboardComponent } from './pages/analytics-dashboard/analytics-dashboard.component';
import { AnalyticsSalesAnalysisComponent } from './pages/analytics-sales-analysis/analytics-sales-analysis.component';
import { AnalyticsGeographyComponent } from './pages/analytics-geography/analytics-geography.component';
import { PlanningSchedulerComponent } from './pages/planning-scheduler/planning-scheduler.component';
import { AppSignInComponent } from './pages/sign-in-form/sign-in-form.component';
import { AppRegisterComponent } from './pages/register-form/register-form.component';
import { AppResetPasswordComponent } from './pages/reset-password-form/reset-password-form.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { noAuthGuard } from 'src/app/guard/no-auth.guard';
import { ROLES } from 'src/app/shared/constants';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'analytics-dashboard',
  },
  {
    path: 'auth',
    component: UnauthenticatedContentComponent,
    children: [
      {
        path: 'sign-in',
        component: LoginFormComponent,
        data: {
          title: 'Login Page',
        },
        canActivate: [noAuthGuard],
      },
      {
        path: 'reset-password',
        component: ResetPasswordFormComponent,
      },
      {
        path: 'register',
        component: CreateAccountFormComponent,
      },
      {
        path: 'change-password/:recoveryCode',
        component: ChangePasswordFormComponent,
      },
      ...[
        { from: 'create-account', to: 'register' },
        { from: 'login', to: 'sign-in' },
      ].map((redirect) => ({
        path: redirect.from,
        redirectTo: redirect.to,
        pathMatch: 'full' as const,
      })),
      {
        path: '**',
        redirectTo: 'sign-in',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    component: SideNavOuterToolbarComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./pages/users/routes').then((m) => m.routes),
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
        loadChildren: () =>
          import('./pages/roles/routes').then((m) => m.routes),
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
        loadChildren: () =>
          import('./pages/cities/routes').then((m) => m.routes),
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
        loadChildren: () =>
          import('./pages/updates/routes').then((m) => m.routes),
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
        loadChildren: () =>
          import('./pages/objects/routes').then((m) => m.routes),
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
      {
        path: 'crm-contact-list',
        component: CrmContactListComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'crm-contact-details',
        component: CrmContactDetailsComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'planning-task-list',
        component: PlanningTaskListComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'planning-task-details',
        component: PlanningTaskDetailsComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'planning-scheduler',
        component: PlanningSchedulerComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboardComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'analytics-sales-analysis',
        component: AnalyticsSalesAnalysisComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'analytics-geography',
        component: AnalyticsGeographyComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'reset-password-form',
        component: AppResetPasswordComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      {
        path: 'user-profile',
        component: UserProfileComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      ...[
        { from: 'analytics-sales-report', to: 'analytics-sales-analysis' },
        { from: 'sign-up-form', to: 'register-form' },
      ].map((redirect) => ({
        path: redirect.from,
        redirectTo: redirect.to,
        pathMatch: 'full' as const,
      })),
      {
        path: '**',
        redirectTo: 'analytics-dashboard',
        pathMatch: 'full',
      },
    ],
  },
];
