import {
  Component,
} from '@angular/core';
import {ConstructionComponent} from './construction.component'

@Component({
  selector: 'app-incoming-transfers',
  template: `<app-construction filterMode="incoming"></app-construction>`,
  imports: [
    ConstructionComponent,
  ],
  standalone: true,
})
export class IncomingTransfersComponent  {

}
