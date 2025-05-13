/**
 * Review Section Component
 *
 * Manages the reviews area within restaurant detail pages.
 *
 * Key features:
 * - Fetches reviews for specific restaurant
 * - Shows user's own review separately if exists
 * - Provides interface to add, edit, or delete reviews
 * - Conditionally renders review form based on user actions
 * - Handles authentication state to control available actions
 * - Loading state management and error handling
 * - Reviews count and empty state handling
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Review } from '../../../models/review.model';
import { ReviewService } from '../../../services/review.service';
import { AuthService } from '../../../services/auth.service';
import { ReviewItemComponent } from '../../../shared/ui/review-item/review-item.component';
import { ReviewFormComponent } from './review-form/review-form.component';

@Component({
  selector: 'app-review-section',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    ReviewItemComponent,
    ReviewFormComponent
  ],
  templateUrl: './review-section.component.html',
  styleUrls: ['./review-section.component.css']
})
export class ReviewSectionComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() isLoggedIn = false;
  
  reviews: Review[] = [];
  userReview: Review | null = null;
  loading = true;
  error = '';
  showReviewForm = false;
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.loadReviews();
    
    if (this.isLoggedIn) {
      this.checkUserReview();
    }
  }
  
  loadReviews(): void {
    this.loading = true;
    this.reviewService.getReviewsByRestaurantId(this.restaurantId).subscribe({
      next: (data) => {
        this.reviews = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load reviews.';
        this.loading = false;
        console.error('Error loading reviews:', error);
      }
    });
  }
  
  checkUserReview(): void {
    this.reviewService.getUserReviewForRestaurant(this.currentUserId, this.restaurantId).subscribe({
      next: (data) => {
        this.userReview = data;
      },
      error: (error) => {
        if (error.status !== 404) {
          console.error('Error checking user review:', error);
        }
      }
    });
  }
  
  onReviewSubmitted(review: Review): void {
    this.userReview = review;
    this.loadReviews();
    this.showReviewForm = false;
  }
  
  onReviewDeleted(review: Review): void {
    this.reviewService.deleteReview(review.userId, review.restaurantId).subscribe({
      next: () => {
        // Only update UI after successful deletion
        this.userReview = null;
        this.loadReviews();
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.error = 'Failed to delete review. Please try again.';
      }
    });
  }
  
  onEditReview(): void {
    this.showReviewForm = true;
  }
  
  isUserReview(review: Review): boolean {
    return this.isLoggedIn && review.userId === this.currentUserId;
  }
}