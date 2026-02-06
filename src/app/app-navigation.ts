// export const navigation = [
//   {
//     text: 'CRM',
//     icon: 'user',
//     path: '',
//     items: [
//       {
//         text: 'Users',
//         path: '/users',
//       },
//       {
//         text: 'Online Users',
//         path: '/online-users',
//       },
//       {
//         text: 'Contact List',
//         path: '/crm-contact-list',
//       },
//       {
//         text: 'Contact Details',
//         path: '/crm-contact-details',
//       },
//     ],
//   },
//   {
//     text: 'Planning',
//     icon: 'event',
//     path: '',
//     items: [
//       {
//         text: 'Task List',
//         path: '/planning-task-list',
//       },
//       {
//         text: 'Task Details',
//         path: '/planning-task-details',
//       },
//       {
//         text: 'Scheduler',
//         path: '/planning-scheduler',
//       },
//     ],
//   },
//   {
//     text: 'Analytics',
//     icon: 'chart',
//     path: '',
//     items: [
//       {
//         text: 'Dashboard',
//         path: '/analytics-dashboard',
//       },
//       {
//         text: 'Sales Analysis',
//         path: '/analytics-sales-analysis',
//       },
//       {
//         text: 'Geography',
//         path: '/analytics-geography',
//       },
//     ],
//   },
//   {
//     text: 'Authentication',
//     icon: 'card',
//     path: '',
//     items: [
//       {
//         text: 'Reset Password Form',
//         path: '/reset-password-form',
//       },
//     ],
//   },
//   {
//     text: 'Common',
//     icon: 'box',
//     path: '',
//     items: [
//       {
//         text: 'User Profile',
//         path: '/user-profile',
//       },
//     ],
//   },
// ];

import { ROLES } from 'src/app/shared/constants';

export type DxNavItem = {
  key?: string;
  text: string;
  icon?: string;
  path?: string; // for router navigation
  href?: string; // for direct link/download
  download?: boolean; // for <a download>
  roles?: string[];
  items?: DxNavItem[];
  separator?: boolean; // for visual separators if you want
};

export const navigation: DxNavItem[] = [
  {
    key: 'dashboard',
    text: 'NAV.DASHBOARD',
    icon: 'speedometer',
    path: '/dashboard',
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  // USERS & ACCESS (CoreUI title)
  {
    key: 'users_access',
    text: 'NAV.USERS_ACCESS',
    icon: 'lock',
    roles: [ROLES.ADMIN],
    items: [
      {
        key: 'users',
        text: 'USERS.USERS',
        icon: 'group',
        path: '/users',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'online_users',
        text: 'NAV.ONLINE_USERS',
        icon: 'group',
        path: '/online-users',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'roles',
        text: 'NAV.ROLES',
        icon: 'key',
        path: '/roles',
        roles: [ROLES.ADMIN],
      },
    ],
  },

  // OPERATIONS (CoreUI title)
  {
    key: 'operations',
    text: 'NAV.OPERATIONS',
    icon: 'folder',
    items: [
      {
        key: 'organizations',
        text: 'NAV.ORGANIZATIONS',
        icon: 'home',
        path: '/organizations',
        roles: [ROLES.ADMIN],
      },

      {
        key: 'transfers',
        text: 'NAV.TRANSFERS',
        icon: 'repeat',
        path: '/transfers',
        roles: [ROLES.ADMIN, ROLES.USER],
        items: [
          {
            key: 'incoming_transfers',
            text: 'NAV.INCOMING_TRANSFERS',
            icon: 'chevrondown',
            path: '/transfers/incoming-transfers',
          },
          {
            key: 'outgoing_transfers',
            text: 'NAV.OUTGOING_TRANSFERS',
            icon: 'chevronup',
            path: '/transfers/outgoing-transfers',
          },
        ],
      },

      {
        key: 'objects',
        text: 'NAV.OBJECTS',
        icon: 'home',
        path: '/objects',
        roles: [ROLES.ADMIN, ROLES.USER],
        items: [
          {
            key: 'customer',
            text: 'NAV.CUSTOMER',
            icon: 'bulletlist',
            path: '/objects/customer',
          },
          {
            key: 'contractor',
            text: 'NAV.CONTRACTOR',
            icon: 'bulletlist',
            path: '/objects/contractor',
          },
          {
            key: 'designer',
            text: 'NAV.DESIGNER',
            icon: 'bulletlist',
            path: '/objects/designer',
          },
          {
            key: 'expert',
            text: 'NAV.EXPERT',
            icon: 'bulletlist',
            path: '/objects/expert',
          },
        ],
      },
    ],
  },

  // GEOGRAPHY (CoreUI title)
  {
    key: 'geography',
    text: 'NAV.GEOGRAPHY',
    icon: 'map',
    roles: [ROLES.ADMIN],
    items: [
      {
        key: 'regions',
        text: 'NAV.COUNTRIES',
        icon: 'globe',
        path: '/countries',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'cities',
        text: 'NAV.CITIES',
        icon: 'map',
        path: '/cities',
        roles: [ROLES.ADMIN],
      },
    ],
  },

  // DOWNLOADS
  {
    key: 'downloads',
    text: 'NAV.DOWNLOADS',
    icon: 'download',
    roles: [ROLES.ADMIN, ROLES.USER],
    items: [
      {
        key: 'downloads_setup',
        text: 'NAV.DOWNLOADS_SETUP',
        icon: 'download',
        href: 'assets/eStimaSetup.zip',
        download: true,
      },
      {
        key: 'downloads_exe',
        text: 'NAV.DOWNLOADS_EXE',
        icon: 'download',
        path: '/exe',
      },
    ],
  },

  // UPDATES
  {
    key: 'updates',
    text: 'NAV.UPDATES',
    icon: 'bell',
    path: '/updates',
    roles: [ROLES.ADMIN, ROLES.USER],
  },

  // MONITORING (CoreUI title)
  {
    key: 'monitoring',
    text: 'NAV.MONITORING',
    icon: 'eyeopen',
    items: [
      {
        key: 'logs',
        text: 'NAV.LOGS',
        icon: 'doc',
        path: '/logs',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'viewer',
        text: 'NAV.VIEWER',
        icon: 'image',
        path: '/viewer',
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
];
