import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { CityService } from 'src/app/services/city.service';
import { CountryService } from 'src/app/services/country.service';

import { City, Country } from '../../interfaces/TypesABase.interface';

import { TableColumn } from '../../interfaces/column.interface';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableComponent } from 'src/app/components/library/table/table.component';
@Component({
  selector: 'app-cities',
  imports: [SharedModule, TableComponent],
  templateUrl: './cities.component.html',
  styleUrl: './cities.component.scss',
})
export class CitiesComponent implements OnInit {
  cityForm: any;
  cities = signal<City[]>([]);
  city: City | null = { id: 0, name: '', id_country: 0 }; // Store the selected city for deletion
  editMode: boolean = false;
  countries = signal<Country[]>([]);
  cityColumns: TableColumn[] = [];
  constructor(
    private cityService: CityService,
    private countryService: CountryService
  ) {
    effect(() => {
      this.cityColumns = [
        { label: 'COMMON.NAME', key: 'name', required: true },
        {
          label: 'COUNTRIES.COUNTRIES',
          key: 'id_country',
          editorType: 'dxSelectBox',
          required: true,
          lookup: {
            dataSource: this.countries(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
      ];
    });
  }

  // Fetch all cities
  getAllCities(): void {
    this.cityService.getCities().subscribe((cities: City[]) => {
      console.log(cities);
      this.cities.set(cities);
    });
  }

  // Fetch all countries
  getAllCountries(): void {
    this.countryService.getCountries().subscribe((countries: Country[]) => {
      this.countries.set(countries);
    });
  }

  onCityInserted(e: any): void {
    const newCity: City = e.data;
    this.cityService.addCity(newCity).subscribe(() => {
      this.getAllCities();
      e.done();
    });
  }
  onCityUpdated(e: any): void {
    const updatedCity: City = e.data;
    this.cityService.updateCity(updatedCity).subscribe((city: City) => {
      this.cities.update((cities) => {
        const index = cities.findIndex((c) => c.id === city.id);
        if (index !== -1) {
          cities[index] = city;
        }
        return cities;
      });
      e.done();
    });
  }
  onCityRemoved(e: any): void {
    const cityId: number = e.data.id;
    this.cityService.deleteCity(cityId).subscribe((id: any) => {
      this.cities.update((cities) => cities.filter((c) => c.id !== id));
      e.done();
    });
  }

  ngOnInit(): void {
    // Fetch all countries and cities on component initialization
    this.getAllCountries();
    this.getAllCities();
  }
}
