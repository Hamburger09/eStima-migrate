import { Component, effect, OnInit, signal, ViewChild } from '@angular/core';
import { UpdateService } from 'src/app/services/update.service';
import { CountryService } from 'src/app/services/country.service';
import { TableColumn } from 'src/app/interfaces/column.interface';
import { TableComponent } from 'src/app/components/library/table/table.component';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-updates',
  imports: [SharedModule, TableComponent],
  templateUrl: './updates.component.html',
  styleUrl: './updates.component.scss',
})
export class UpdatesComponent implements OnInit {
  updates = signal<any[]>([]); // Signal to hold updates data
  update: any = {}; // Variable to hold a single update
  countries = signal<any[]>([]); // Signal to hold countries data

  updateColumns: TableColumn[] = [];

  constructor(
    private updateService: UpdateService,
    private countryService: CountryService
  ) {
    effect(() => {
      this.updateColumns = [
        { label: 'UPDATES.UPDATE_ID', key: 'id' }, // ✅ lowercase
        {
          label: 'UPDATES.COUNTRY',
          key: 'id_country', // ✅ lowercase
          editorType: 'dxSelectBox',
          lookup: {
            dataSource: this.countries(),
            valueExpr: 'id',
            displayExpr: 'name',
          },
        },
        { label: 'UPDATES.DATE', key: 'update_date' }, // ✅ lowercase
        { label: 'UPDATES.NAME', key: 'name' }, // ✅ lowercase (if you want to show it)
      ];
    });
  }

  // ✅ Helper function to convert object keys to lowercase
  private toLowerCaseKeys(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.toLowerCaseKeys(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        acc[key.toLowerCase()] = this.toLowerCaseKeys(obj[key]);
        return acc;
      }, {} as any);
    }
    return obj;
  }

  // Fetch updates when the component is initialized
  getAllUpdates(): void {
    this.updateService.getUpdates().subscribe((updates: any[]) => {
      console.log('Original updates:', updates);

      // ✅ Convert all keys to lowercase
      const lowercaseUpdates = this.toLowerCaseKeys(updates);
      console.log('Lowercase updates:', lowercaseUpdates);

      this.updates.set(lowercaseUpdates); // Update the signal with transformed updates
    });
  }

  // Get one update by ID
  getUpdateById = ({ id }: any): void => {
    this.updateService.getUpdateById(id).subscribe((update: any) => {
      console.log('Original update:', update);

      // ✅ Convert keys to lowercase
      const lowercaseUpdate = this.toLowerCaseKeys(update);
      console.log('Lowercase update:', lowercaseUpdate);

      this.update = lowercaseUpdate[0]; // Update the variable with the fetched update
    });
  };

  downloadUpdateFile = ({ id_country, id_uniq }: any): void => {
    this.updateService
      .downloadUpdateFile(id_country, id_uniq) // ✅ now lowercase params
      .subscribe((blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `update_${id_country}_${id_uniq}.zip`;
        a.click();
        window.URL.revokeObjectURL(url);
      });
  };

  // Get all the countries
  getAllCountries = (): void => {
    this.countryService.getCountries().subscribe((countries: any[]) => {
      // ✅ Convert countries to lowercase too if needed
      const lowercaseCountries = this.toLowerCaseKeys(countries);
      this.countries.set(lowercaseCountries);
    });
  };

  // Fetch updates on component initialization
  ngOnInit(): void {
    this.getAllUpdates();
    this.getAllCountries();
  }
}
