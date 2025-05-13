/**
 * Authentication Service
 * 
 * Core service that handles user authentication operations including login, 
 * registration, and logout functionality. This service maintains the current 
 * user state across the application using an RxJS BehaviorSubject.
 * 
 * Key features:
 * - Maintains user authentication state using BehaviorSubject
 * - Stores user credentials in localStorage for session persistence
 * - Provides methods for login, registration, and logout
 * - Offers helper methods to check authentication status
 * - Handles authentication header retrieval for API requests
 * 
 * The service communicates with the backend API for authentication operations
 * and stores the returned authorization header for subsequent API calls.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from '../models/user.model';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/user`;
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get authHeader(): string {
    return localStorage.getItem('authHeader') || '';
  }

  private getUserFromStorage(): User | null {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  login(username: string, password: string): Observable<User> {
    // Make login request with credentials
    return this.http.post<{user: User, headerValue: string}>(`${this.apiUrl}/login`, 
      { username, passwordHash: password }
    ).pipe(
      map(response => {
        // Store user details and auth header in local storage
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        localStorage.setItem('authHeader', response.headerValue);
        this.currentUserSubject.next(response.user);
        
        // Return just the user object to maintain the same API
        return response.user;
      })
    );
  }

  register(username: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, {
      username,
      email,
      passwordHash: password
    });
  }

  logout(): void {
    // Remove user and auth header from local storage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authHeader');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}