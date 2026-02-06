import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class IpAddressService {
  private baseUrl = environment.apiUrl; // Centralized Base URL

  constructor(private http: HttpClient) {} // Injecting HttpClient

  // Method to get the IP address
  getIpAddress(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/ip-address`)
      .pipe(map((response) => response.data)); // Making the HTTP GET request
  }
}
