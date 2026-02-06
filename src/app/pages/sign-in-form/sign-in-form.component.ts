import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardAuthComponent, LoginFormComponent } from 'src/app/components';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss'],
  imports: [CommonModule, LoginFormComponent, CardAuthComponent, SharedModule],
})
export class AppSignInComponent {}
