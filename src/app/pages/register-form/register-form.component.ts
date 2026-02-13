import { Component } from '@angular/core';

import {
  CardAuthComponent,
  CreateAccountFormComponent,
} from 'src/app/components';

import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [SharedModule, CardAuthComponent, CreateAccountFormComponent],
})
export class AppRegisterComponent {
  defaultLink = '/sign-in-form';

  buttonLink = '/register-form';

  constructor() {}
}
