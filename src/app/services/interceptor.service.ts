import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  catchError,
  finalize,
  Observable,
  switchMap,
  take,
  tap,
  throwError,
} from 'rxjs';
import { LoadingService } from './loading.service';
import { ErrorService } from './error.service';
import { AuthService } from './auth.service';
import { MessageService } from './message.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  constructor(
    private loadingService: LoadingService,
    private errorService: ErrorService,
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.loadingService.startHttpLoading();

    const isOurApiRequest =
      req.url.startsWith(environment.apiUrl) || req.url.startsWith('/api');
    const isRefreshCall = req.url.includes('/refresh-token');

    let modifiedReq = req;
    const token = this.authService.getTokenFromStorage();

    if (isOurApiRequest && token && !isRefreshCall) {
      modifiedReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(modifiedReq).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          if (body?.success && body?.message) {
            this.messageService.showSuccess(body.message);
          }
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (!isOurApiRequest) {
          return throwError(() => error);
        }

        const isJwtExpired = error.status === 401;

        if (isRefreshCall) {
          return throwError(() => error);
        }

        if (isJwtExpired) {
          return this.authService.refreshToken().pipe(
            take(1), // ✅ Ensure completion
            switchMap((newToken: string | null) => {
              if (!newToken) {
                return throwError(() => new Error('Token refresh failed'));
              }

              const retriedReq = req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` },
              });
              return next.handle(retriedReq);
            }),
            catchError((refreshError) => {
              return throwError(() => refreshError);
            })
          );
        }

        // Other errors
        let message = 'An unknown error occurred!';
        if (error.error instanceof ErrorEvent) {
          message = `Error: ${error.error.message}`;
        } else {
          message =
            error.error?.error ||
            error.error?.message ||
            error.message ||
            message;
        }
        this.errorService.showError(message);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loadingService.stopHttpLoading();
      })
    );
  }
}
