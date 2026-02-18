import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SingleCardComponent } from 'src/app/layouts';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-unauthenticated-content',
  templateUrl: './unathenticated-content.html',
  styleUrls: ['./unathenticated-content.scss'],
  imports: [CommonModule, RouterModule, SingleCardComponent, NavbarComponent],
})
export class UnauthenticatedContentComponent {
  private router = inject(Router);

  get description() {
    const path = this.router.url.split('/').at(-1);
    switch (path) {
      case 'reset-password':
        return 'Please enter the email address that you used to register, and we will send you a link to reset your password via Email.';
      default:
        return '';
    }
  }

  get title() {
    const path = this.router.url.split('/').at(-1);
    console.log('Current path:', path);
    if (path.includes('sign-in')) {
      return 'LOGIN.TITLE';
    } else if (path.includes('reset-password')) {
      return 'RESET_PASSWORD.TITLE';
    } else if (path.includes('register')) {
      return 'REGISTER.TITLE';
    } else if (path.includes('change-password')) {
      return 'CHANGE_PASSWORD.TITLE';
    }
  }
}
