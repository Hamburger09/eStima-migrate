import {
  Component,
  HostBinding,
  inject,
  OnDestroy,
  OnInit,
  DestroyRef,
} from '@angular/core';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
  RouterModule,
} from '@angular/router';

import { DxHttpModule } from 'devextreme-angular/http';

import { LoadingService, ScreenService, ThemeService } from './services';
import { DxLoadPanelModule } from 'devextreme-angular/ui/load-panel';
import { AsyncPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [DxHttpModule, RouterModule, DxLoadPanelModule, AsyncPipe],
})
export class AppComponent implements OnDestroy, OnInit {
  @HostBinding('class') get getClass() {
    const classes = Object.keys(this.screen.sizes).filter(
      (cl) => this.screen.sizes[cl]
    );
    classes.push(this.themeService.currentTheme);
    return classes.join(' ');
  }
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  private themeService = inject(ThemeService);
  private screen = inject(ScreenService);
  private router = inject(Router);

  constructor(public loadingService: LoadingService) {
    this.themeService.setAppTheme();
  }

  private dismissDevExpressBanner() {
    // DevExtreme banner takes a moment to render
    const tryDismiss = (attempts = 0) => {
      if (attempts > 20) return; // give up after ~2s

      const polygon = document.querySelector(
        'polygon[points="13.4 12.7 8.7 8 13.4 3.4 12.6 2.6 8 7.3 3.4 2.6 2.6 3.4 7.3 8 2.6 12.6 3.4 13.4 8 8.7 12.7 13.4 13.4 12.7"]'
      );

      if (polygon) {
        // click the parent div (the actual clickable button)
        const closeBtn = polygon.closest('div');
        closeBtn?.click();
      } else {
        setTimeout(() => tryDismiss(attempts + 1), 0);
      }
    };

    tryDismiss();
  }

  ngOnInit(): void {
    this.dismissDevExpressBanner();
    this.router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.loadingService.startNavigation();
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.loadingService.stopNavigation();
        }
      });
  }

  ngOnDestroy(): void {
    this.screen.breakpointSubscription.unsubscribe();
  }
}
