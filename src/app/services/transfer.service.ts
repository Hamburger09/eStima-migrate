import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { TTransfer } from '../interfaces/TypesTBase.interface';
import { ApiResponse } from '../interfaces/TypesABase.interface';
@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private baseUrl = `${environment.apiUrl}/transfers`; // Centralized Base URL

  constructor(private http: HttpClient, private auth: AuthService) {} // Injecting HttpClient

  // Method to get the list of constructions
  getTransfers(): Observable<TTransfer[]> {
    return this.http.get<ApiResponse<TTransfer[]>>(`${this.baseUrl}/`).pipe(
      map((response) => response.data) // Extracting the data from the response
    ); // Making the HTTP GET request
  }

  // Method to get a single construction by ID
  getTransferById(id: number): Observable<TTransfer> {
    return this.http
      .get<ApiResponse<TTransfer>>(`${this.baseUrl}/${id}`)
      .pipe(map((response) => response.data)); // Extracting the data from the response // Making the HTTP GET request
  }


  // Method to create a new transfer
  createTransfer(transfer: TTransfer): Observable<TTransfer> {
    return this.http
      .post<ApiResponse<TTransfer>>(`${this.baseUrl}/insert`, transfer)
      .pipe(map((response) => response.data)); // Extracting the data from the response // Making the HTTP POST request
  }

  // Method to update an existing transfer
  updateTransfer(transfer: TTransfer): Observable<TTransfer> {
    return this.http
      .put<ApiResponse<TTransfer>>(`${this.baseUrl}/update/${transfer.id}`, transfer)
      .pipe(map((response) => response.data)); // Extracting the data from the response // Making the HTTP PUT request
  }
}
