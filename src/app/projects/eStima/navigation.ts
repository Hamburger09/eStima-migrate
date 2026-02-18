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

export const eStimaNavigation: DxNavItem[] = [
  {
    key: 'dashboard',
    text: 'NAV.DASHBOARD',
    icon: 'speedometer',
    path: '/analytics-dashboard',
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
        path: 'cabinet/users',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'online_users',
        text: 'NAV.ONLINE_USERS',
        icon: 'group',
        path: 'cabinet/online-users',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'roles',
        text: 'NAV.ROLES',
        icon: 'key',
        path: 'cabinet/roles',
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
        path: 'cabinet/organizations',
        roles: [ROLES.ADMIN],
      },

      {
        key: 'transfers',
        text: 'NAV.TRANSFERS',
        icon: 'repeat',
        path: 'cabinet/transfers',
        roles: [ROLES.ADMIN, ROLES.USER],
        items: [
          {
            key: 'incoming_transfers',
            text: 'NAV.INCOMING_TRANSFERS',
            path: 'cabinet/transfers/incoming-transfers',
          },
          {
            key: 'outgoing_transfers',
            text: 'NAV.OUTGOING_TRANSFERS',
            path: 'cabinet/transfers/outgoing-transfers',
          },
        ],
      },

      {
        key: 'objects',
        text: 'NAV.OBJECTS',
        icon: 'home',
        path: 'cabinet/objects',
        roles: [ROLES.ADMIN, ROLES.USER],
        items: [
          {
            key: 'customer',
            text: 'NAV.CUSTOMER',
            path: 'cabinet/objects/customer',
          },
          {
            key: 'contractor',
            text: 'NAV.CONTRACTOR',
            path: 'cabinet/objects/contractor',
          },
          {
            key: 'designer',
            text: 'NAV.DESIGNER',
            path: 'cabinet/objects/designer',
          },
          {
            key: 'expert',
            text: 'NAV.EXPERT',
            path: 'cabinet/objects/expert',
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
        path: 'cabinet/countries',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'cities',
        text: 'NAV.CITIES',
        icon: 'map',
        path: 'cabinet/cities',
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
        path: 'cabinet/exe',
      },
    ],
  },

  // UPDATES
  {
    key: 'updates',
    text: 'NAV.UPDATES',
    icon: 'bell',
    path: 'cabinet/updates',
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
        path: 'cabinet/logs',
        roles: [ROLES.ADMIN],
      },
      {
        key: 'viewer',
        text: 'NAV.VIEWER',
        icon: 'image',
        path: 'cabinet/viewer',
        roles: [ROLES.ADMIN, ROLES.USER],
      },
    ],
  },
];
