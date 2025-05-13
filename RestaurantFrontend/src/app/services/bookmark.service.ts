/**
 * Bookmark Service
 * 
 * Service that manages restaurant bookmarking functionality in the application.
 * Provides methods to interact with the bookmark-related endpoints of the API,
 * allowing users to save, retrieve, and remove restaurant bookmarks.
 * 
 * Key features:
 * - Retrieve all bookmarked restaurants for a specific user
 * - Check if a specific restaurant is bookmarked by a user
 * - Add new restaurant bookmarks
 * - Remove existing bookmarks
 * 
 * All methods return Observables that emit the results of the API calls,
 * following Angular's reactive programming pattern.
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bookmark } from '../models/bookmark.model';
import { Restaurant } from '../models/restaurant.model';
import { environment } from 'src/environments/enviroment';


@Injectable({
  providedIn: 'root'
})
export class BookmarkService {
  private apiUrl = `${environment.apiUrl}/Bookmark`;

  constructor(private http: HttpClient) { }

  getBookmarkedRestaurants(userId: number): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${this.apiUrl}/user/${userId}/restaurants`);
  }

  isBookmarked(userId: number, restaurantId: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check/${userId}/${restaurantId}`);
  }

  addBookmark(userId: number, restaurantId: number): Observable<any> {
    const bookmark = {
      userId: userId,
      restaurantId: restaurantId,
      createdAt: new Date()
    };
    
    return this.http.post(`${this.apiUrl}`, bookmark);
  }

  removeBookmark(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}/${restaurantId}`);
  }
}