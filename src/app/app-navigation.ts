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
  expanded?: boolean; // for tree expansion state
};
