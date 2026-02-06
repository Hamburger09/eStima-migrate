// Imports Angular core modules and services
// UpdatesComponent is an Angular component that displays a list of updates in a table format
// It uses the UpdateService to fetch updates data and displays it using a table component

import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { UpdateService } from '../../services/update.service';
import { CountryService } from 'src/app/services/country.service';
import { TableColumn } from '../../interfaces/column.interface';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';

// Component decorator to define the metadata for the UpdatesComponent
// It includes the selector, template URL, and style URL for the component
@Component({
  selector: 'app-updates',
  imports: [SharedModule, TableComponent],
  templateUrl: './updates.component.html',
  styleUrl: './updates.component.scss',
})
export class UpdatesComponent implements OnInit {
  updates = signal<any>([]); // Signal to hold updates data
  update: any = {}; // Variable to hold a single update
  countries = signal<any>([]); // Signal to hold countries data
  // Update columns to be displayed in the table\

  updateColumns: TableColumn[] = [];
  constructor(
    private updateService: UpdateService,
    private countryService: CountryService
  ) {
    effect(() => {
      this.updateColumns = [
        { label: 'UPDATES.ID', key: 'ID' },
        {
          label: 'UPDATES.COUNTRY_ID',
          key: 'ID_COUNTRY',
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.countries(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
        { label: 'UPDATES.UNIQUE_ID', key: 'ID_UNIQ' },
        { label: 'UPDATES.DATE', key: 'UPDATE_DATE' },
      ];
    });
  }

  // Fetch updates when the component is initialized
  getAllUpdates(): void {
    this.updateService.getUpdates().subscribe((updates: any[]) => {
      console.log(updates);
      this.updates.set(updates); // Update the signal with fetched updates
    });
  }

  // Get one update by ID
  getUpdateById = ({ ID }: any): void => {
    this.updateService.getUpdateById(ID).subscribe((update: any) => {
      console.log(update);
      this.update = update[0]; // Update the variable with the fetched update
    });
  };

  downloadUpdateFile = ({ ID_COUNTRY, ID_UNIQ }: any): void => {
    this.updateService
      .downloadUpdateFile(ID_COUNTRY, ID_UNIQ)
      .subscribe((blob: Blob) => {
        // Create a link element to trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `update_${ID_COUNTRY}_${ID_UNIQ}.zip`; // Set the desired file name
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  // Get all the countries
  getAllCountries = (): void => {
    this.countryService.getCountries().subscribe((countries: any[]) => {
      this.countries.set(countries); // Update the signal with fetched countries
    });
  };

  // Fetch updates on component initialization
  ngOnInit(): void {
    this.getAllUpdates(); // Call the method to fetch updates
    this.getAllCountries(); // Call the method to fetch countries
  }
}
