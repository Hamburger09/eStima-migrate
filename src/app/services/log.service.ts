import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { ApiResponse, TLog, TLogs } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class LogService {
  private baseUrl = `${environment.apiUrl}/logs`; // Centralized Base URL

  constructor(private http: HttpClient) {}
  // Fetch all users
  getLogs(): Observable<TLog[]> {
    return this.http.get<ApiResponse<TLog[]>>(`${this.baseUrl}/`).pipe(
      // Extract the data property from the response
      map((response) => response.data)
    );
  }
  getLogsByPage(page: number, num: number): Observable<TLogs> {
    return this.http.get<ApiResponse<TLogs>>(
      `${this.baseUrl}/pages?page=${page}&num=${num}`
    ).pipe(
      map((response) => response.data)
    );
  }

  // Fetch logs by user ID
  getLogsByUserId(userId: number): Observable<TLog[]> {
    return this.http.get<ApiResponse<TLog[]>>(
      `${this.baseUrl}/user/${userId}`
    ).pipe(
      map((response) => response.data)
    );
  }

  getLogsByUserIdAndPage(userId: number, page: number, num: number): Observable<TLogs> {
    return this.http.get<ApiResponse<TLogs>>(
      `${this.baseUrl}/user/${userId}/pages?page=${page}&num=${num}`
    ).pipe(
      map((response) => response.data)
    );
  }
}
