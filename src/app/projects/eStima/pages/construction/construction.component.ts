import {
  Component,
  ChangeDetectionStrategy,
  signal,
  OnInit,
  Input,
  ViewChild,
  effect,
} from '@angular/core';

import { TableSmetaComponent } from 'src/app/components/library/table-smeta/table-smeta.component';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { TransferService } from 'src/app/services/transfer.service';
import {
  ConstructionData,
  ConstructionObject,
  ConstructionSmeta,
  SvodResursGroup,
  TNotification,
  TTransfer,
} from 'src/app/interfaces/TypesTBase.interface';

import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

// import { RibbonComponent } from '../../shared/components/ribbon/ribbon.component';
// import { SharedModalComponent } from '../../shared/components/shared-modal/shared-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/TypesABase.interface';
import { LoadingService } from 'src/app/services/loading.service';
import { SocketService } from 'src/app/services/socket.service';
import { TRANSFER_STATUS } from 'src/app/shared/constants';
import { NotificationService } from 'src/app/services/notification.service';
import { pairwise, startWith, take } from 'rxjs';

import { createLookupGetter } from 'src/app/utils/value-getters';

import {
  DxTreeListModule,
  DxTabPanelModule,
  DxSortableModule,
} from 'devextreme-angular';

import { SharedModalComponent } from 'src/app/components/library/shared-modal/shared-modal.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  RibbonComponent,
  RibbonTab,
} from 'src/app/components/library/ribbon/ribbon.component';

export interface TabItem {
  id: string;
  title: string;
  type: 'fixed' | 'smeta';
  closable?: boolean;
  data?: any;
}

@Component({
  selector: 'app-construction',
  imports: [
    TableSmetaComponent,
    TableComponent,
    DxTreeListModule,
    DxSortableModule,
    DxTabPanelModule,
    SharedModalComponent,
    SharedModule,
    RibbonComponent,
  ],
  standalone: true,
  templateUrl: './construction.component.html',
  styleUrl: './construction.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConstructionComponent implements OnInit {
  @Input() filterMode: 'incoming' | 'outgoing' | 'all' = 'all'; // Default filter mode

  // ! @ViewChild(SharedModalComponent) sendTransferModal!: SharedModalComponent;
  // ! @ViewChild(SharedModalComponent)

  // This component handles the construction management, including viewing and editing constructions.
  // It uses the ConstructionService to interact with the backend API and manage the constructions data.

  // It also includes a ribbon component for additional actions and a shared modal for sending transfers.

  // The component supports different filter modes for incoming, outgoing, or all constructions.
  sendTransferForm: FormGroup; // Form for sending transfers
  transferColumns: {
    label: string;
    key: string;
    valueGetter?: (row: any) => string;
  }[] = []; // Columns for the transfer table
  private readonly FIXED_TABS: TabItem[] = [
    { id: 'objects', title: 'CONSTRUCTION.OBJECTS_SMETAS', type: 'fixed' },
    { id: 'svod', title: 'CONSTRUCTION.SVOD_RESOURCES', type: 'fixed' },
  ];
  tabs = signal<TabItem[]>([...this.FIXED_TABS]); // Signal to hold the tabs, initialized with fixed tabs
  selectedIndex = signal(0);
  constructions = signal<TTransfer[]>([]); // Signal to hold constructions data
  readonly = signal<boolean>(false); // Signal to control read-only mode
  recipientUsers = signal<User[]>([]); // Signal to hold recipient users for the send transfer modal
  searchedRecipient = signal<User | null>(null); // Signal to hold the searched recipient user
  // Cache for construction data
  tabCache = new Map<number, { tabs: TabItem[]; selectedIndex: number }>();

  selectedConstructions = new Map<number, ConstructionData>();
  selectedTransfers = signal<TTransfer[]>([]); // Signal to hold selected transfers
  currentConstructionId: number | null = null;
  changedResourcesList = signal<any[]>([]); // List of changed svod resources

  objectsTreeData = signal<any[]>([]); // Tree data for objects and smetas

  // Tree data source
  objects = signal<ConstructionObject[]>([]);
  svod_resources = signal<SvodResursGroup[]>([]); // Signal to hold the tree nodes

  isSendTransferModalOpen = false;
  isConfirmTransferModalOpen = false;

  // Ribbon functions and properties
  ribbonTabs: RibbonTab[] = [
    {
      key: 'home',
      label: 'COMMON.HOME',
      buttons: [
        {
          label: 'COMMON.SEND',
          icon: 'cilSend',
          type: 'primary',
          action: 'send',
        },
        // { label: 'Export', type: 'outline-info', action: 'export' },
      ],
    },
    // {
    //   key: 'tools',
    //   label: 'Tools',
    //   buttons: [
    //     { label: 'Tool A', type: 'warning', action: 'toolA' },
    //     { label: 'Tool B', type: 'warning', action: 'toolB' },
    //     { label: 'Tool C', type: 'warning', action: 'toolC' },
    //   ],
    // },
    // {
    //   key: 'functions',
    //   label: 'Functions',
    //   buttons: [
    //     { label: 'Function X', type: 'success', action: 'functionX' },
    //     { label: 'Function Y', type: 'success', action: 'functionY' },
    //   ],
    // },
  ];

  activeTab = 'home';

  // ! confirmTransferModal!: SharedModalComponent;

  // Signal to hold error message for display
  errorMessage = signal<string | null>(null);
  recipient = signal<User | null>(null); // Signal to hold the selected recipient user

  constructor(
    private transferService: TransferService,
    private authService: AuthService,
    private fb: FormBuilder,
    private userService: UserService,
    public loadingService: LoadingService,
    private notificationService: NotificationService
  ) {
    this.sendTransferForm = this.fb.group({
      user_id_recipient: [
        {
          value: '',
          disabled: false, // Initially enabled, will be disabled when a recipient is selected
        },
      ], // Form control for recipient user ID
      user_client_id: [
        {
          value: '',
          disabled: false,
        },
      ], // Optional client ID for the user
      user_id_sender: [this.authService.getUserIdFromStorage()],
    });

    effect(() => {
      // Define base "Note" column
      const noteColumn = { label: 'TRANSFERS.NOTE', key: 'note' };

      // Define "Sender" column
      const senderColumn = {
        label: 'TRANSFERS.SENDER',
        key: 'user_id_sender',
        valueGetter: createLookupGetter(
          () => this.recipientUsers(),
          'id',
          'user_id_sender',
          'user_login'
        ),
      };

      // Define "Recipient" column
      const recipientColumn = {
        label: 'TRANSFERS.RECIPIENT',
        key: 'user_id_recipient',
        valueGetter: createLookupGetter(
          () => this.recipientUsers(),
          'id',
          'user_id_recipient',
          'user_login'
        ),
      };

      // Set columns based on filterMode
      switch (this.filterMode) {
        case 'incoming':
          this.transferColumns = [noteColumn, senderColumn];
          break;
        case 'outgoing':
          this.transferColumns = [noteColumn, recipientColumn];
          break;
        case 'all':
          this.transferColumns = [noteColumn, senderColumn, recipientColumn];
          break;
        default:
          this.transferColumns = [noteColumn, senderColumn, recipientColumn]; // Fallback
      }
    });
  }

  openSendTransferModal() {
    this.isSendTransferModalOpen = true;
  }

  closeSendTransferModal() {
    this.isSendTransferModalOpen = false;
  }

  openConfirmTransferModal() {
    this.isConfirmTransferModalOpen = true;
  }

  closeConfirmTransferModal() {
    this.isConfirmTransferModalOpen = false;
  }

  selectedConstruction(): ConstructionData {
    return this.selectedConstructions.get(this.currentConstructionId!)!;
  }

  // Signals to hold the state of the component

  onRowDblClick(e: any) {
    if (Array.isArray(e.data.type) || !e.data.razdels) {
      return; // object
    }
    console.log('Double clicked smeta:', e.data);
    this.openSmeta(e.data);
  }

  // Function to add a new tab
  openSmeta(node: any) {
    const currentTabs = this.tabs();
    const existingTabIndex = currentTabs.findIndex((tab) => tab.id === node.id);

    if (existingTabIndex !== -1) {
      this.selectedIndex.set(existingTabIndex);
      return;
    }

    const newTab: TabItem = {
      id: node.id,
      title: node.name,
      type: 'smeta',
      closable: true,
      data: {
        razdels: node.razdels || [],
      }, // Store the smeta data in the tab
    };

    this.tabs.set([...currentTabs, newTab]);
    this.selectedIndex.set(this.tabs().length - 1); // Select newly added tab
  }
  onTabReorder(e: any) {
    const fixedCount = 2;

    const from = e.fromIndex + fixedCount;
    const to = e.toIndex + fixedCount;

    const updated = [...this.tabs()];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);

    this.tabs.set(updated);
  }
  onRecipientSelect() {
    // Clear user_client_id when a dropdown selection is made
    if (this.sendTransferForm.get('user_id_recipient')?.value) {
      this.sendTransferForm.patchValue({ user_client_id: '' });
      this.searchedRecipient.set(null);
    }
  }

  onChangedSvodResources(changed: any[]) {
    this.changedResourcesList.set(changed);
    console.log('Changed svod resources from child:', changed);
  }
  searchUserByClientId() {
    const userClientId = this.sendTransferForm.get('user_client_id')?.value;
    if (!userClientId) {
      this.errorMessage.set('Please enter a User Client ID.');
      setTimeout(() => this.errorMessage.set(null), 3000);
      return;
    }
  }
  // Function to remove a tab by index
  // This function can be called from the template when a tab is closed
  removeTab(tab: TabItem) {
    const index = this.tabs().indexOf(tab);

    this.tabs.set(this.tabs().filter((_, i) => i !== index));
    if (index >= this.tabs().length && index > 0)
      this.selectedIndex.set(index - 1);
  }

  // Function to get all the constructions
  getAllTransfers() {
    this.transferService.getTransfers().subscribe((transfers: TTransfer[]) => {
      const userId = this.authService.getUserIdFromStorage();
      console.log('Transfers', transfers);
      let filteredTransfers: TTransfer[];
      switch (this.filterMode) {
        case 'incoming':
          filteredTransfers = transfers.filter(
            (t) => t.user_id_recipient === userId
          );
          break;
        case 'outgoing':
          filteredTransfers = transfers.filter(
            (t) => t.user_id_sender === userId
          );
          break;
        case 'all':
        default:
          filteredTransfers = transfers;
          break;
      }

      this.constructions.set(filteredTransfers);
    });
  }

  getRecipientUsers() {
    // Fetch recipient users from the user service
    const userId = this.authService.getUserIdFromStorage();
    this.userService
      .getAllUsersByTransfers(Number(userId))
      .subscribe((users: User[]) => {
        console.log('Recipient users:', users);
        this.recipientUsers.set(users);
      });
  }

  ngOnInit(): void {
    // Fetch recipient users and open send modal
    this.getRecipientUsers(); // Fetch recipient users on component initialization
    // Initialize the component and fetch all transfers
    this.notificationService
      .getTransferNotifications()
      .pipe(
        startWith([] as TNotification[]), // Start with an empty array
        pairwise() // Compare current and previous emissions
      )
      .subscribe(([previous, current]: [TNotification[], TNotification[]]) => {
        // Get only new notifications
        const newNotifications = current.filter(
          (n) => !previous.some((p) => p.id === n.id)
        );

        if (this.filterMode === 'incoming') {
          // Filter new notifications for incoming transfers only
          this.constructions.update((current) => [
            ...current,
            ...newNotifications.map((n) => n.data as TTransfer),
          ]);
        }
      });
    this.getAllTransfers(); // Fetch all constructions on component initialization
  }

  showTransfer = (transfer: TTransfer): void => {
    this.readonly.set(true); // Set read-only mode
    this.openConstruction(transfer); // Open the selected construction
  };

  editTransfer(transfer: TTransfer): void {
    console.log('Editing transfer:', transfer);
    this.readonly.set(false); // Set editable mode
    this.openConstruction(transfer); // Open the selected construction
  }

  buildFlatObjectsTree(objects: ConstructionObject[]) {
    const result: any[] = [];

    objects.forEach((obj: ConstructionObject) => {
      // OBJECT (parent)
      result.push({
        id: obj.id,
        name: `${obj.num || ''} ${obj.name}`,
        hasItems: true, // 👈 THIS IS THE KEY
      });

      // SMETAS (children)
      (obj.smetas ?? []).forEach((smeta: ConstructionSmeta) => {
        result.push({
          id: `smeta-${smeta.id}`,
          parent_id: obj.id, // 👈 correct parent
          name: smeta.name,
          razdels: smeta.razdels,
        });
      });
    });

    this.objectsTreeData.set(result);
  }

  openConstruction = (construction: TTransfer): void => {
    // Check if the construction is already loaded

    const id = construction.id;
    if (
      this.authService.getUserIdFromStorage() === construction.user_id_recipient
    ) {
      construction.transfer_status = TRANSFER_STATUS.RECEIVED;

      this.transferService
        .updateTransfer(construction)
        .subscribe((updatedTransfer: TTransfer) => {
          this.constructions.set(
            this.constructions().map((t) =>
              t.id === updatedTransfer.id ? updatedTransfer : t
            )
          );
        });

      // Update the notification status
      // Find and mark the corresponding transfer notification as read
      // Find and mark the corresponding transfer notification as read
      this.notificationService
        .getTransferNotifications()
        .pipe(take(1))
        .subscribe((notifications: TNotification[]) => {
          const notification = notifications.find((n) => n.data.id === id!);
          if (notification) {
            notification.is_read = true;
            this.notificationService
              .markNotificationAsRead(notification)
              .subscribe();
          }
        });
    }

    // Save the current tabs and selectedIndex into the cache
    if (this.currentConstructionId !== null) {
      this.tabCache.set(this.currentConstructionId, {
        tabs: this.tabs().filter((t) => t.type === 'smeta'),
        selectedIndex: this.selectedIndex(),
      });
    }

    // If already loaded, just switch
    if (this.selectedConstructions.has(id!)) {
      const existing = this.selectedConstructions.get(id!);
      this.objects.set(existing?.obekts ?? []);
      this.buildFlatObjectsTree(existing?.obekts ?? []);

      // Restore tabs and selected index from cache
      if (this.tabCache.has(id!)) {
        const cached = this.tabCache.get(id!)!;
        this.tabs.set([...this.FIXED_TABS, ...cached.tabs]);
        this.selectedIndex.set(cached.selectedIndex);
      } else {
        this.clearTabs();
      }
      this.currentConstructionId = id!;
      return;
    }

    // Set placeholder to preserve UI state immediately
    this.selectedConstructions.set(id!, {
      id: construction.id!,
      name: construction.note,
      selectedIndex: 0,
      obekts: [],
      razdel_svod_resurs_list: [],
    });

    // Then fetch and update data
    this.transferService
      .getTransferById(id!)
      .subscribe((transfer: TTransfer) => {
        const existing = this.selectedConstructions.get(id!);
        const content = transfer.content; // Now typed as ConstructionData
        // Validate content structure (optional, for runtime safety)
        if (!content || typeof content !== 'object' || !('obekts' in content)) {
          console.error('Invalid construction data:', content);
          return;
        }
        const updatedData: ConstructionData = {
          ...existing,
          ...content,
          selectedIndex: content.selectedIndex,
        };
        this.buildFlatObjectsTree(content.obekts);
        this.selectedConstructions.set(id!, updatedData);
        this.objects.set(content.obekts ?? []);
        this.svod_resources.set(content.razdel_svod_resurs_list ?? []); // Set svod_resources from content
      });

    // Clear tabs if no cache exists for this construction
    if (this.tabCache.has(id!)) {
      const cached = this.tabCache.get(id!);
      this.tabs.set(cached?.tabs ?? []); // Restore tabs
      this.selectedIndex.set(cached?.selectedIndex ?? 0); // Restore selected index
    } else {
      this.clearTabs(); // Clear tabs if no cache exists
    }

    this.currentConstructionId = id!;
  };

  onBackToList() {
    // Save the current tabs and selectedIndex into the cache
    if (this.currentConstructionId !== null) {
      this.tabCache.set(this.currentConstructionId, {
        tabs: this.tabs().filter((t) => t.type === 'smeta'), // 🔥 ONLY
        selectedIndex: this.selectedIndex(),
      });
    }
    this.currentConstructionId = null;
  }
  onTransferSelect = (transfer: TTransfer[]) => {
    this.selectedTransfers.set(transfer); // Set selected transfers
  };

  // Function to handle tab clearing
  clearTabs() {
    this.tabs.set([...this.FIXED_TABS]);
    this.selectedIndex.set(0);
  }

  // Tree node template
  childrenAccessor = (node: ConstructionObject) => node.smetas;

  hasChild = (_: number, node: ConstructionObject) =>
    !!node.smetas && node.smetas.length > 0; // Check if the node has children

  // Get recipient name for display in confirmation modal

  // Modified handleRibbonAction to validate selected transfers
  handleRibbonAction(action: string) {
    switch (action) {
      case 'send':
        this.validateAndOpenSendModal();
        break;
    }
  }

  // Validate selected transfers and open send modal
  validateAndOpenSendModal() {
    if (this.constructions().length === 0) {
      this.errorMessage.set('No transfers available to send.');
      setTimeout(() => this.errorMessage.set(null), 3000); // Clear error after 3 seconds
      return;
    }
    if (this.selectedTransfers().length === 0) {
      this.errorMessage.set('Please select at least one transfer to send.');
      setTimeout(() => this.errorMessage.set(null), 3000); // Clear error after 3 seconds
      return;
    }

    // If there are selected transfers, open the send transfer modal
    if (this.recipientUsers().length > 0) {
      this.sendTransferForm.reset({
        user_id_sender: this.authService.getUserIdFromStorage(),
      });
      this.openSendTransferModal();
    }
  }

  // Handle form submission from send transfer modal
  onSendTransferFormSubmit() {
    const clientId = this.sendTransferForm.get('user_client_id')?.value;
    const recipientId = this.sendTransferForm.get('user_id_recipient')?.value;
    if (clientId) {
      // If recipient is selected, fetch user by client ID
      this.userService.getByUserClientId(clientId).subscribe((user: User) => {
        this.recipient.set(user); // Set the recipient signal
        // ! this.sendTransferModal.closeModal('sendTransferModal');
        // ! this.confirmTransferModal.launchModal('confirmTransferModal');
      });
      // If form is valid, close the send modal and open confirmation modal
    } else if (recipientId) {
      // If recipient is selected, proceed to confirmation modal
      this.recipientUsers().filter((recipientUser) => {
        if (recipientUser.id === recipientId) {
          this.recipient.set(recipientUser); // Set the recipient signal
          return true; // Keep this user in the filtered list
        }
        return false; // Exclude other users
      }); // Set the recipient signal
      // ! this.sendTransferModal.closeModal('sendTransferModal');
      // ! this.confirmTransferModal.launchModal('confirmTransferModal');
    }
  }

  // Handle confirmation and send transfers
  confirmSendTransfer() {
    const recipientId = this.sendTransferForm.get('user_id_recipient')?.value;
    this.selectedTransfers().map((transfer: TTransfer) => {
      transfer.user_id_recipient = this.recipient()?.id!; // Set recipient ID for each transfer
      transfer.user_id_sender = this.authService.getUserIdFromStorage()!; // Set sender ID with fallback
      transfer.transfer_status = TRANSFER_STATUS.SENT; // Set transfer status to SENT
      this.transferService
        .createTransfer(transfer)
        .subscribe((transfer: TTransfer) => {
          // ! this.confirmTransferModal.closeModal('confirmTransferModal');
          this.selectedTransfers.set([]); // Clear selections
          this.sendTransferForm.reset({
            user_id_sender: this.authService.getUserIdFromStorage(),
          });
          console.log(this.filterMode);
          if (this.filterMode === 'outgoing') {
            this.constructions.update((transfers) => [...transfers, transfer]); // Update constructions with new transfer
          }
          this.getRecipientUsers(); // Refresh recipient users
        });
    });
  }
}
