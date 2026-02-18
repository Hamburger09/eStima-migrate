import { Component } from '@angular/core';

import { StroykaComponent } from '../stroyka.component';

@Component({
  selector: 'app-customer',
  imports: [StroykaComponent],
  template: "<app-stroyka [stroykaRole]='1'></app-stroyka>",
})
export class CustomerComponent {

}
