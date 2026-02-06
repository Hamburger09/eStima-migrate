import { Component, signal, OnInit, ViewChild, effect } from '@angular/core';
import { OrganizationService } from 'src/app/services/organization.service';
import { FormBuilder } from '@angular/forms';
import { CountryService } from 'src/app/services/country.service';
import { CityService } from 'src/app/services/city.service';
import {
  City,
  Country,
  Organization,
} from '../../interfaces/TypesABase.interface';
import { getCitiesByCountry } from '../../utils/value-getters';
import { TableColumn } from '../../interfaces/column.interface';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-organizations',
  imports: [SharedModule, TableComponent],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
})
export class OrganizationsComponent implements OnInit {
  organizationForm: any;
  // Signals to hold organizations data
  organizations = signal<any[]>([]);
  organization: any = {};
  organizationColumns: TableColumn[] = [];
  editMode: boolean = false;
  countries = signal<Country[]>([]);
  cities = signal<City[]>([]);
  allCities = signal<City[]>([]); // Store all cities for filtering
  constructor(
    private organizationService: OrganizationService,
    private fb: FormBuilder,
    private countryService: CountryService,
    private cityService: CityService
  ) {
    this.organizationForm = this.fb.group({
      organizationName: [''],
      organizationCountryId: [''],
      organizationCityId: [''],
    });
    effect(() => {
      this.organizationColumns = [
        { label: 'COMMON.NAME', key: 'name', required: true },
        {
          label: 'USERS.COUNTRY',
          key: 'id_country',
          editorType: 'dxSelectBox',
          required: true,
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
          label: 'USERS.CITY',
          key: 'id_city',
          editorType: 'dxSelectBox',
          required: true,
          lookup: {
            dataSource: this.allCities(), // ✅ full list
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
      ];
    });
  }

  organizationKeys(): string[] {
    return this.organizations();
  }

  openAddOrganizationModal(): void {
    this.organizationForm.reset();
    // Explicitly set default value for select input
    this.organizationForm.patchValue({
      organizationCountryId: '', // Matches the default <option> value=""
      organizationCityId: '', // Matches the default <option> value=""
    });
    this.editMode = false;
    // Reset cities (empty or all, or based on no country)
    this.cities.set([]);
  }

  // Get all organizations
  getAllOrganizations(): void {
    this.organizationService
      .getOrganizations()
      .subscribe((organizations: Organization[]) => {
        this.organizations.set(organizations);
      });
  }

  // get all countries
  getAllCountries(): void {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countries.set(countries);
    });
  }

  // get all cities
  getAllCities(): void {
    this.cityService.getCities().subscribe((cities: City[]) => {
      this.allCities.set(cities); // Store all cities for filtering
      this.cities.set(cities);
    });
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

  onOrganizationInserted(e: any) {
    const newOrganization: Organization = e.data;
    this.organizationService.addOrganization(newOrganization).subscribe(() => {
      this.getAllOrganizations();
      e.done();
    });
  }

  onOrganizationUpdated(e: any) {
    const updatedOrganization: Organization = e.data;
    this.organizationService
      .updateOrganization(updatedOrganization)
      .subscribe(() => {
        this.organizations.update((organizations) => {
          const index = organizations.findIndex(
            (o) => o.id === updatedOrganization.id
          );
          if (index > -1) {
            organizations[index] = updatedOrganization;
          }
          return organizations;
        });
        e.done();
      });
  }

  onOrganizationRemoved(e: any) {
    const removedOrganization: Organization = e.data;
    this.organizationService
      .deleteOrganization(removedOrganization.id!)
      .subscribe(() => {
        this.organizations.update((organizations) => {
          return organizations.filter((o) => o.id !== removedOrganization.id);
        });
        e.done();
      });
  }

  ngOnInit(): void {
    // Fetch all organizations
    this.getAllOrganizations();
    // Fetch all countries
    this.getAllCountries();
    // Fetch all cities
    this.getAllCities();
  }
}
