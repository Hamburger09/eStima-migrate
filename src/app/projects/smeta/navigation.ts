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

export const smetaNavigation: DxNavItem[] = [
  {
    key: 'home',
    text: 'NAV.HOME',
    icon: 'home',
    path: 'materials/home',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
  {
    key: 'crm_contact_list',
    text: 'NAV.SEARCH',
    icon: 'search',
    path: 'materials/search',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
  {
    key: 'price-list',
    text: 'NAV.PRICE_LIST',
    icon: 'price-tag',
    path: 'materials/price-list',
    roles: [ROLES.ADMIN, ROLES.USER],
  },
];
