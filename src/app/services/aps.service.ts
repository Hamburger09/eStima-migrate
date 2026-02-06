import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApsService {
  private baseUrl = `${environment.apiUrl}/aps`;

  constructor(private http: HttpClient) {}

  getAccessToken(): Observable<{ access_token: string; expires_in: number }> {
    return this.http.get<{ access_token: string; expires_in: number }>(`${this.baseUrl}/auth/token`);
  }

  getModels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/models`);
  }

  uploadModel(data: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/models`, data);
  }

  getModelStatus(urn: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/models/status?urn=${urn}`);
  }
}
