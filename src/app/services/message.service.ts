import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MessageService {
  constructor() {}

  // BehaviorSubject to hold the message state
  private messageSubject = new BehaviorSubject<string | null>(null);
  message$ = this.messageSubject.asObservable();
  showSuccess(message: string) {
    this.messageSubject.next(message);
  }

  clearMessage() {
    this.messageSubject.next(null);
  }
}
