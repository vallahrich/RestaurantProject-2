/**
 * Review Form Component
 *
 * Provides form interface for creating or editing restaurant reviews.
 *
 * Key features:
 * - Dual mode for creating new or editing existing reviews
 * - Star rating selection
 * - Comment field with character limit
 * - Form validation with error messaging
 * - Loading state management during submission
 * - Error handling for API failures with specific messaging
 * - Event emission for form submission or cancellation
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { Review } from 'src/app/models/review.model';
import { ReviewService } from 'src/app/services/review.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css']
})
export class ReviewFormComponent implements OnInit {
  @Input() restaurantId!: number;
  @Input() review: Review | null = null;
  @Output() reviewSubmitted = new EventEmitter<Review>();
  @Output() canceled = new EventEmitter<void>();
  
  // Form controls
  rating: FormControl = new FormControl(5, [Validators.required]);
  comment: FormControl = new FormControl('', [Validators.maxLength(1000)]);
  
  // Form group
  reviewForm: FormGroup = new FormGroup({
    rating: this.rating,
    comment: this.comment
  });
  
  loading = false;
  error = '';
  
  get isEditing(): boolean {
    return !!this.review;
  }
  
  get currentUserId(): number {
    return this.authService.currentUserValue?.userId ?? 0;
  }
  
  constructor(
    private reviewService: ReviewService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
    // If editing existing review, set form values
    if (this.review) {
      this.rating.setValue(this.review.rating);
      this.comment.setValue(this.review.comment);
    }
  }
  
  onSubmit(): void {
    // Check if form is valid
    if (!this.reviewForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    const reviewData: Review = {
      reviewId: this.isEditing ? this.review!.reviewId : 0,
      userId: this.currentUserId,
      restaurantId: this.restaurantId,
      rating: this.rating.value,
      comment: this.comment.value || '',
      createdAt: this.isEditing ? this.review!.createdAt : new Date()
    };
    
    if (this.isEditing) {
      this.reviewService.updateReview(reviewData).subscribe({
        next: (response) => {
          this.loading = false;
          this.reviewSubmitted.emit(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
    } else {
      this.reviewService.createReview(reviewData).subscribe({
        next: (response) => {
          this.loading = false;
          this.reviewSubmitted.emit(response);
        },
        error: (error: HttpErrorResponse) => {
          this.handleError(error);
        }
      });
    }
  }
  
  handleError(error: HttpErrorResponse): void {
    this.loading = false;
    
    if (error.status === 409) {
      this.error = 'You have already reviewed this restaurant.';
    } else if (error.status === 400) {
      this.error = 'Invalid review data. Please check your input.';
    } else if (error.status === 404) {
      this.error = 'Restaurant or user not found.';
    } else {
      this.error = `Error ${error.status}: ${error.statusText || 'Unknown error'}`;
    }
    console.error('Full error object:', error);
  }
  
  onCancel(): void {
    this.canceled.emit();
  }
}