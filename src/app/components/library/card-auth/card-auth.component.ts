import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-card-auth',
  templateUrl: './card-auth.component.html',
  styleUrls: ['./card-auth.component.scss'],
  imports: [CommonModule, SharedModule],
})
export class CardAuthComponent {
  @Input()
  title!: string;

  @Input()
  description!: string;
}
