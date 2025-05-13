/**
 * User Service
 * 
 * Service that handles user profile management operations throughout the application.
 * Provides methods to retrieve, update, and delete user information via API calls.
 * 
 * Key features:
 * - Fetch user details by user ID
 * - Update user profile information
 * - Change user password with verification
 * - Delete user accounts
 * 
 * All methods return Observables that emit the results of the API operations.
 * The password update method is specifically configured to handle text responses
 * from the server rather than JSON.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { PasswordUpdateRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { environment } from 'src/environments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) { }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}`, user);
  }

  updatePassword(userId: number, oldPassword: string, newPassword: string): Observable<any> {
    const request = {
      UserId: userId,
      OldPasswordHash: oldPassword,
      NewPasswordHash: newPassword
    };
    
    return this.http.put<any>(`${this.apiUrl}/password`, request, {
      responseType: 'text' as 'json' // Tell Angular to expect a text response
    });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}