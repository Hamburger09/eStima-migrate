import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../interfaces/TypesABase.interface';
import { InactivityService } from './inactivity.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}/auth`;
  private isRefreshing = false; // Track if a refresh is in progress
  private refreshTokenSubject = new BehaviorSubject<string | null>(null); // Emit new access token after refresh
  private _inactivityService: InactivityService | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    private injector: Injector,
    private socketService: SocketService
  ) {}

  private get inactivityService(): InactivityService {
    if (!this._inactivityService) {
      this._inactivityService = this.injector.get(InactivityService);
    }
    return this._inactivityService;
  }
  login(user_login: string, user_password: string): Observable<void> {
    return this.http
      .post<any>(
        `${this.baseUrl}/login`,
        { user_login, user_password },
        { withCredentials: true } // Send refresh token cookie
      )
      .pipe(
        map((res) => {
          const { accessToken } = res.data;
          this.setAuthState(accessToken);
          this.socketService.connect(); // Connect to the socket server
          this.inactivityService.resetIdleWatch(); // Reset idle timer on successful login
        })
      );
  }

  // Refresh the access token using the refresh token cookie
  refreshToken(): Observable<string | null> {
    if (this.isRefreshing) {
      return this.refreshTokenSubject.asObservable();
    }
    this.isRefreshing = true;
    return this.http
      .post<any>(
        `${this.baseUrl}/refresh-token`,
        {}, // Consider sending refresh token in body if server expects it
        { withCredentials: true }
      )
      .pipe(
        map((res) => {
          const { accessToken } = res.data;
          this.setAuthState(accessToken);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(accessToken);
          console.log('Token refreshed successfully');
          return accessToken;
        }),
        catchError((error: HttpErrorResponse) => {
          console.error('Refresh token error:', error);
          this.isRefreshing = false;
          this.refreshTokenSubject.next(null);
          this.socketService.disconnect();
          localStorage.removeItem('accessToken');
          this.inactivityService.stopIdleWatch();
          this.router.navigate(['/auth'], {
            queryParams: { error: error.error?.error || 'Session expired' },
          });
          return of(null);
        })
      );
  }

  // Check if the user is logged in and handle token refresh if needed
  isLoggedIn(): Observable<boolean> {
    const token = this.getTokenFromStorage();
    if (!token) {
      console.log('No token found');
      return of(false);
    }

    if (!this.isTokenExpired()) {
      console.log('Token is valid');
      return of(true);
    }

    console.log('Token expired, attempting refresh...');
    return this.refreshToken().pipe(
      map((newToken) => {
        const result = !!newToken;
        console.log('Refresh result:', result);
        return result;
      }),
      catchError((err) => {
        console.error('isLoggedIn refresh error:', err);
        return of(false); // Just return false, don't navigate or clear storage here
      })
    );
  }
  isTokenExpired(): boolean {
    const token = this.getTokenFromStorage();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000;
      return Date.now() > expirationTime;
    } catch {
      return true; // Invalid token format
    }
  }

  setAuthState(accessToken: string) {
    localStorage.setItem('accessToken', accessToken);
  }

  getTokenFromStorage(): string | null {
    return localStorage.getItem('accessToken');
  }

  getUserLoginFromStorage(): string | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user_login || null;
    } catch (e) {
      console.error('Invalid token:', e);
      this.logout().subscribe(); // Clean up broken token
      return null;
    }
  }

  getUserClientIdFromStorage(): string | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user_client_id || null;
    } catch (e) {
      console.error('Invalid token:', e);
      this.logout().subscribe(); // Clean up broken token
      return null;
    }
  }

  getUserPasswordFromStorage(): string | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user_password || null;
    } catch (e) {
      console.error('Invalid token:', e);
      this.logout().subscribe(); // Clean up broken token
      return null;
    }
  }

  getUserIdFromStorage(): number | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.user_id || null;
    } catch (e) {
      console.error('Invalid token:', e);
      this.logout().subscribe(); // Clean up broken token
      return null;
    }
  }

  getRoleFromStorage(): string | null {
    const token = this.getTokenFromStorage();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.role_name || null;
    } catch (e) {
      console.error('Invalid token:', e);
      this.logout(); // Clean up broken token
      return null;
    }
  }

  logout(): Observable<void> {
    this.http
      .post<any>(`${this.baseUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          console.log('Logged out from server');
        },
        error: (err) => {
          console.error('Logout error:', err);
        },
      });
    // Clear client-side access token
    localStorage.removeItem('accessToken');

    // Disconnect socket and stop inactivity timer
    this.socketService.disconnect();
    this.inactivityService.stopIdleWatch();

    // Navigate to login page
    this.router.navigate(['/auth']);

    // Return an observable to maintain consistency with the method signature
    return of(undefined);
  }

  // Existing register methods unchanged
  registerStep1(user_login: string, user_password: string): Observable<void> {
    return this.http.post<any>(`${this.baseUrl}/register/step1`, {
      user_login,
      user_password,
    });
  }

  registerStep2(payload: any): Observable<void> {
    return this.http.post<any>(`${this.baseUrl}/register/step2`, payload);
  }

  registerStep3(payload: any): Observable<void> {
    return this.http.post<any>(`${this.baseUrl}/register/step3`, payload);
  }

  resendVerificationCode(email: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/resend-verification-code`, {
      email,
    });
  }

  changePassword(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/change-password/${this.getUserIdFromStorage()}`,
      payload
    );
  }
}
