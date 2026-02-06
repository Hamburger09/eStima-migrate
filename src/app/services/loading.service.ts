import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private httpLoadingCount = 0;
  private isNavigating = false;
  public isLoading = new BehaviorSubject<boolean>(false);
  public readonly isLoading$ = this.isLoading.asObservable();
  private pendingUpdate: boolean | null = null; // Track pending state changes

  constructor(private ngZone: NgZone) {}

  startHttpLoading() {
    this.ngZone.run(() => {
      this.httpLoadingCount++;
      this.scheduleUpdate();
    });
  }

  stopHttpLoading() {
    this.ngZone.run(() => {
      this.httpLoadingCount = Math.max(0, this.httpLoadingCount - 1);
      this.scheduleUpdate();
    });
  }

  startNavigation() {
    this.ngZone.run(() => {
      this.isNavigating = true;
      this.scheduleUpdate();
    });
  }

  stopNavigation() {
    this.ngZone.run(() => {
      this.isNavigating = false;
      this.scheduleUpdate();
    });
  }

  private scheduleUpdate() {
    const isLoading = this.httpLoadingCount > 0 || this.isNavigating;
    if (this.pendingUpdate !== isLoading) {
      this.pendingUpdate = isLoading;
      // Use setTimeout to defer update to next microtask
      setTimeout(() => {
        this.ngZone.run(() => {
          this.isLoading.next(this.pendingUpdate!);
          this.pendingUpdate = null;
        });
      }, 0);
    }
  }
}
