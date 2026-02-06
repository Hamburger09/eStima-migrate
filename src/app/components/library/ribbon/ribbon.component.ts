import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  DxTabPanelModule,
  DxToolbarModule,
  DxButtonModule,
} from 'devextreme-angular';

import { SharedModule } from 'src/app/shared/shared.module';

export type RibbonBtnType =
  | 'primary'
  | 'secondary'
  | 'warning'
  | 'success'
  | 'outline-info';

export type RibbonTab = {
  key: string;
  label: string;
  buttons: {
    label: string;
    icon?: string;
    type?: RibbonBtnType;
    action: string;
  }[];
};
@Component({
  selector: 'app-ribbon',
  standalone: true,
  imports: [DxTabPanelModule, DxToolbarModule, DxButtonModule, SharedModule],
  templateUrl: './ribbon.component.html',
  styleUrls: ['./ribbon.component.scss'],
})
export class RibbonComponent {
  @Input() tabs: RibbonTab[] = [];

  @Input() activeKey: string = '';
  @Output() activeKeyChange = new EventEmitter<string>();
  @Output() action = new EventEmitter<string>();

  /** dx-tab-panel uses selectedIndex, so we map key <-> index */
  get selectedIndex(): number {
    const idx = this.tabs.findIndex((t) => t.key === this.activeKey);
    return idx >= 0 ? idx : 0;
  }

  onSelectedIndexChange = (index: number) => {
    const tab = this.tabs[index];
    if (!tab) return;
    this.activeKey = tab.key;
    this.activeKeyChange.emit(tab.key);
  };

  handleAction(action: string) {
    this.action.emit(action);
  }

  /** DevExtreme types look different; map your types to dx-button props */
  getDxType(
    btnType?: RibbonBtnType
  ): 'default' | 'success' | 'danger' | 'normal' {
    switch (btnType) {
      case 'success':
        return 'success';
      case 'warning':
        return 'danger'; // closest in DX palette
      case 'secondary':
      case 'outline-info':
        return 'normal';
      case 'primary':
      default:
        return 'default';
    }
  }

  getDxStylingMode(btnType?: RibbonBtnType): 'contained' | 'outlined' | 'text' {
    if (btnType === 'outline-info') return 'outlined';
    if (btnType === 'secondary') return 'text';
    return 'contained';
  }

  /** dx-icon names differ from CoreUI; if you pass dx icons, they will work */
  normalizeIcon(icon?: string): string | undefined {
    // If you already pass DevExtreme icons like "add", "save", "trash" => works.
    // If you pass CoreUI icons (cilX), you can map them here later.
    return icon || undefined;
  }

  /** Toolbar items for the active tab buttons */
  get toolbarItems(): any[] {
    const tab = this.tabs[this.selectedIndex];
    const buttons = tab?.buttons ?? [];

    return buttons.map((btn) => ({
      location: 'before',
      locateInMenu: 'auto',
      widget: 'dxButton',
      options: {
        text: btn.label, // translated in template to keep pipe usage
        icon: this.normalizeIcon(btn.icon),
        type: this.getDxType(btn.type),
        stylingMode: this.getDxStylingMode(btn.type),
        onClick: () => this.handleAction(btn.action),
      },
      // keep original object for template translation
      __btn: btn,
    }));
  }
}
