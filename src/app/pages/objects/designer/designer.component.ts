import { Component } from '@angular/core';
import { StroykaComponent } from '../stroyka.component';

@Component({
  selector: 'app-designer',
  imports: [StroykaComponent],
  template: "<app-stroyka [stroykaRole]='3'></app-stroyka>",
})
export class DesignerComponent {

}
