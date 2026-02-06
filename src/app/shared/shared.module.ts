import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// DevExtreme modules you use
import {
  DxDataGridModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxCheckBoxModule,
} from 'devextreme-angular';
import { ErrorToastComponent } from 'src/app/components/library/error-toast/error-toast.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    ErrorToastComponent,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    TranslateModule,
    DxDataGridModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxCheckBoxModule,
    ErrorToastComponent,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
