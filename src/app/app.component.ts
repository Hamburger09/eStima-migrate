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

  ngOnInit(): void {
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
