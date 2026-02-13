import { Component, HostListener, OnInit } from '@angular/core';
import { ExeService } from '../../services/exe.service';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/interfaces/can-component-deactivate';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxButtonModule } from 'devextreme-angular';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-exe',
  imports: [DxLoadIndicatorModule, DxButtonModule, SharedModule],
  templateUrl: './exe.component.html',
  styleUrls: ['./exe.component.scss'],
})
export class ExeComponent implements OnInit, CanComponentDeactivate {
  isLoading = false;
  statusMessage = '';
  cancel$ = new Subject<void>(); // 👈 use Subject instead of AbortController

  constructor(
    private exeService: ExeService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.startDownload();
  }

  startDownload() {
    const data = {
      user_client_id: this.authService.getUserClientIdFromStorage(),
    };

    this.isLoading = true;
    this.statusMessage = 'EXE.DOWNLOADING';

    this.exeService.getExeData(data, this.cancel$).subscribe({
      next: (blob) => {
        this.isLoading = false;
        this.statusMessage = 'EXE.DOWNLOAD_COMPLETED';

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'eStima.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.isLoading = false;
        if (err.name === 'CanceledError') {
          this.statusMessage = 'EXE.DOWNLOAD_CANCELED';
        } else {
          this.statusMessage = 'EXE.DOWNLOAD_FAILED';
        }
        console.error(err);
      },
    });
  }

  cancelDownload() {
    this.cancel$.next(); // 👈 this cancels the request
    this.cancel$.complete();
    this.isLoading = false;
    this.statusMessage = 'EXE.DOWNLOAD_CANCELED';
  }

  // For Angular route navigation (used by CanDeactivate)
  canDeactivate(): boolean {
    if (this.isLoading) {
      const leave = confirm(
        'Your download is still in progress. Do you really want to leave?'
      );
      if (leave) {
        this.cancelDownload();
        return true;
      }
      return false;
    }
    return true;
  }
}
