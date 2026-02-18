import { Component, OnInit, signal } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';

// import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { formatLastActivity } from 'src/app/utils/value-getters';
@Component({
  selector: 'app-online-users',
  imports: [TableComponent],
  templateUrl: './online-users.component.html',
  styleUrl: './online-users.component.scss',
})
export class OnlineUsersComponent implements OnInit {
  constructor(private socketService: SocketService) {}

  onlineUsers = signal<any[]>([]); // Array to hold online users

  // Define columns for the table
  // Custom value getter for last activity

  userColumns: {
    label: string;
    key: string;
    valueGetter?: (row: any) => string;
  }[] = [
    { label: 'USERS.USER_ID', key: 'id' },
    { label: 'USERS.USER_LOGIN', key: 'user_login' },
    { label: 'USERS.ROLE', key: 'role_name' },
    {
      label: 'USERS.LAST_LOGIN',
      key: 'last_active',
      valueGetter: (row) => formatLastActivity(row.last_active),
    },
    { label: 'USERS.IP_ADDRESS', key: 'ip_address' },
  ];

  ngOnInit(): void {
    this.socketService.getOnlineUsers().subscribe((users: string[]) => {
      console.log('Online users received from socket:', users);

      users.map((user) => {
        user['id'] = user['user_id'];
        delete user['user_id'];
      });
      this.onlineUsers.set(users);
    });
  }
}
