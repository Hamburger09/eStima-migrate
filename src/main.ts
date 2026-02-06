import { enableProdMode, importProvidersFrom, Provider } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  AppInfoService,
  AuthService,
  ScreenService,
  ThemeService,
} from './app/services';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
  HttpClient,
  withFetch,
} from '@angular/common/http';
import { InterceptorService } from './app/services/interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
  withHashLocation,
  withInMemoryScrolling,
  withRouterConfig,
  withViewTransitions,
} from '@angular/router';

import themes from 'devextreme/ui/themes';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { routes } from './app/app-routes';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (
  http: HttpClient
) => new TranslateHttpLoader(http, './assets/i18n/', '.json');

export const interceptorServiceProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: InterceptorService,
  multi: true,
};

if (environment.production) {
  enableProdMode();
}

themes.initialized(() => {
  bootstrapApplication(AppComponent, {
    providers: [
      AuthService,
      ScreenService,
      AppInfoService,
      ThemeService,
      importProvidersFrom(
        HttpClientModule,
        NgIdleKeepaliveModule.forRoot(),
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: httpLoaderFactory,
            deps: [HttpClient],
          },
        })
      ),
      provideHttpClient(withFetch(), withInterceptorsFromDi()),
      interceptorServiceProvider,
      provideRouter(
        routes,
        withHashLocation(),
        withRouterConfig({
          onSameUrlNavigation: 'reload',
        }),
        withInMemoryScrolling({
          scrollPositionRestoration: 'top',
          anchorScrolling: 'enabled',
        }),
        withEnabledBlockingInitialNavigation(),
        withViewTransitions()
      ),
    ],
  }).catch((e) => console.error(e));
});
