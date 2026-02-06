import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewContainerRef,
} from '@angular/core';
import { DxPopupModule, DxButtonModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-shared-modal',
  standalone: true,
  imports: [DxPopupModule, DxButtonModule, SharedModule],
  templateUrl: './shared-modal.component.html',
  styleUrls: ['./shared-modal.component.scss'],
})
export class SharedModalComponent {
  // ===== Core inputs =====
  @Input() title = '';
  @Input() width: number | string = 720;
  @Input() height: number | string = 'auto';
  @Input() maxWidth: number | string = 900;
  @Input() maxHeight: number | string = 650;

  /** CoreUI-like: backdrop="static" prevents close on outside click */
  @Input() backdrop: 'static' | 'dismiss' = 'static';

  /** optional: mimic your hostView clearing */
  @Input() hostView?: ViewContainerRef;
  @Input() clearOnClose = false;

  /** optional styling */
  @Input() shadingColor = 'rgba(0,0,0,0.45)';
  @Input() position: any = { at: 'center', my: 'center' };

  // ===== Footer options =====
  @Input() showFooter = false;
  @Input() useDefaultFooter = false;
  @Input() cancelText = 'Cancel';
  @Input() okText = 'OK';

  // ===== Outputs =====
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() closed = new EventEmitter<void>();
  @Output() okClick = new EventEmitter<void>();
  private _visible = false;
  constructor(private cdr: ChangeDetectorRef) {}

  @Input()
  set visible(val: boolean) {
    this._visible = val;
    this.visibleChange.emit(val);
  }
  get visible() {
    return this._visible;
  }

  // Imperative API (like CoreUI launchModal/closeModal)
  open() {
    this.visible = true;
    this.cdr.markForCheck();
  }

  close() {
    this.visible = false;
    this.cdr.markForCheck();
  }

  // Popup lifecycle
  onHiding() {
    // runs when it starts hiding
  }

  onHidden() {
    // runs when fully hidden (closest to your animation done)
    this.closed.emit();

    if (this.clearOnClose && this.hostView) {
      this.hostView.clear();
    }
  }
}
