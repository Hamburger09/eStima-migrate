import { Component } from '@angular/core';
import { MessageService } from '../../../services/message.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-message-toast',
  imports: [CommonModule],
  templateUrl: './message-toast.component.html',
  styleUrl: './message-toast.component.scss'
})
export class MessageToastComponent {
constructor(public messageService: MessageService){}
}
