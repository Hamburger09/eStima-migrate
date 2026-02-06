// notification.service.ts
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TNotification, TTransfer } from '../interfaces/TypesTBase.interface';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../interfaces/TypesABase.interface';
import { environment } from '../../environments/environment';
import { NotificationType } from 'src/app/types/notification';

type TransferNotifiaction = {
  type: 'transfer';
  data: TTransfer;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<TNotification[]>([]);
  private notifications: TNotification[] = [];
  private baseUrl = `${environment.apiUrl}/notifications`;
  constructor(private http: HttpClient, private injector: Injector) {}
  private _authService: AuthService | null = null;
  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }

  private fetchNotificationsFromServer(): void {
    const userId = this.authService.getUserIdFromStorage();
    this.http
      .get<ApiResponse<TNotification[]>>(`${this.baseUrl}/?user_id=${userId}`)
      .subscribe((notifications) => {
        this.notifications = notifications.data;
        this.notificationsSubject.next(this.notifications);
      });
  }

  public markNotificationAsRead(
    notification: TNotification
  ): Observable<TNotification> {
    return this.http
      .put<ApiResponse<TNotification>>(
        `${this.baseUrl}/update/${notification.id}`,
        notification
      )
      .pipe(
        map((response) => {
          const updatedNotification = response.data;
          this.notifications = this.notifications.map((n) =>
            n.id === updatedNotification.id ? updatedNotification : n
          );
          this.notificationsSubject.next(this.notifications);
          return updatedNotification;
        })
      );
  }

  addNotification(notification: TNotification): void {
    this.notifications = [notification, ...this.notifications];
    this.notificationsSubject.next(this.notifications);
  }

  setNotifications(notifications: TNotification[]): void {
    this.notifications = [...notifications, ...this.notifications];
    this.notificationsSubject.next(this.notifications);
  }

  getNotifications(): Observable<TNotification[]> {
    if (this.notifications.length === 0) {
      this.fetchNotificationsFromServer();
    }
    return this.notificationsSubject.asObservable()
    .pipe(
      map((notifications) => 
        notifications.filter((n) => !n.is_read))
    );;
  }

  getNotificationsByType(type: string): Observable<TNotification[]> {
    return this.notificationsSubject
      .asObservable()
      .pipe(
        map((notifications) => notifications.filter((n) => n.type === type))
      );
  }

  getTransferNotifications(): Observable<TNotification[]> {
    return this.getNotificationsByType(NotificationType.transfers);
  }
  getStroykaNotifications(): Observable<TNotification[]> {
    const type = "server_stroyka_user" as keyof typeof NotificationType;
    return this.getNotificationsByType(type);
  }

  clearNotifications(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }
}
