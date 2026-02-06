import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private errorSubject = new BehaviorSubject<string | null>(null);
  error$ = this.errorSubject.asObservable();

  private timeoutId: any = null;

  showError(message: string) {
    this.errorSubject.next(message);

    // Clear previous timeout if it exists
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      
    }

    // Set new timeout
    this.timeoutId = setTimeout(() => {
      this.clearError();
      this.timeoutId = null;
    }, 5000); // 5 seconds
  }

  clearError() {
    this.errorSubject.next(null);
  }
}
