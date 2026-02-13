import { Component } from '@angular/core';

import { StroykaComponent } from '../stroyka.component';

@Component({
  selector: 'app-expert',
  imports: [StroykaComponent],
  template: "<app-stroyka [stroykaRole]='4'></app-stroyka>",
})
export class ExpertComponent {}
