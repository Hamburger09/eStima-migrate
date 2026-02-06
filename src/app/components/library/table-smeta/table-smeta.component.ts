import {
  Component,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { SmetaStateService } from './table-smeta.service';

import { DxTreeListModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-table-smeta',
  templateUrl: './table-smeta.component.html',
  styleUrls: ['./table-smeta.component.scss'],
  imports: [DxTreeListModule, SharedModule],
  encapsulation: ViewEncapsulation.None,
})
export class TableSmetaComponent implements OnChanges {
  @Input() data: any[] = [];
  @Input() readonly: boolean = false;
  @Input() constructionId!: number;
  @Input() svod_resources: boolean = false; // Flag to show/hide svod recourses
  @Output() changedResources = new EventEmitter<any[]>();

  treeData: any[] = [];
  expandedRows: { [key: string]: boolean } = {};
  expandedRazdels = new Set<string>();
  expandedWorks = new Set<string>();
  expandedWorksCache = new Map<string, Set<string>>(); // Map of constructionId -> Set of expanded work codes
  changedSvodResources: any[] = [];

  constructor(private smetaState: SmetaStateService) {
    // Initialize the expandedWorksCache from the service
    this.expandedWorksCache = smetaState.expandedWorksCache;
  }

  flattenData(data: any[]) {
    const rows: any[] = [];

    for (const razdel of data) {
      rows.push({
        id: razdel.id,
        parentId: null,
        type: 'razdel',
        name: razdel.name,
        num: razdel.num,
      });

      for (const work of razdel.works) {
        rows.push({
          id: work.id,
          parentId: razdel.id,
          type: 'work',
          name: work.name,
          num: work.num,
          kode: work.kode,
          gauge_name: work.gauge_name,
          kol: work.kol,
          price: work.price,
          summa: work.summa,
        });

        for (const res of work.resurses) {
          rows.push({
            id: res.id,
            parentId: work.id,
            type: 'resource',
            name: res.name,
            kode: res.kode,
            gauge_name: res.gauge_name,
            kol: res.norma,
            rashod: res.rashod,
            price: res.price,
            summa: res.summa,
          });
        }
      }
    }

    return rows;
  }

  buildSvodTree(data: any[]) {
    const rows: any[] = [];

    for (const [index, razdel] of data.entries()) {
      const razdelId = `razdel-${index}`;

      // Parent row
      rows.push({
        id: razdelId,
        parentId: 0,
        type: 'razdel',
        name: razdel.name,
      });

      // Child resource rows
      for (const resource of razdel.svod_resurs) {
        rows.push({
          id: `res-${resource.id || resource.id_stroyka}`,
          parentId: razdelId,
          type: 'resource',
          kode: resource.kode,
          name: resource.name,
          gauge_name: resource.gauge_name,
          kol: resource.kol,
          price: resource.price,
          summa: resource.summa,
        });
      }
    }

    return rows;
  }
  onEditingStart(e: any) {
    if (e.data.type !== 'work' || e.column.dataField !== 'kol') {
      e.cancel = true; // Prevent editing for razdel rows
    }
  }

  onRowPrepared(e: any) {
    if (e.rowType === 'data') {
      e.rowElement.classList.add('row-' + e.data.type);
    }
  }

  // isWorkExpanded(code: string): boolean {
  //   return this.expandedWorks.has(code);
  // }
  // // Method to handle changes
  // onKolSmetaChange(work: any, event: Event) {
  //   const cell = event.target as HTMLElement;

  //   // Prevent new line on Enter key
  //   event.preventDefault();

  //   // Trim and validate
  //   let value = cell.textContent?.trim() || '';
  //   if (value !== '') {
  //     work.kol_smeta = value;
  //   } else {
  //     cell.textContent = work.kol_smeta; // Reset to previous value if invalid
  //   }

  //   // Unfocus the <td>
  //   cell.blur();
  // }

  // // Method to handle input validation
  // onKolSmetaInput(work: any, event: Event) {
  //   const editableCell = event.target as HTMLElement;

  //   // Get the current value and store the cursor position
  //   const selection = window.getSelection();
  //   const cursorPos = selection?.getRangeAt(0).startOffset || 0;

  //   // Get the current value, remove non-numeric characters
  //   let value = editableCell.textContent?.trim() || '';
  //   value = value.replace(/[^0-9,]/g, ''); // Only allow numbers and dots

  //   // Set the value back into the cell and restore the cursor position
  //   editableCell.textContent = value;

  //   // Restore the cursor position after the content is updated
  //   if (selection) {
  //     const range = document.createRange();
  //     const newPos = Math.min(cursorPos, value.length); // Ensure the cursor doesn't go out of bounds
  //     range.setStart(editableCell.firstChild || editableCell, newPos);
  //     range.setEnd(editableCell.firstChild || editableCell, newPos);
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //   }
  // }

  // // Method to handle input of svod resources of price
  // onSvodResourcesPriceInput(res: any, event: Event) {
  //   const editableCell = event.target as HTMLElement;
  //   const selection = window.getSelection();
  //   const cursorPos = selection?.getRangeAt(0).startOffset || 0;

  //   // Get the current value
  //   let value = editableCell.textContent?.trim() || '';

  //   // Step 1: Remove invalid characters (allow only numbers and one decimal point)
  //   value = value.replace(/[^0-9.]/g, ''); // Allow only numbers and dots

  //   // Step 2: Prevent multiple decimal points or leading decimal
  //   const decimalCount = (value.match(/\./g) || []).length;
  //   if (decimalCount > 1 || (value.startsWith('.') && value.length > 1)) {
  //     value = value.replace(/\..*/g, ''); // Remove everything after the first invalid decimal
  //   } else if (value.startsWith('.')) {
  //     value = '0' + value; // Convert .34 to 0.34
  //   }

  //   // Step 3: Limit to 2 decimal places if decimal exists
  //   const [integerPart, decimalPart] = value.split('.');
  //   if (decimalPart) {
  //     value = `${integerPart}.${decimalPart.slice(0, 2)}`; // Limit to 2 decimals
  //   }

  //   // Step 4: Set the value back and restore cursor position
  //   editableCell.textContent = value;

  //   if (selection) {
  //     const range = document.createRange();
  //     const newPos = Math.min(cursorPos, value.length); // Ensure cursor stays in bounds
  //     range.setStart(editableCell.firstChild || editableCell, newPos);
  //     range.setEnd(editableCell.firstChild || editableCell, newPos);
  //     selection.removeAllRanges();
  //     selection.addRange(range);
  //   }
  // }

  // onSvodResourcesPriceChange(res: any, event: Event) {
  //   const cell = event.target as HTMLElement;
  //   event.preventDefault();

  //   let value = cell.textContent?.trim() || '';

  //   if (value === '') {
  //     cell.textContent = '0.00'; // Fallback to default value
  //   } else {
  //     // Step 1: Clean and validate
  //     value = value.replace(/[^0-9.]/g, '');
  //     const [integerPart, decimalPart] = value.split('.');
  //     if (decimalPart) {
  //       value = `${integerPart}.${decimalPart.slice(0, 2)}`;
  //     } else {
  //       value = integerPart;
  //     }

  //     // Step 2: Convert to number for formatting
  //     let numValue = parseFloat(value) || 0;
  //     const formattedValue = numValue.toLocaleString('en-US', {
  //       minimumFractionDigits: 2,
  //       maximumFractionDigits: 2,
  //     });

  //     // ✅ Step 3: Store the old price if not already stored
  //     if (!res.old_price) {
  //       res.old_price = res.price;
  //     }

  //     // ✅ Step 4: Compare and update
  //     if (res.price !== formattedValue) {
  //       res.price = formattedValue;
  //       res._edited = true;

  //       this.changedSvodResources.push(res);

  //       // ✅ Step 5: Emit with both old and new price
  //       this.changedResources.emit(this.changedSvodResources);
  //     }

  //     // Step 6: Update UI
  //     cell.textContent = formattedValue;
  //     cell.blur();
  //   }
  // }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      console.log('Data changed:', this.data);
      this.treeData = this.svod_resources
        ? this.buildSvodTree(this.data)
        : this.flattenData(this.data);
      // Reset expandedRazdels when data changes
    }
  }
}
