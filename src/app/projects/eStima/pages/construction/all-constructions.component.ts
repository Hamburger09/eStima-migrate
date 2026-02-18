import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-all-constructions',
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
})
export class AllConstructionsComponent {
  // This component is a placeholder for the All Constructions view
  // It simply renders the ConstructionComponent with filterMode set to "all"
  // The actual logic and data handling is done in the ConstructionComponent
}
