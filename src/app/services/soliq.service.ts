import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { TTransfer } from '../interfaces/TypesTBase.interface';
import { ApiResponse } from '../interfaces/TypesABase.interface';
@Injectable({
  providedIn: 'root',
})
export class SoliqService {
  private baseUrl = `${environment.materialsUrl}/soliq`; // Centralized Base URL

  constructor(private http: HttpClient, private auth: AuthService) {} // Injecting HttpClient

  // Method to get the company by its inn
  getCompanyByInn(inn: string): Observable<any> {
    return this.http
      .get<ApiResponse<any>>(`${this.baseUrl}/company/${inn}`)
      .pipe(map((response) => response.data)); // Extracting the data from the response // Making the HTTP GET request
  }
}
