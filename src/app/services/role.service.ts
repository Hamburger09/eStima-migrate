import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, Role } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class RoleService {
  private baseUrl = `${environment.estimaUrl}/roles`; // Centralized Base URL

  constructor(private http: HttpClient) {}
  // Fetch all users
  getRoles(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }

  // Fetch a single role by ID
  getRoleById(id: number): Observable<Role> {
    return this.http
      .get<ApiResponse<Role>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  // Add a new role
  addRole(role: any): Observable<Role> {
    return this.http
      .post<ApiResponse<Role>>(`${this.baseUrl}/insert`, role)
      .pipe(map((res) => res.data));
  }
  // Update an existing role
  updateRole(role: any): Observable<Role> {
    return this.http
      .put<ApiResponse<Role>>(`${this.baseUrl}/update/${role.id}`, role)
      .pipe(map((res) => res.data));
  }
  // Delete a role by ID
  deleteRole(id: number): Observable<Role> {
    return this.http
      .delete<ApiResponse<Role>>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((res) => res.data));
  }
}
