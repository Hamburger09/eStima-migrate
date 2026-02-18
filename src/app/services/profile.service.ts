import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

import { City, ApiResponse, User } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private baseUrl = `${environment.estimaUrl}/profile`;

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }

  updateProfile(profileData: any): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/update`, profileData)
      .pipe(map((res) => res.data));
  }
}
