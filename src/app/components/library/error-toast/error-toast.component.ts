import { Component, Input, OnDestroy } from '@angular/core';
import { ErrorService } from '../../../services/error.service';
import { CommonModule } from '@angular/common';
import { DxToastModule } from 'devextreme-angular';

@Component({
  selector: 'app-error-toast',
  imports: [CommonModule, DxToastModule],
  templateUrl: './error-toast.component.html',
  styleUrl: './error-toast.component.scss',
})
export class ErrorToastComponent implements OnDestroy {
  @Input() toast: boolean = false;
  constructor(public errorService: ErrorService) {}

  ngOnDestroy(): void {
    this.errorService.clearError();
  }
}
