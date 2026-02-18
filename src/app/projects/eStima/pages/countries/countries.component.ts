import { Component, OnInit, signal, viewChild, ViewChild } from '@angular/core';
import { CountryService } from 'src/app/services/country.service';
import { FormBuilder } from '@angular/forms';
import { Country } from 'src/app/interfaces/TypesABase.interface';
import { TableColumn } from 'src/app/interfaces/column.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableComponent } from 'src/app/components/library/table/table.component';

@Component({
  selector: 'app-countries',
  imports: [SharedModule, TableComponent],
  templateUrl: './countries.component.html',
  styleUrl: './countries.component.scss',
})
export class CountriesComponent implements OnInit {
  countryForm: any;
  countries = signal<Country[]>([]);
  country: Country | null = null; // Store the selected country for deletion
  editMode: boolean = false;
  // Define columns for the table
  countryColumns: TableColumn[] = [
    { label: 'COMMON.NAME', key: 'name', required: true },
  ];
  constructor(private countryService: CountryService, private fb: FormBuilder) {
    this.countryForm = this.fb.group({
      countryName: [''],
    });
  }
  // Fetch all countries
  getAllCountries(): void {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countries.set(countries);
    });
  }

  onCountryInserted(e: any): void {
    const newCountry: Country = e.data;
    this.countryService.addCountry(newCountry).subscribe(() => {
      this.getAllCountries();
      e.done();
    });
  }
  onCountryUpdated(e: any): void {
    const updatedCountry: Country = e.data;
    this.countryService
      .updateCountry(updatedCountry)
      .subscribe((country: Country) => {
        this.countries.update((countries) => {
          const index = countries.findIndex((c) => c.id === country.id);
          if (index !== -1) {
            countries[index] = country;
          }
          return countries;
        });
        e.done();
      });
  }

  onCountryRemoved(e: any): void {
    const countryId: number = e.data.id;
    console.log('Deleting country with ID:', countryId);
    this.countryService
      .deleteCountry(countryId)
      .subscribe((country: Country) => {
        this.countries.update((countries) =>
          countries.filter((c) => c.id !== country.id)
        );
        e.done();
      });
  }

  // Fetch all countries
  ngOnInit(): void {
    this.getAllCountries();
  }
}
