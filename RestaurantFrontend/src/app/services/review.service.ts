/**
 * Review Service
 * 
 * Service responsible for managing restaurant review operations throughout the application.
 * Provides methods to create, retrieve, update, and delete restaurant reviews via API calls.
 * 
 * Key features:
 * - Fetch all reviews for a specific restaurant
 * - Retrieve a specific user's review for a restaurant
 * - Create new restaurant reviews
 * - Update existing reviews
 * - Delete user reviews
 * 
 * The service handles API response transformation through a dedicated mapper method
 * that ensures consistency in the Review model structure. Error handling is implemented
 * for all operations with appropriate logging and error propagation.
 * 
 * Note: For 404 errors when fetching user reviews, errors are only propagated without
 * console logging since this is an expected condition when a user hasn't reviewed a restaurant.
 */

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Review } from '../models/review.model';
import { environment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = `${environment.apiUrl}/review`;

  constructor(private http: HttpClient) { }

  getReviewsByRestaurantId(restaurantId: number): Observable<Review[]> {
    return this.http.get<any[]>(`${this.apiUrl}/restaurant/${restaurantId}`).pipe(
      map(reviews => {
        return reviews.map(r => this.mapApiResponseToReview(r));
      }),
      catchError(error => {
        console.error('Error fetching reviews:', error);
        return throwError(() => error);
      })
    );
  }

  getUserReviewForRestaurant(userId: number, restaurantId: number): Observable<Review> {
    return this.http.get<any>(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`).pipe(
      map(r => this.mapApiResponseToReview(r)),
      catchError(error => {
        if (error.status !== 404) {
          console.error('Error fetching user review:', error);
        }
        return throwError(() => error);
      })
    );
  }

  createReview(review: Review): Observable<Review> {
    // Only send exactly what the API expects for a new review
    const payload = {
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: review.rating,
      comment: review.comment || ""
    };
    
    console.log('Creating review with payload:', JSON.stringify(payload));
    
    return this.http.post<any>(this.apiUrl, payload).pipe(
      map(r => this.mapApiResponseToReview(r)),
      catchError(error => {
        console.error('Error creating review:', error);
        return throwError(() => error);
      })
    );
  }
  
  updateReview(review: Review): Observable<Review> {
    // For update, we need to include the reviewId
    const payload = {
      reviewId: review.reviewId,
      userId: review.userId,
      restaurantId: review.restaurantId,
      rating: review.rating,
      comment: review.comment || ""
    };
    
    console.log('Updating review with payload:', JSON.stringify(payload));
    
    return this.http.put<any>(this.apiUrl, payload).pipe(
      map(r => this.mapApiResponseToReview(r)),
      catchError(error => {
        console.error('Error updating review:', error);
        return throwError(() => error);
      })
    );
  }

  deleteReview(userId: number, restaurantId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/user/${userId}/restaurant/${restaurantId}`).pipe(
      catchError(error => {
        console.error('Error deleting review:', error);
        return throwError(() => error);
      })
    );
  }

  // Helper method to consistently map API responses to our Review model
  private mapApiResponseToReview(rawResponse: any): Review {
    return {
      reviewId: rawResponse.reviewId,
      userId: rawResponse.userId,
      restaurantId: rawResponse.restaurantId,
      rating: rawResponse.rating,
      comment: rawResponse.comment || "",
      createdAt: rawResponse.createdAt,
      username: rawResponse.username || 
        (rawResponse.hasOwnProperty('user') ? (rawResponse as any).user?.username : undefined)
    };
  }
}