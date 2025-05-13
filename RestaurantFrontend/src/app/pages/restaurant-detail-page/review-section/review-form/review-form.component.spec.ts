import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';

import { ReviewFormComponent } from './review-form.component';
import { ReviewService } from '../../../../services/review.service';
import { AuthService } from '../../../../services/auth.service';
import { Review } from '../../../../models/review.model';

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;
  let reviewServiceSpy: jasmine.SpyObj<ReviewService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Arrange - service spies
    const reviewSpy = jasmine.createSpyObj('ReviewService', ['createReview', 'updateReview']);
    const authSpy = jasmine.createSpyObj('AuthService', ['currentUserValue']);

    await TestBed.configureTestingModule({
      declarations: [ReviewFormComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();
    
    reviewServiceSpy = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    
    // Setup the currentUserValue spy
    Object.defineProperty(authServiceSpy, 'currentUserValue', {
      get: () => ({ userId: 1, username: 'testuser' })
    });
  });

  beforeEach(() => {
    // Arrange - component setup
    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    component.restaurantId = 1;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });
  
  it('should initialize with default values', () => {
    // Assert
    expect(component.reviewModel.userId).toBe(1);
    expect(component.reviewModel.restaurantId).toBe(1);
    expect(component.reviewModel.rating).toBe(5);
    expect(component.reviewModel.comment).toBe('');
  });
  
  it('should show different title based on edit mode', () => {
    // Arrange - no edit
    component.review = null;
    fixture.detectChanges();
    
    // Assert
    let title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Add Your Review');
    
    // Arrange - edit mode
    component.review = {
      reviewId: 1,
      userId: 1,
      restaurantId: 1,
      rating: 4,
      comment: 'Test review',
      createdAt: new Date()
    };
    component.ngOnInit(); // Re-initialize to copy the review
    fixture.detectChanges();
    
    // Assert
    title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Edit Your Review');
  });
  
  it('should call createReview when submitting new review', () => {
    // Arrange
    const mockReview: Review = {
      reviewId: 5,
      userId: 1, 
      restaurantId: 1,
      rating: 4,
      comment: 'Great restaurant!',
      createdAt: new Date()
    };
    reviewServiceSpy.createReview.and.returnValue(of(mockReview));
    component.reviewModel = {
      reviewId: 0,
      userId: 1,
      restaurantId: 1,
      rating: 4,
      comment: 'Great restaurant!',
      createdAt: new Date()
    };
    spyOn(component.reviewSubmitted, 'emit');
    
    // Mock form validity
    component.reviewForm = { valid: true } as any;
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(reviewServiceSpy.createReview).toHaveBeenCalledWith(component.reviewModel);
    expect(component.reviewSubmitted.emit).toHaveBeenCalledWith(mockReview);
    expect(component.loading).toBeFalse();
  });
  
  it('should call updateReview when editing an existing review', () => {
    // Arrange
    const existingReview: Review = {
      reviewId: 5,
      userId: 1, 
      restaurantId: 1,
      rating: 3,
      comment: 'Original review',
      createdAt: new Date()
    };
    const updatedReview: Review = {
      ...existingReview,
      rating: 5,
      comment: 'Updated review'
    };
    component.review = existingReview;
    component.ngOnInit(); // Copy the review to reviewModel
    
    // Update the model
    component.reviewModel.rating = 5;
    component.reviewModel.comment = 'Updated review';
    
    reviewServiceSpy.updateReview.and.returnValue(of(updatedReview));
    spyOn(component.reviewSubmitted, 'emit');
    
    // Mock form validity
    component.reviewForm = { valid: true } as any;
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(reviewServiceSpy.updateReview).toHaveBeenCalledWith(component.reviewModel);
    expect(component.reviewSubmitted.emit).toHaveBeenCalledWith(updatedReview);
    expect(component.loading).toBeFalse();
  });
  
  it('should handle error when review submission fails', () => {
    // Arrange
    const errorResponse = { status: 409, statusText: 'Conflict' };
    reviewServiceSpy.createReview.and.returnValue(throwError(() => errorResponse));
    
    // Mock form validity
    component.reviewForm = { valid: true } as any;
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(component.loading).toBeFalse();
    expect(component.error).toContain('already reviewed');
  });
  
  it('should emit canceled event when cancel button is clicked', () => {
    // Arrange
    spyOn(component.canceled, 'emit');
    
    // Act
    component.onCancel();
    
    // Assert
    expect(component.canceled.emit).toHaveBeenCalled();
  });
});