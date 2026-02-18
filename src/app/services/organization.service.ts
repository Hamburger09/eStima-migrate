import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, Organization } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class OrganizationService {
  private baseUrl = `${environment.estimaUrl}/organizations`; // Centralized Base URL

  constructor(private http: HttpClient) {}
  // Fetch all users
  getOrganizations(): Observable<Organization[]> {
    return this.http
      .get<ApiResponse<Organization[]>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }
  // Fetch organization by ID
  getOrganizationById(id: number): Observable<Organization> {
    return this.http
      .get<ApiResponse<Organization>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  // Add new organization
  addOrganization(organization: Organization): Observable<Organization> {
    return this.http
      .post<ApiResponse<Organization>>(`${this.baseUrl}/insert`, organization)
      .pipe(map((res) => res.data));
  }

  // Update organization
  updateOrganization(organization: Organization): Observable<Organization> {
    return this.http
      .put<ApiResponse<Organization>>(
        `${this.baseUrl}/update/${organization.id}`,
        organization
      )
      .pipe(map((res) => res.data));
  }

  // Delete organization
  deleteOrganization(id: number): Observable<Organization> {
    return this.http
      .delete<ApiResponse<Organization>>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((res) => res.data));
  }
}
