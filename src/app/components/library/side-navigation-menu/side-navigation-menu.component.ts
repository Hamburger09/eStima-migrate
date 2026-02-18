import {
  Component,
  Output,
  Input,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  inject,
} from '@angular/core';

import {
  DxTreeViewModule,
  DxTreeViewComponent,
  DxTreeViewTypes,
} from 'devextreme-angular/ui/tree-view';

import * as events from 'devextreme/events';
import { Subscription } from 'rxjs';

import { eStimaNavigation } from 'src/app/projects/eStima/navigation';
import { smetaNavigation } from 'src/app/projects/smeta/navigation';
import type { DxNavItem } from '../../../app-navigation';

import { AuthService } from 'src/app/services/auth.service';
import { ServerStroykaUserService } from 'src/app/services/server-stroyka-user.service';
import { TServerStroykaUsers } from 'src/app/interfaces/TypesABase.interface';
import { TranslateService } from '@ngx-translate/core';
import { ROLES } from 'src/app/shared/constants';
import { SharedModule } from 'src/app/shared/shared.module';
import { APP_TYPE } from 'src/app/types/app_type';

@Component({
  selector: 'side-navigation-menu',
  templateUrl: './side-navigation-menu.component.html',
  styleUrls: ['./side-navigation-menu.component.scss'],
  imports: [DxTreeViewModule, SharedModule],
})
export class SideNavigationMenuComponent implements AfterViewInit, OnDestroy {
  @ViewChild(DxTreeViewComponent, { static: true })
  menu!: DxTreeViewComponent;

  @Output()
  selectedItemChanged = new EventEmitter<DxTreeViewTypes.ItemClickEvent>();

  @Output()
  openMenu = new EventEmitter<any>();

  @Input()
  get compactMode() {
    return this._compactMode;
  }

  @Input()
  set selectedItem(value: string) {
    this._selectedItem = value;
    this.setSelectedItem();
  }

  get selectedItem(): string {
    return this._selectedItem;
  }

  set compactMode(val: boolean) {
    this._compactMode = val;

    if (!this.menu.instance) return;

    if (val) this.menu.instance.collapseAll();
    else this.menu.instance.expandItem(this._selectedItem);
  }

  private _selectedItem!: string;
  private _compactMode = false;

  private elementRef = inject(ElementRef);
  private sub = new Subscription();

  // ✅ final processed items (role filtered + modified + translated)
  private _items: DxNavItem[] = [];

  // optional: cache roleCounts like CoreUI did
  private roleCounts: Record<number, number> = {};

  constructor(
    private authService: AuthService,
    private serverStroykaUserService: ServerStroykaUserService,
    private translateService: TranslateService
  ) {}

  // ====== PUBLIC getter used by template ======
  get items() {
    return this._items;
  }

  // ====== MAIN: build menu ======
  private rebuildMenu(): void {
    const role = this.authService.getRoleFromStorage() ?? '';
    const userId = this.authService.getUserIdFromStorage();
    const app_type = this.authService.getAppTypeFromStorage();
    let cloned;
    // start from the base navigation
    if (app_type === APP_TYPE.CABINET) {
      cloned = this.deepClone(eStimaNavigation);
    } else {
      cloned = this.deepClone(smetaNavigation);
    }

    // role filter first
    let filtered = this.filterByRole(cloned, role);

    // if no userId -> just apply rules + translate
    if (!userId) {
      filtered = this.applySpecialRules(filtered, role, {});
      this._items = this.translateNav(filtered);
      return;
    }

    // fetch users => counts => apply rules + translate
    this.sub.add(
      this.serverStroykaUserService
        .getUsers(userId)
        .subscribe((users: TServerStroykaUsers[]) => {
          this.roleCounts =
            this.serverStroykaUserService.getUserRoleCounts(users);

          const updated = this.applySpecialRules(
            filtered,
            role,
            this.roleCounts
          );
          this._items = this.translateNav(updated);

          // update selection after rebuild
          queueMicrotask(() => this.setSelectedItem());
        })
    );
  }

  // ====== helpers ======
  private deepClone<T>(obj: T): T {
    // structuredClone is best if available, fallback otherwise
    try {
      // @ts-ignore
      return structuredClone(obj);
    } catch {
      return JSON.parse(JSON.stringify(obj));
    }
  }

  private filterByRole(items: DxNavItem[], role: string): DxNavItem[] {
    return items
      .filter((it) => !it.roles || it.roles.includes(role))
      .map((it) => ({
        ...it,
        items: it.items ? this.filterByRole(it.items, role) : undefined,
      }))
      .filter((it) => {
        // remove empty groups
        const hasChildren = it.items && it.items.length > 0;
        const isLeaf = !!it.path || !!it.href;
        return hasChildren || isLeaf;
      });
  }

  private applySpecialRules(
    items: DxNavItem[],
    role: string,
    counts: Record<number, number>
  ): DxNavItem[] {
    return items.map((it) => {
      let next: DxNavItem = { ...it, expanded: true };

      // normalize path with leading slash
      if (next.path && !next.path.startsWith('/')) next.path = `/${next.path}`;

      // CoreUI rule: /transfers admin -> no children
      if (next.path === '/cabinet/transfers' && role === ROLES.ADMIN) {
        next.items = undefined;
      }

      // CoreUI rule: /objects children badges by index+1
      if (next.path === '/cabinet/objects' && next.items?.length) {
        next.items = next.items.map((child, index) => ({
          ...child,
          badge: { text: String(counts[index + 1] ?? 0), color: 'info' },
        }));
      }

      // recurse
      if (next.items?.length) {
        next.items = this.applySpecialRules(next.items, role, counts);
      }

      return next;
    });
  }

  private translateNav(items: DxNavItem[]): DxNavItem[] {
    return items.map((it) => ({
      ...it,
      // DevExtreme TreeView shows "text"
      text: it.text ? this.translateService.instant(it.text) : it.text,
      items: it.items ? this.translateNav(it.items) : undefined,
    }));
  }

  // ====== devextreme tree stuff ======
  setSelectedItem() {
    if (!this.menu.instance) return;
    if (!this.selectedItem) return;
    this.menu.instance.selectItem(this.selectedItem);
  }

  onItemClick(event: DxTreeViewTypes.ItemClickEvent) {
    const item = event.itemData as DxNavItem;

    // If it has href and download flag
    if (item.href && item.download) {
      const link = document.createElement('a');
      link.href = item.href;
      link.download = '';
      link.click();
      return;
    }
    this.selectedItemChanged.emit(event);
  }

  ngAfterViewInit() {
    // initial build
    this.rebuildMenu();

    // rebuild on language change
    this.sub.add(
      this.translateService.onLangChange.subscribe(() => {
        this.rebuildMenu();
      })
    );

    this.setSelectedItem();

    events.on(this.elementRef.nativeElement, 'dxclick', (e: Event) => {
      this.openMenu.next(e);
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    events.off(this.elementRef.nativeElement, 'dxclick');
  }
}
