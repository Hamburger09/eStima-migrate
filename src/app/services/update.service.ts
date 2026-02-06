import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class UpdateService {
  private baseUrl = `${environment.delphiUrl}/updates`; // Centralized Base URL
  // Centralized Base URL

  constructor(private http: HttpClient) {}

  // Fetch all users
  getUpdates(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map((response) => response.data) // Adjust based on actual API response structure
    );
  }

  // Fetch one update by ID
  getUpdateById(id: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/nbase4/update_list?user=admin&pass=admin&id=${id}`
    );
  }

  downloadUpdateFile(country_id: number, id_uniq: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/download`, {
      params: { country_id, id_uniq },
      responseType: 'blob', // Important for file downloads
    });
  }
}
