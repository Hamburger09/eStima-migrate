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

// // import { CrmContactListComponent } from './pages/crm-contact-list/crm-contact-list.component';
// import { CrmContactDetailsComponent } from './pages/crm-contact-details/crm-contact-details.component';
// import { PlanningTaskListComponent } from './pages/planning-task-list/planning-task-list.component';
// import { PlanningTaskDetailsComponent } from './pages/planning-task-details/planning-task-details.component';
import { AnalyticsDashboardComponent } from './projects/eStima/pages/analytics-dashboard/analytics-dashboard.component';
// import { AnalyticsSalesAnalysisComponent } from './pages/analytics-sales-analysis/analytics-sales-analysis.component';
// import { AnalyticsGeographyComponent } from './pages/analytics-geography/analytics-geography.component';
// import { PlanningSchedulerComponent } from './pages/planning-scheduler/planning-scheduler.component';
// import { AppSignInComponent } from './pages/sign-in-form/sign-in-form.component';
// import { AppRegisterComponent } from './pages/register-form/register-form.component';
// import { AppResetPasswordComponent } from './pages/reset-password-form/reset-password-form.component';
import { UserProfileComponent } from './projects/eStima/pages/user-profile/user-profile.component';
import { noAuthGuard } from 'src/app/guard/no-auth.guard';
import { ROLES } from 'src/app/shared/constants';
import { authGuard } from './guard/auth.guard';
import { APP_TYPE } from './types/app_type';
import { ProjectGuard } from './guard/project.guard';
import { appGuard } from './guard/app.guard';

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
        path: 'cabinet',
        loadChildren: () =>
          import('./projects/eStima/routes').then((m) => m.routes),
        data: {
          project: APP_TYPE.CABINET,
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [appGuard],
        runGuardsAndResolvers: 'always',
      },
      {
        path: 'materials',
        loadChildren: () =>
          import('./projects/smeta/routes').then((m) => m.routes),
        data: {
          project: APP_TYPE.MATERIALS,
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        runGuardsAndResolvers: 'always',
        canActivate: [appGuard],
      },
      // {
      //   path: 'crm-contact-list',
      //   component: CrmContactListComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'crm-contact-details',
      //   component: CrmContactDetailsComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'planning-task-list',
      //   component: PlanningTaskListComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'planning-task-details',
      //   component: PlanningTaskDetailsComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'planning-scheduler',
      //   component: PlanningSchedulerComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      {
        path: 'analytics-dashboard',
        component: AnalyticsDashboardComponent,
        data: {
          roles: [ROLES.ADMIN, ROLES.USER],
        },
        canActivate: [authGuard],
      },
      // {
      //   path: 'analytics-sales-analysis',
      //   component: AnalyticsSalesAnalysisComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'analytics-geography',
      //   component: AnalyticsGeographyComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
      // {
      //   path: 'reset-password-form',
      //   component: AppResetPasswordComponent,
      //   data: {
      //     roles: [ROLES.ADMIN, ROLES.USER],
      //   },
      //   canActivate: [authGuard],
      // },
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
