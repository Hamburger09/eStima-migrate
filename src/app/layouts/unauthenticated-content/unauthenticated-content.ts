import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SingleCardComponent } from 'src/app/layouts';
import { Router } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-unauthenticated-content',
  templateUrl: './unathenticated-content.html',

  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
      }
    `,
  ],
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
    switch (path) {
      case 'sign-in':
        return 'Sign In';
      case 'reset-password':
        return 'Reset Password';
      case 'register':
        return 'Register';
      case 'change-password':
        return 'Change Password';
      default:
        return '';
    }
  }
}
