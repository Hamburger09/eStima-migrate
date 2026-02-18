import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, of, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

import { ApiResponse, User } from '../interfaces/TypesABase.interface';

@Injectable({
  providedIn: 'root', // Makes it available globally
})
export class UserService {
  private baseUrl = `${environment.estimaUrl}/users`; // Centralized Base URL

  constructor(private http: HttpClient) {}
  // Fetch all users
  getUsers(): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.baseUrl}/`)
      .pipe(map((res) => res.data));
  }

  // Example: Fetch a specific user by ID
  getUserById(id: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/${id}`)
      .pipe(map((res) => res.data));
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http
      .put<ApiResponse<User>>(`${this.baseUrl}/update/${id}`, user)
      .pipe(map((res) => res.data));
  }

  // Example: Add a new user
  addUser(user: User): Observable<User> {
    return this.http
      .post<ApiResponse<User>>(`${this.baseUrl}/insert`, user)
      .pipe(map((res) => res.data));
  }

  // Example: Delete a user by ID
  deleteUser(id: number): Observable<User> {
    return this.http
      .delete<ApiResponse<User>>(`${this.baseUrl}/delete/${id}`)
      .pipe(map((res) => res.data));
  }

  // get user by client id
  getByUserClientId(client_id: number): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}/client/${client_id}`)
      .pipe(map((res) => res.data));
  }

  // get all the users by transfers
  getAllUsersByTransfers(id: number): Observable<User[]> {
    return this.http
      .get<ApiResponse<User[]>>(`${this.baseUrl}/transfers/${id}`)
      .pipe(map((res) => res.data));
  }
}
