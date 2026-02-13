import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  Input,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TableComponent } from '../../components/library/table/table.component';
import { RibbonComponent } from 'src/app/components/library/ribbon/ribbon.component';
import { TableSmetaComponent } from '../../components/library/table-smeta/table-smeta.component';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { ServerStroykaUserService } from '../../services/server-stroyka-user.service';
import { ServerStroykaRoleService } from '../../services/server-stroyka-role.service';
import { ServerStroykaService } from '../../services/server-stroyka.service';
import { LoadingService } from '../../services/loading.service';
import { NotificationService } from '../../services/notification.service';

import {
  TServerStroyka,
  TServerStroykaRoles,
  TServerStroykaUsers,
  User,
} from '../../interfaces/TypesABase.interface';
import {
  TNotification,
  SvodResursGroup,
  TreeNode,
  ConstructionObject,
} from '../../interfaces/TypesTBase.interface';
import { ROLE_NAMES } from 'src/app/shared/constants';

import {
  DxTreeListModule,
  DxTabPanelModule,
  DxSortableModule,
  DxPopupModule,
  DxButtonModule,
  DxTextBoxModule,
  DxSelectBoxModule,
  DxDataGridModule,
  DxToastModule,
} from 'devextreme-angular';

// Interfaces
export interface StroykaData {
  id: string;
  name: string;
  num?: string;
  num_reg?: string;
  guid_id?: string | null;
  obekts: TreeNodeStroyka[];
  razdel_svod_resurs_list?: SvodResursGroup[];
  selectedIndex?: number;
}

export interface TreeNodeStroyka {
  id: string;
  name: string;
  num?: string;
  num_reg?: string;
  guid_id?: string | null;
  smetas?: TreeNodeStroyka[];
  razdels?: TreeNodeStroyka[];
  works?: TreeNodeStroyka[];
}

interface TabItem {
  id: string;
  title: string;
  type: 'fixed' | 'smeta';
  closable?: boolean;
  data?: any;
}

@Component({
  selector: 'app-stroyka',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    TableComponent,
    RibbonComponent,
    TableSmetaComponent,
    DxTreeListModule,
    DxTabPanelModule,
    DxSortableModule,
    DxPopupModule,
    DxButtonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDataGridModule,
    DxToastModule,
  ],
  templateUrl: './stroyka.component.html',
  styleUrls: ['./stroyka.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StroykaComponent implements OnInit {
  @Input() stroykaRole: number = 0;

  addStroykaUserForm: FormGroup;
  stroykaColumns: {
    label: string;
    key: string;
    valueGetter?: (row: any) => string;
  }[] = [];
  activeTab: string = 'home';

  // Signals
  stroykaUsers = signal<TServerStroykaUsers[]>([]);
  recipientUsers = signal<User[]>([]);
  searchedRecipient = signal<User | null>(null);
  errorMessage = signal<string | null>(null);
  stroykaRoles = signal<TServerStroykaRoles[]>([]);
  recipient = signal<User | null>(null);
  selectedStroyka = signal<TServerStroykaUsers[]>([]);
  selectedIndex = signal<number>(0);
  tabs = signal<TabItem[]>([]);
  objects = signal<TreeNodeStroyka[]>([]);
  svod_resources = signal<SvodResursGroup[]>([]);
  readonly = signal<boolean>(true);
  changedResourcesList = signal<any[]>([]);
  objectsTreeData = signal<any[]>([]);

  // Popup visibility
  showAddUserPopup = false;
  showConfirmUserPopup = false;
  showSendPricePopup = false;
  showDeletePopup = false;
  showError = false;

  currentStroykaId: string | null = null;
  selectedStroykas = new Map<string, StroykaData>();
  tabCache = new Map<string, { tabs: TabItem[]; selectedIndex: number }>();

  private readonly FIXED_TABS: TabItem[] = [
    { id: 'objects', title: 'CONSTRUCTION.OBJECTS_SMETAS', type: 'fixed' },
    { id: 'svod', title: 'CONSTRUCTION.SVOD_RESOURCES', type: 'fixed' },
  ];

  // Ribbon configuration
  ribbonTabs = [
    {
      key: 'home',
      label: 'COMMON.HOME',
      buttons: [
        { label: 'USERS.ADD_USER', type: 'primary', action: 'addStroykaUser' },
        { label: 'COMMON.OPEN', type: 'secondary', action: 'open' },
        { label: 'COMMON.DELETE', type: 'danger', action: 'delete' },
        {
          label: 'CONSTRUCTION.SEND.SVOD_RESOURCE_PRICE',
          type: 'outline-info',
          action: 'sendPrices',
        },
      ],
    },
  ];

  constructor(
    private serverStroykaUserService: ServerStroykaUserService,
    private serverStroykaRoleService: ServerStroykaRoleService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    public loadingService: LoadingService,
    private notificationService: NotificationService,
    private stroykaService: ServerStroykaService
  ) {
    this.addStroykaUserForm = this.fb.group({
      user_client_id: [''],
      user_id_recipient: [''],
      role_id: [''],
    });

    effect(() => {
      this.stroykaColumns = [{ label: 'COMMON.NAME', key: 'name' }];
    });
  }

  ngOnInit(): void {
    this.notificationService
      .getStroykaNotifications()
      .subscribe((notifications: TNotification[]) => {
        this.getStroykaUsers();
      });
    this.getRecipientUsers();
    this.getServerStroykaRoles();
    this.getStroykaUsers();
  }

  selectedConstruction(): StroykaData {
    return this.selectedStroykas.get(this.currentStroykaId!)!;
  }

  onStroykaSelect = (user: TServerStroykaUsers[]) => {
    this.selectedStroyka.set(user);
  };

  getRoleName(): string {
    return ROLE_NAMES[this.stroykaRole] || 'Неизвестная роль';
  }

  getRecipientUsers() {
    const userId = this.authService.getUserIdFromStorage();
    if (!userId) return;
    this.userService
      .getAllUsersByTransfers(Number(userId))
      .subscribe((users: User[]) => {
        this.recipientUsers.set(users);
      });
  }

  onRecipientSelect() {
    if (this.addStroykaUserForm.get('user_id_recipient')?.value) {
      this.addStroykaUserForm.patchValue({ user_client_id: '' });
      this.searchedRecipient.set(null);
    }
  }

  getStroykaUsers() {
    const userId = this.authService.getUserIdFromStorage();
    if (!userId) return;
    this.serverStroykaUserService
      .getUsers(userId)
      .subscribe((users: TServerStroykaUsers[]) => {
        let filteredUsers = users.filter(
          (user) => user.server_stroyka_role_id == this.stroykaRole
        );
        this.stroykaUsers.set(filteredUsers);
      });
  }

  getServerStroykaRoles() {
    this.serverStroykaRoleService
      .getRoles()
      .subscribe((roles: TServerStroykaRoles[]) => {
        this.stroykaRoles.set(roles);
      });
  }

  getOneStroyka(client_id: string, id_stroyka: number) {
    this.stroykaService
      .getOneStroyka(client_id, id_stroyka)
      .subscribe((stroyka: any) => {
        this.buildFlatObjectsTree(stroyka.obekts);
        this.openStroyka(stroyka as StroykaData);
      });
  }

  openStroyka(stroyka: StroykaData) {
    const id = stroyka.id;

    if (this.currentStroykaId !== null) {
      this.tabCache.set(this.currentStroykaId, {
        tabs: this.tabs().filter((t) => t.type === 'smeta'),
        selectedIndex: this.selectedIndex(),
      });
    }

    if (this.selectedStroykas.has(id)) {
      const existing = this.selectedStroykas.get(id)!;
      this.objects.set(existing.obekts || []);
      this.svod_resources.set(existing.razdel_svod_resurs_list || []);

      const cachedTabs = this.tabCache.get(id);
      if (cachedTabs) {
        this.tabs.set([...this.FIXED_TABS, ...cachedTabs.tabs]);
        this.selectedIndex.set(cachedTabs.selectedIndex);
      }

      this.currentStroykaId = id;
      return;
    }

    this.selectedStroykas.set(id, { ...stroyka, selectedIndex: 0 });
    this.objects.set(stroyka.obekts || []);
    this.svod_resources.set(stroyka.razdel_svod_resurs_list || []);
    this.currentStroykaId = id;

    const smetaTabs: TabItem[] = (stroyka.obekts || []).flatMap((obj) =>
      (obj.smetas || []).map((smeta) => ({
        id: smeta.id,
        title: smeta.name,
        type: 'smeta' as const,
        closable: true,
        data: smeta,
      }))
    );

    this.tabs.set([...this.FIXED_TABS, ...smetaTabs]);
    this.selectedIndex.set(0);
  }

  buildFlatObjectsTree(objects: ConstructionObject[]) {
    const result: any[] = [];
    objects.forEach((obj) => {
      result.push({ id: obj.id, name: obj.name, hasItems: true });
      (obj.smetas ?? []).forEach((smeta) => {
        result.push({
          id: `smeta-${smeta.id}`,
          parent_id: obj.id,
          name: smeta.name,
          razdels: smeta.razdels,
        });
      });
    });
    this.objectsTreeData.set(result);
  }

  onRowDblClick(e: any) {
    const rowData = e.data;
    if (rowData.parent_id) {
      // It's a smeta
      this.openSmeta(rowData);
    }
  }

  openSmeta(node: any) {
    const currentTabs = this.tabs();
    const existingTabIndex = currentTabs.findIndex((tab) => tab.id === node.id);
    if (existingTabIndex !== -1) {
      this.selectedIndex.set(existingTabIndex);
      return;
    }
    const updatedTabs: TabItem[] = [
      ...currentTabs,
      {
        title: node.name,
        id: node.id,
        data: node,
        closable: true,
        type: 'smeta',
      },
    ];
    this.tabs.set(updatedTabs);
    this.selectedIndex.set(updatedTabs.length - 1);
  }

  removeTab(tab: TabItem) {
    const updatedTabs = this.tabs().filter((t) => t.id !== tab.id);
    this.tabs.set(updatedTabs);
    if (this.selectedIndex() >= updatedTabs.length) {
      this.selectedIndex.set(Math.max(0, updatedTabs.length - 1));
    }
  }

  onTabReorder(e: any) {
    const reorderedTabs = [...this.tabs()];
    const [movedTab] = reorderedTabs.splice(e.fromIndex, 1);
    reorderedTabs.splice(e.toIndex, 0, movedTab);
    this.tabs.set(reorderedTabs);
  }

  onChangedSvodResources(changed: any[]) {
    this.changedResourcesList.set(changed);
  }

  onBackToList() {
    if (this.currentStroykaId !== null) {
      this.tabCache.set(this.currentStroykaId, {
        tabs: this.tabs().filter((t) => t.type === 'smeta'),
        selectedIndex: this.selectedIndex(),
      });
    }
    this.currentStroykaId = null;
  }

  deleteStroyka = (stroyka: TServerStroykaUsers) => {
    this.stroykaService
      .deleteOneStroyka(
        stroyka.user_client_id_owner!,
        stroyka.id_stroyka!,
        stroyka.server_stroyka_id
      )
      .subscribe(() => {
        const updatedUsers = this.stroykaUsers().filter(
          (user) => user.id !== stroyka.id
        );
        this.stroykaUsers.set(updatedUsers);
        if (this.selectedStroyka().includes(stroyka)) {
          this.selectedStroyka.set([]);
        }
        this.showDeletePopup = false;
      });
  };

  deleteStroykaPrompt = (stroyka: TServerStroykaUsers): void => {
    const user_client_id = this.authService.getUserClientIdFromStorage();
    if (user_client_id !== stroyka.user_client_id_owner) {
      this.showErrorMessage('CONSTRUCTION.ERRORS.DELETE');
      return;
    }
    this.showDeletePopup = true;
  };

  confirmDelete = (): void => {
    if (this.selectedStroyka().length === 1) {
      const stroyka = this.selectedStroyka()[0];
      this.deleteStroyka(stroyka);
      this.selectedStroyka.set([]);
    }
  };

  showErrorMessage(message: string) {
    this.errorMessage.set(message);
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
      this.errorMessage.set(null);
    }, 3000);
  }

  handleRibbonAction(action: string) {
    switch (action) {
      case 'addStroykaUser':
        this.validateOpenAddStroykaUserModal();
        break;
      case 'open':
        if (this.selectedStroyka().length === 1) {
          const selected = this.selectedStroyka()[0];
          this.getOneStroyka(
            selected.user_client_id_owner!,
            selected.id_stroyka!
          );
        } else {
          this.showErrorMessage('CONSTRUCTION.ERRORS.OPEN_ONE');
        }
        break;
      case 'delete':
        if (this.selectedStroyka().length === 0) {
          this.showErrorMessage('CONSTRUCTION.ERRORS.ONE_TO_DELETE');
          return;
        }
        if (this.selectedStroyka().length > 1) {
          this.showErrorMessage('CONSTRUCTION.ERRORS.ONLY_ONE_TO_DELETE');
          return;
        }
        this.deleteStroykaPrompt(this.selectedStroyka()[0]);
        break;
      case 'sendPrices':
        this.openSendSvodResourcePriceModal();
        break;
      default:
        console.log(`Unhandled ribbon action: ${action}`);
        break;
    }
  }

  validateOpenAddStroykaUserModal() {
    if (this.stroykaUsers().length == 0) {
      this.showErrorMessage('CONSTRUCTION.ERRORS.NO_AVAILABLE_USERS');
      return;
    }
    if (this.selectedStroyka().length == 0) {
      this.showErrorMessage('CONSTRUCTION.ERRORS.ONE_TO_ADD');
      return;
    }
    if (this.selectedStroyka().length > 1) {
      this.showErrorMessage('CONSTRUCTION.ERRORS.ONLY_ONE_TO_ADD');
      return;
    }
    this.addStroykaUserForm.reset();
    this.errorMessage.set(null);
    this.showAddUserPopup = true;
  }

  openSendSvodResourcePriceModal() {
    if (this.changedResourcesList().length === 0) {
      this.showErrorMessage('CONSTRUCTION.ERRORS.CHANGE_RESOURCE_TO_SEND');
      return;
    }
    this.showSendPricePopup = true;
  }

  onConfirmSendChangedSvodResources() {
    const resourceToSend = {
      user_id: this.authService.getUserIdFromStorage(),
      server_stroyka_id: this.selectedStroyka()[0].server_stroyka_id,
      id_stroyka: this.selectedStroyka()[0].id_stroyka,
      prices: [
        ...this.changedResourcesList().map((resource) => ({
          kodr: resource.kodr,
          kodm: resource.kodm,
          name: resource.name,
          gauge_name: resource.gauge_name,
          old_price: resource.old_price,
          price: resource.price,
        })),
      ],
    };
    this.stroykaService
      .updateSmetaResourcePrice(resourceToSend)
      .subscribe((data) => {
        this.showSendPricePopup = false;
        this.openStroyka(this.selectedConstruction());
        this.changedResourcesList.set([]);
      });
  }

  onAddStroykaUserFormSubmit() {
    const clientId = this.addStroykaUserForm.get('user_client_id')?.value;
    const recipientId = this.addStroykaUserForm.get('user_id_recipient')?.value;
    if (clientId) {
      this.userService.getByUserClientId(clientId).subscribe((user: User) => {
        this.recipient.set(user);
        this.showAddUserPopup = false;
        this.showConfirmUserPopup = true;
      });
    } else if (recipientId) {
      this.recipientUsers().filter((recipientUser) => {
        if (recipientUser.id === recipientId) {
          this.recipient.set(recipientUser);
          return true;
        }
        return false;
      });
      this.showAddUserPopup = false;
      this.showConfirmUserPopup = true;
    }
  }

  onConfirmAddStroykaUser() {
    const userToAdd: TServerStroykaUsers = {
      user_id: this.recipient()?.id || 0,
      server_stroyka_id: this.selectedStroyka()[0].server_stroyka_id,
      server_stroyka_role_id:
        this.addStroykaUserForm.get('role_id')?.value || 0,
    };
    this.serverStroykaUserService
      .insertUser(userToAdd)
      .subscribe((newUser: TServerStroykaUsers) => {
        this.showConfirmUserPopup = false;
      });
  }
}
