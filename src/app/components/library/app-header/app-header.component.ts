import {
  Component, Input, Output, EventEmitter, OnInit, inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxToolbarModule } from 'devextreme-angular/ui/toolbar';

import { UserPanelComponent } from '../user-panel/user-panel.component';
import { AuthService } from 'src/app/services';
import { ThemeSwitcherComponent } from 'src/app/components/library/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  templateUrl: 'app-header.component.html',
  styleUrls: ['./app-header.component.scss'],
  imports: [
      CommonModule,
      DxButtonModule,
      DxToolbarModule,
      ThemeSwitcherComponent,
      UserPanelComponent,
  ]
})

export class AppHeaderComponent implements OnInit {
  @Output()
  menuToggle = new EventEmitter<boolean>();

  @Input()
  menuToggleEnabled = false;

  @Input()
  title!: string;

  private authService = inject(AuthService);

  user = { email: '' };

  userMenuItems = [
  {
    text: 'Logout',
    icon: 'runner',
    onClick: () => {
      this.authService.logout();
    },
  }];

  ngOnInit() {
    this.authService.getUserLoginFromStorage()
  }

  toggleMenu = () => {
    this.menuToggle.emit();
  };
}
