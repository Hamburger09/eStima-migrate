import { Component } from '@angular/core';
import { ConstructionComponent } from './construction.component';
@Component({
  selector: 'app-outgoing-transfers',
  template: `<app-construction filterMode="outgoing"></app-construction>`,
  imports: [
    ConstructionComponent,
  ],
})
export class OutgoingTransfersComponent {

}
