import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import { ApiResponse, Role, TServerStroykaUsers } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class ServerStroykaUserService {
  private baseUrl = `${environment.apiUrl}/server-stroyka-users`; // Centralized Base URL

  constructor(private http: HttpClient,
    private authService: AuthService
  ) {}
  // Fetch all users
    getUsers(userId: number): Observable<TServerStroykaUsers[]> {
        return this.http
        .get<ApiResponse<TServerStroykaUsers[]>>(`${this.baseUrl}/?user_id=${userId}`)
        .pipe(map((res) => res.data));
    }
    insertUser(user: TServerStroykaUsers): Observable<TServerStroykaUsers> {
        return this.http
        .post<ApiResponse<TServerStroykaUsers>>(`${this.baseUrl}/insert`, user)
        .pipe(map((res) => res.data));
    }
    getUserRoleCounts(users: TServerStroykaUsers[]): Record<number, number> {
      return users.reduce((acc, user) => {
        const roleId = +user.server_stroyka_role_id;
        if (!acc[roleId]) acc[roleId] = 0;
        acc[roleId]++;
        return acc;
      }, {} as Record<number, number>);
    }
}