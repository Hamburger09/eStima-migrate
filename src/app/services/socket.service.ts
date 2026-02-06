import { Injectable, InjectOptions, Injector } from '@angular/core';

import { io, Socket } from 'socket.io-client';

import { environment } from '../../environments/environment';

import { Observable, BehaviorSubject } from 'rxjs';

import { AuthService } from './auth.service';
import { IpAddressService } from './ip-address.service';
import { TNotification, TTransfer } from '../interfaces/TypesTBase.interface';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket!: Socket;
  private onlineUsersSubject: BehaviorSubject<any[]> = new BehaviorSubject<
    any[]
  >([]);
  private _authService: AuthService | null = null;

  constructor(
    private ipAddressService: IpAddressService,
    private notificationService: NotificationService,
    private injector: Injector
  ) {}
  private get authService(): AuthService {
    if (!this._authService) {
      this._authService = this.injector.get(AuthService);
    }
    return this._authService;
  }
  connect(): void {
   
    if (this.socket && this.socket.connected) return; // Already connected
    fetch('https://api.ipify.org?format=json')
      .then((response) => response.json())
      .then(({ ip }: any) => {
        this.socket = io(environment.serverUrl, {
          withCredentials: true,
          auth: {
            token: this.authService.getTokenFromStorage(),
            ip: ip,
          },
        });

        // Now that socket is defined, it's safe to register event listeners
        this.socket.on('connect', () => {
          console.log('[Socket] Connected');
        });

        this.socket.on('onlineUsers', (users: string[]) => {
          this.onlineUsersSubject.next(users);
        });

        this.socket.on("newNotification", (notification: TNotification) => {
          this.notificationService.addNotification(notification);
          // Handle new transfer logic here, e.g., navigate to transfer details
        });

        this.socket.on('forceDisconnect', (data: { message: string }) => {
          console.warn('[Socket] Force disconnect:', data.message);
          this.disconnect();
          this.authService.logout().subscribe(() => {
            console.log('[Socket] User logged out due to force disconnect');
          });
        });

        this.socket.on('disconnect', () => {
          console.log('[Socket] Disconnected');
          this.notificationService.clearNotifications()
        });
      });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      console.log('[Socket] Disconnected');
      this.onlineUsersSubject.next([]); // Clear online users on disconnect
    }
  }

  getOnlineUsers(): Observable<string[]> {
    return this.onlineUsersSubject.asObservable();
  }
}
