import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { City, ApiResponse } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root',
})
export class CityService {
  private baseUrl = `${environment.apiUrl}/cities`;

  constructor(private http: HttpClient) {}

  getCities(): Observable<City[]> {
    return this.http
      .get<ApiResponse<City[]>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }

  getCityById(id: number): Observable<City> {
    return this.http
      .get<ApiResponse<City>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  addCity(city: City): Observable<City> {
    return this.http
      .post<ApiResponse<City>>(`${this.baseUrl}/insert`, city)
      .pipe(map((res) => res.data));
  }

  updateCity(city: City): Observable<City> {
    return this.http
      .put<ApiResponse<City>>(`${this.baseUrl}/update/${city.id}`, city)
      .pipe(map((res) => res.data));
  }

  deleteCity(id: number): Observable<City> {
    return this.http
      .delete<ApiResponse<City>>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((res) => res.data));
  }

  /**
   * Filters cities by country ID.
   * If no list is passed, defaults to all cities.
   */
  filterCitiesByCountry(countryId: number, allCities: any[]): any[] {
    return allCities.filter((city) => city.id_country == countryId);
  }
}
