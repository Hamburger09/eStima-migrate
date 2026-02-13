import { Component } from '@angular/core';

import { StroykaComponent } from '../stroyka.component';

@Component({
  selector: 'app-contractor',
  imports: [StroykaComponent],
  template: `<app-stroyka [stroykaRole]='2'></app-stroyka>`,
})
export class ContractorComponent {

}
