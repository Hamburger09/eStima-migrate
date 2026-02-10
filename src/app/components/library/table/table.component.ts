import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { AuthService } from 'src/app/services/auth.service';

import { DxDataGridModule } from 'devextreme-angular';
import { TableColumn } from '../../../interfaces/column.interface';
import { DxButtonModule } from 'devextreme-angular';
import { ErrorService } from '../../../services/error.service';
import { ErrorToastComponent } from 'src/app/components/library/error-toast/error-toast.component';
import { SharedModule } from '../../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';

import {
  DxDropDownButtonModule,
  DxDropDownButtonComponent,
  DxDropDownButtonTypes,
} from 'devextreme-angular/ui/drop-down-button';
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  imports: [
    DxDataGridModule,
    DxButtonModule,
    ErrorToastComponent,
    SharedModule,
    DxDropDownButtonModule,
    DxDropDownButtonComponent,
    TranslateModule,
  ],
})
export class TableComponent {
  @Input() title: string = 'Data';
  @Input() columns: TableColumn[] = [];
  // Column names and keys
  @Input() data: any[] = []; // Data to display
  @Input() currentPage: number = 1; // Current page number
  @Input() itemsPerPage: number = 10; // Number of items per page
  @Input() actions: boolean = true; // Show Edit/Delete buttons
  @Input() showEditDelete: boolean = true; // Show Edit/Delete buttons
  @Input() showDetails: boolean = false; // Show more details button
  @Input() showDetailsText: string = ''; // Label for details button
  @Input() showDetailsIcon: string = ''; // Show icon for details button
  @Input() showEditDetails: boolean = false; // Show edit details button
  @Input() editDetailsText: string = ''; // Label for edit button
  @Input() editCallback!: (item: any) => void; // Function to call on edit
  @Input() deleteCallback!: (item: any) => void; // Function to call on delete
  @Input() selectable: boolean = false; // Enable row selection
  @Input() showSelectAll: boolean = false; // Show select all checkbox
  @Input() selectedItems: any[] = []; // Array to hold selected items
  @Input() selectionChange!: (item: any) => void; // Emit selected items
  @Input() confirmDeleteMessage: string = ''; // Confirmation message
  @Input() rowAlternationEnabled: boolean = true;
  @Input() showColumnLines: boolean = true;
  @Input() exportEnabled: boolean = true;
  @Input() filterList: any[] = [];
  @Input() searchEnabled: boolean = true;
  @Input() searchPlaceholder: string = 'Search';
  @Input() addButtonText: string = 'Add';

  @Output() filterChanged = new EventEmitter<any>();
  @Output() addClick = new EventEmitter<void>();
  @Output() showDetailsCallback = new EventEmitter<any>(); // Function to call on details
  @Output() editDetailsCallback = new EventEmitter<any>(); // Function to call on edit details
  @Output() exporting = new EventEmitter<any>();
  @Output() editorPreparing = new EventEmitter<any>();
  @Output() rowInserted = new EventEmitter<any>();
  @Output() rowRemoved = new EventEmitter<any>();
  @Output() rowUpdated = new EventEmitter<any>();
  @Output() refresh = new EventEmitter<void>();

  @ViewChild('grid', { static: false }) grid!: DxDataGridComponent;

  myId: number | null = null; // User ID from AuthService

  isAllSelected: boolean = false;

  editingRow: any = {};
  popupMode: 'add' | 'edit' = 'edit';
  constructor(
    private authService: AuthService,
    private errorService: ErrorService
  ) {
    this.myId = this.authService.getUserIdFromStorage();
  }

  get popupTitle() {
    return this.popupMode === 'add' ? 'COMMON.ADD' : 'COMMON.EDIT';
  }
  onInitNewRow(e: any) {
    this.popupMode = 'add';
  }

  onFilterChanged(e: any): void {
    this.filterChanged.emit(e);
  }

  onEditingStart(e: any) {
    this.editingRow = { ...e.data };
    this.popupMode = 'edit';
  }

  isSelected(row: any): boolean {
    return this.selectedItems.some((item) => item.id === row.id); // or compare by reference
  }
  // table.component.ts
  editDetailsHandler = (e: any) => {
    const row = e.row?.data;
    if (!row) return;
    console.log('DX CLICK FIRED', row);
    this.editDetailsCallback?.emit(row); // optional safe call
  };

  detailsHandler = (e: any) => {
    const row = e.row?.data;
    if (!row) return;
    console.log('DX CLICK FIRED', row);
    this.showDetailsCallback?.emit(row); // optional safe call
  };
  // Handles when editor popup appears
  onEditorPreparing(e: any) {
    this.editorPreparing.emit(e);
    if (e.dataField === 'id_status') {
      e.editorName = 'dxSwitch';
      e.editorOptions = {
        value: e.value === 1,
        onValueChanged: (ev: any) => {
          e.setValue(ev.value ? 1 : 0);
        },
      };
    }

    // === CASE 1: Hide GUID input on Insert ===
    if (
      (e.dataField === 'guid' && e.row?.isNewRow) ||
      (e.dataField === 'user_client_id' && e.row?.isNewRow)
    ) {
      e.editorOptions = { visible: false };
      e.cancel = true; // Completely cancel editor creation
    }

    // === CASE 2: Make GUID read-only on Update/Edit ===
    if (
      (e.dataField === 'guid' && !e.row?.isNewRow) ||
      (e.dataField === 'user_client_id' && !e.row?.isNewRow)
    ) {
      e.editorOptions.readOnly = true;
    }
  }

  onRowInserting(e: any) {
    e.cancel = true; // ⛔ STOP DevExtreme default behavior

    this.rowInserted.emit({
      data: e.data,
      done: () => {
        e.component.cancelEditData(); // 🔥 closes popup
        e.component.refresh(); // optional
      },
      fail: (message: string) => {
        this.errorService.showError(message); // 🔥 toast
      },
    });
  }

  onExporting(e: any): void {
    this.exporting.emit(e);
  }

  onAddClick(): void {
    // open DevExtreme popup editor
    this.grid?.instance?.addRow();
    // optional: also emit
    this.addClick.emit();
  }

  onRowUpdating(e: any) {
    e.cancel = true;

    const updatedData = {
      ...e.oldData,
      ...e.newData,
    };

    this.rowUpdated.emit({
      data: updatedData,
      done: () => {
        e.component.cancelEditData(); // 🔥 closes popup
        e.component.refresh(); // optional
      },
      fail: (message: string) => {
        this.errorService.showError(message);
      },
    });
  }

  onRowRemoving(e: any) {
    e.cancel = true;

    this.rowRemoved.emit({
      data: e.data,
      done: () => {
        e.component.cancelEditData(); // 🔥 closes popup
        e.component.refresh(); // optional
      },
      fail: (message: string) => {
        this.errorService.showError(message);
      },
    });
  }

  toggleSelection(row: any): void {
    const index = this.selectedItems.findIndex((item) => item.id === row.id);
    if (index > -1) {
      this.selectedItems.splice(index, 1); // remove
    } else {
      this.selectedItems.push(row); // add
    }

    this.isAllSelected = this.selectedItems.length === this.data.length;

    if (this.selectionChange) {
      this.selectionChange(this.selectedItems);
    }
  }

  toggleSelectAll(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    if (checked) {
      this.selectedItems = [...this.data]; // select all
    } else {
      this.selectedItems = []; // deselect all
    }

    this.isAllSelected = checked;

    if (this.selectionChange) {
      this.selectionChange(this.selectedItems);
    }
  }

  onCellPrepared(e: any) {
    if (e.rowType !== 'data') return;

    if (e.column.dataField === 'id_status') {
      e.cellElement.classList.add(
        e.value == 1 ? 'text-success' : 'text-danger'
      );
    }
  }
  onRefresh = (): void => {
    this.refresh.emit();
  };

  onRowPrepared(e: any) {}
  onSelectionChanged(e: any) {
    const selectedRows = e.selectedRowsData;

    // Update your selectedItems
    this.selectedItems = selectedRows;

    this.isAllSelected =
      this.selectedItems.length === this.data.length && this.data.length > 0;

    if (this.selectionChange) {
      this.selectionChange(this.selectedItems);
    }
  }
  get selectedRowKeys() {
    return this.selectedItems.map((item) => item.id);
  }
}
