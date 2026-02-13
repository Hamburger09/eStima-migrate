import { Component, computed, OnInit, signal } from '@angular/core';
import { LogService } from '../../services/log.service';
// import { FilterComponent } from '../../shared/components/filter/filter.component';
// import { smartPaginationComponent } from 'src/app/shared/components/pagination/smart-pagination.component';
import { SocketService } from '../../services/socket.service';
import { TLog, TLogs, User } from '../../interfaces/TypesABase.interface';
import { UserService } from '../../services/user.service';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';
@Component({
  selector: 'app-logs',
  imports: [TableComponent, SharedModule],
  templateUrl: './logs.component.html',
  styleUrl: './logs.component.scss',
})
export class LogsComponent implements OnInit {
  // Data signals
  logs = signal<any[]>([]);
  // store only the current page's logs when in serverMode
  serverPageLogs: any[] = [];
  // store the full set of logs for filtered (client-side paging)
  filteredAllLogs: any[] = [];

  itemsPerPage = signal(10); // page size
  totalItems = signal<number>(0); // total items count
  totalPages = signal<number>(0);
  currentPage = signal(1); // 1-based index
  serverMode = signal(true); // true = use server pagination; false = filtered client-side
  activeFilters = signal<any>(null);
  logColumns = [
    { label: 'User ID', key: 'log_date_time' },
    { label: 'ID of the user', key: 'user_client_id' },
    { label: 'IP Address', key: 'log_ip' },
    { label: 'Log command', key: 'log_command_name' },
    { label: 'Log base', key: 'log_base' },
    { label: 'Log Action', key: 'log_action' },
    { label: 'Log URL', key: 'log_url' },
    { label: 'Log Success', key: 'log_success' },
    { label: 'Request Response', key: 'req_resp' },
  ];

  filterOptions = [
    {
      key: 'user',
      label: 'User',
      type: 'select',
      options: [], // we'll fill this dynamically
    },
    { key: 'name', label: 'Name', type: 'text' },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
    },
    {
      key: 'category',
      label: 'Category',
      type: 'select',
      options: [
        { label: 'Category 1', value: 'cat1' },
        { label: 'Category 2', value: 'cat2' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        { label: 'High', value: 'high' },
        { label: 'Medium', value: 'medium' },
        { label: 'Low', value: 'low' },
      ],
    },
    { key: 'createdAt', label: 'Created Date', type: 'date' },
  ];
  constructor(
    private logService: LogService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getLogsByPage(1, this.itemsPerPage());
    this.getUsers();
  }
  // Fetch a page from server (server-side pagination)
  getLogsByPage(page = 1, pageSize = this.itemsPerPage()) {
    this.logService
      .getLogsByPage(page, pageSize)
      .subscribe((response: TLogs) => {
        // response.logs = logs for this page
        // response.totalLogs = total number of logs (all pages)
        this.serverPageLogs = response.logs ?? [];
        this.logs.set(this.serverPageLogs);
        this.totalPages.set(response.totalLogs);
        this.currentPage.set(page);
        this.serverMode.set(true);
        // clear any filtered cache
        this.filteredAllLogs = [];
        this.activeFilters.set(null);
      });
  }

  getUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      console.log('Fetched users:', users);
      // Assuming each user has properties like { id: number, name: string }
      const userOptions = users.map((user: User) => ({
        label: `${user.user_client_id} ${user.fio_1}`,
        value: String(user.id ?? ''),
      }));

      // Find the "user" filter and set its options
      const userFilter = this.filterOptions.find((f) => f.key === 'user');
      if (userFilter) {
        userFilter.options = userOptions;
      }

      // Optionally log to verify
      console.log('Updated filter options:', this.filterOptions);
    });
  }
  // When user applies filters (we assume API returns the full filtered list)
  submitFilters(filters: any) {
    this.activeFilters.set(filters);
    this.logService
      .getLogsByUserIdAndPage(filters.user, 1, this.itemsPerPage())
      .subscribe((response: TLogs) => {
        this.filteredAllLogs = response.logs ?? [];
        this.itemsPerPage.set(this.itemsPerPage());
        this.currentPage.set(1);
        this.serverMode.set(false);

        // ✅ let pagination handle it
        this.totalPages.set(response.totalLogs);

        const firstPage = this.filteredAllLogs.slice(0, this.itemsPerPage());
        this.logs.set(firstPage);
      });
  }
  // Reset -> go back to server-side paginated listing (first page)
  onReset() {
    // clear filter state
    this.activeFilters.set(null);
    this.filteredAllLogs = [];
    this.getLogsByPage(1, this.itemsPerPage());
  }

  // When pagination component emits pageChange
  onPageChange(event: any) {
    const pageIndex = (event.pageIndex ?? 0) + 1;
    const pageSize = event.pageSize ?? this.itemsPerPage();

    this.itemsPerPage.set(pageSize);
    this.currentPage.set(pageIndex);

    // 🔹 Check if currently in filtered mode
    if (!this.serverMode() && this.activeFilters()?.user) {
      const userId = this.activeFilters().user;

      // ✅ Fetch filtered logs by page (from server)
      this.logService
        .getLogsByUserIdAndPage(userId, pageIndex, pageSize)
        .subscribe((response: TLogs) => {
          this.filteredAllLogs = response.logs ?? [];
          this.logs.set(this.filteredAllLogs);
          this.totalPages.set(response.totalLogs); // ✅ total = all logs for that user
        });

      return;
    }

    // 🔹 Otherwise, normal (unfiltered) pagination
    this.logService
      .getLogsByPage(pageIndex, pageSize)
      .subscribe((response: TLogs) => {
        this.serverPageLogs = response.logs ?? [];
        this.logs.set(this.serverPageLogs);
        this.totalPages.set(response.totalLogs);
      });
  }

  // // onSearch method to filter logs based on search input
  // onSearch(event: any): void {
  //   const searchValue = event.target.value.toLowerCase();

  //   if (!searchValue) {
  //     this.logs.set(this.originalLogs); // Reset to original logs if search value is empty
  //     return;
  //   }

  //   // Filter logs based on search value
  //   this.logs.set(
  //     this.logs().filter((log) => {
  //       return log.LOG_ACTION.toLowerCase().includes(
  //         event.target.value.toLowerCase()
  //       );
  //     })
  //   );
  // }

  openAddUserModal(): void {
    console.log('Open Add User Modal');
  }
}
