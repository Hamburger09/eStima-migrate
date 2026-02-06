import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

import { Country, ApiResponse } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class CountryService {
  private baseUrl = `${environment.apiUrl}/countries`; // Centralized Base URL

  constructor(private http: HttpClient) {}
  // Fetch all users
  getCountries(): Observable<Country[]> {
    return this.http
      .get<ApiResponse<Country[]>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }

  // Fetch a single country by ID
  getCountryById(id: number): Observable<Country> {
    return this.http
      .get<ApiResponse<Country>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  // add a new country
  addCountry(country: Country): Observable<Country> {
    return this.http
      .post<ApiResponse<Country>>(`${this.baseUrl}/insert`, country)
      .pipe(map((res) => res.data));
  }
  // Update an existing country
  updateCountry(country: Country): Observable<Country> {
    return this.http
      .put<ApiResponse<Country>>(
        `${this.baseUrl}/update/${country.id}`,
        country
      )
      .pipe(map((res) => res.data));
  }
  // Delete a country by ID
  deleteCountry(id: number): Observable<Country> {
    return this.http
      .delete<ApiResponse<Country>>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((res) => res.data));
  }
}
