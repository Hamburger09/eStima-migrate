// Users component
// This component is responsible for managing users in the application. It allows the user to add, update, delete, and view users. It also fetches data from the server using the UserService, CountryService, and CityService.
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  effect,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { CountryService } from 'src/app/services/country.service';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { FormBuilder } from '@angular/forms';
import { signal } from '@angular/core';
import { CityService } from 'src/app/services/city.service';
import {
  City,
  Country,
  Organization,
  Role,
  User,
} from '../../interfaces/TypesABase.interface';
import { OrganizationService } from 'src/app/services/organization.service';
import { RoleService } from '../../services/role.service';
import { TranslateService } from '@ngx-translate/core';
import { ExeService } from '../../services/exe.service';
import { Subject } from 'rxjs';
import { TableColumn } from '../../interfaces/column.interface';
import { getCitiesByCountry } from '../../utils/value-getters';
import { DataSource } from 'devextreme/common/data';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-users',
  imports: [TableComponent, SharedModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  @ViewChild(TemplateRef) template!: TemplateRef<any>;

  userForm: any;
  allCities = signal<City[]>([]); // Store all cities for filtering
  cancel$ = new Subject<void>();
  userColumns: TableColumn[] = [];


  users = signal<User[]>([]);
  user: User | null = null; // Store the selected user
  editMode: boolean = false;
  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);
  organizations = signal<Organization[]>([]);
  roles = signal<Role[]>([]);

  dataSource = new DataSource<User[], string>({
    key: 'id',
    load: () => new Promise((resolve, reject) => {
      this.userService.getUsers().subscribe({
          next: (data: User[]) => resolve(data), // Update type to User[]
          error: ({message}) => reject(message)
        })
    }),
  });

  // Inject the UserService
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private countryService: CountryService,
    private cityService: CityService,
    private organizationService: OrganizationService,
    private roleService: RoleService,
    private translate: TranslateService,
    private exeService: ExeService
  ) {
    effect(() => {
      this.userColumns = [
        { label: 'USERS.USER_ID', key: 'user_client_id' },
        { label: 'USERS.USER_LOGIN', key: 'user_login' },
        { label: 'COMMON.NAME', key: 'fio_1' },
        { label: 'USERS.PHONE', key: 'user_tel' },
        { label: 'USERS.EMAIL', key: 'user_mail' },
        {
          label: 'USERS.ORGANIZATION',
          key: 'id_organization',
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.organizations(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
        {
          label: 'USERS.CITY',
          key: 'id_city',
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.cities(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
        {
          label: 'USERS.COUNTRY',
          key: 'id_country',
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.countries(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
          setCellValue: (row, value) => {
            row.id_country = value;
            row.id_city = null; // 🔥 reset city
          },
        },
        {
          label: 'USERS.STATUS',
          key: 'id_status',
          required: true,
          editorType: 'dxCheckBox',
          calculateDisplayValue: (row) =>
            this.translate.instant(
              row.id_status === 1 ? 'COMMON.ACTIVE' : 'COMMON.INACTIVE'
            ),
        },
        {
          label: 'USERS.ROLE',
          key: 'id_role',
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.roles(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
        { label: 'USERS.GUID', key: 'guid' },
      ];
    });
  }



  // Assuming roles is an array of objects
  // Fetch all users
  getAllUsers(): void {
    this.userService.getUsers().subscribe({
      next: (users: User[]) => {
        console.log('Fetched users:', users);
        this.users.set(users);
      },
    });
  }
  // Fetch all countries
  getAllCountries(): void {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countries.set(countries);
    });
  }
  // Fetch all cities
  getAllCities(): void {
    this.cityService.getCities().subscribe((cities: City[]) => {
      this.allCities.set(cities); // Store all cities for filtering
      this.cities.set(cities);
    });
  }

  getAllOrganizations(): void {
    this.organizationService
      .getOrganizations()
      .subscribe((organizations: Organization[]) => {
        this.organizations.set(organizations);
      });
  }

  // Fetch all roles
  getAllRoles(): void {
    this.roleService.getRoles().subscribe((roles: Role[]) => {
      this.roles.set(roles);
    });
  }

  ngOnInit(): void {
    // Fetch all countries
    this.getAllCountries();
    // Fetch all users
    this.getAllUsers();
    // Fetch all cities
    this.getAllCities();
    // Fetch all organizations
    this.getAllOrganizations();
    // Fetch all roles
    this.getAllRoles();
  }

  downloadUserSetupFiles = (user: User) => {
    // Implement the logic to download setup files for the user
    console.log('Downloading setup files for user:', user);
    this.exeService
      .getExeData({ user_client_id: user.user_client_id }, this.cancel$)
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'eStima.zip';
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Error downloading user setup files:', err);
        },
      });
  };

  onUserInserted(e: any) {
    const newUser: User = e.data;
    this.userService.addUser(newUser).subscribe();
  }
  onUserUpdated(e: any) {
    const updatedUser: User = e.data;
    this.userService.updateUser(updatedUser.id!, updatedUser).subscribe();
  }
  onUserRemoved(e: any) {
    const removedUser: User = e.data;
    this.userService.deleteUser(removedUser.id!).subscribe();
  }

  onEditorPreparing(e: any) {
    if (e.dataField === 'id_city') {
      const countryId = e.row?.data?.id_country;

      e.editorOptions.dataSource = getCitiesByCountry(
        countryId,
        this.allCities(),
        this.cityService
      );

      e.editorOptions.disabled = !countryId;
    }
  }
}
