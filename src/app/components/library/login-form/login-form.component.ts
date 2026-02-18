import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { take } from 'rxjs/operators';

import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxButtonModule, DxButtonTypes } from 'devextreme-angular/ui/button';
import notify from 'devextreme/ui/notify';

import { AuthService, ThemeService, LoadingService } from 'src/app/services';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DxFormModule,
    DxLoadIndicatorModule,
    DxButtonModule,
    SharedModule,
  ],
})
export class LoginFormComponent {
  @Input() resetLink = '/auth/reset-password';
  @Input() createAccountLink = '/auth/register';

  private authService = inject(AuthService);
  private router = inject(Router);
  private themeService = inject(ThemeService);
  public loadingService = inject(LoadingService);

  btnStylingMode: DxButtonTypes.ButtonStyle = 'contained';
  loading = false;

  // match your template fields:
  formData: any = { username: '', password: '' };

  passwordEditorOptions = {
    placeholder: 'Password',
    stylingMode: 'filled',
    mode: 'password',
  };

  constructor() {
    this.themeService.isDark.subscribe((value: boolean) => {
      this.btnStylingMode = value ? 'outlined' : 'contained';
    });
  }

  projectOptions = [
    {
      value: 'cabinet',
      label: '🏢 Личный кабинет',
    },
    {
      value: 'materials',
      label: '📦 Материалы',
    },
  ];

  onSubmit(e: Event) {
    e.preventDefault();

    const username = (this.formData?.username ?? '').trim();
    const password = this.formData?.password ?? '';
    const app_type = this.formData?.app_type ?? '';

    if (!username || !password) {
      notify('Please enter login and password', 'warning', 2000);
      return;
    }

    this.loading = true;

    // map form fields -> backend fields
    this.authService
      .login(username, password, app_type)
      .subscribe((data: any) => {
        this.router.navigate(['/']);
      });
  }

  onCreateAccountClick = () => {
    this.router.navigate([this.createAccountLink]);
  };
}
