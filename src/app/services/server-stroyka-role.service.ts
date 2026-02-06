import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ApiResponse, TServerStroykaRoles } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class ServerStroykaRoleService {
  private baseUrl = `${environment.apiUrl}/server-stroyka-roles`; // Centralized Base URL

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}
  // Fetch all users
    getRoles(): Observable<TServerStroykaRoles[]> {
        return this.http
        .get<ApiResponse<TServerStroykaRoles[]>>(`${this.baseUrl}/`)
        .pipe(map((res) => res.data));
    }
}