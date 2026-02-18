import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
import {
  ApiResponse,
  TServerStroykaRoles,
} from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class ServerStroykaService {
  private baseUrl = `${environment.estimaUrl}/server-stroyka`; // Centralized Base URL

  constructor(private http: HttpClient, private authService: AuthService) {}
  // Fetch all users
  getOneStroyka(client_id: string, id_stroyka: number): Observable<void> {
    return this.http
      .get<ApiResponse<void>>(`${this.baseUrl}/${client_id}/${id_stroyka}`)
      .pipe(map((res) => res.data));
  }
  deleteOneStroyka(
    client_id: string,
    id_stroyka: number,
    server_stroyka_id: number
  ): Observable<void> {
    return this.http
      .delete<ApiResponse<void>>(
        `${this.baseUrl}/delete/${client_id}/${id_stroyka}/${server_stroyka_id}`
      )
      .pipe(map((res) => res.data));
  }

  updateSmetaResourcePrice(
    smetaResource: any
  ) : Observable<any> {
    return this.http
      .put<ApiResponse<any>>(
        `${this.baseUrl}/update/smeta_resource_price/${this.authService.getUserClientIdFromStorage()}`,
        smetaResource
      )
      .pipe(map((res) => res.data));
  }
  
}
