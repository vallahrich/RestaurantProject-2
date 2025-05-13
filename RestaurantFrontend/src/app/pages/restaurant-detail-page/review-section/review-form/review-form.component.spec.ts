import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    // Create service spies
    const reviewSpy = jasmine.createSpyObj('ReviewService', ['createReview', 'updateReview']);
    const authSpy = jasmine.createSpyObj('AuthService', [], {
      // Mock currentUserValue as a property getter
      currentUserValue: { userId: 1, username: 'testuser' }
    });
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        ReviewFormComponent
      ],
      providers: [
        { provide: ReviewService, useValue: reviewSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();
    
    reviewServiceSpy = TestBed.inject(ReviewService) as jasmine.SpyObj<ReviewService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    // Create component and set required inputs
    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    component.restaurantId = 1;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    // Basic smoke test
    expect(component).toBeTruthy();
  });
  
  it('should initialize form with default values', () => {
    // Check default form values
    expect(component.rating.value).toBe(5);
    expect(component.comment.value).toBe('');
  });
  
  it('should change title based on edit mode', () => {
    // Check title in create mode
    let title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Add Your Review');
    
    // Set edit mode and check title changes
    const existingReview: Review = {
      reviewId: 1,
      userId: 1,
      restaurantId: 1,
      rating: 4,
      comment: 'Test review',
      createdAt: new Date()
    };
    component.review = existingReview;
    component.ngOnInit();
    fixture.detectChanges();
    
    title = fixture.nativeElement.querySelector('mat-card-title');
    expect(title.textContent).toContain('Edit Your Review');
  });
  
  it('should call createReview for new reviews', () => {
    // Setup mock response
    const mockResponse = {
      reviewId: 1,
      userId: 1,
      restaurantId: 1,
      rating: 5,
      comment: 'Great place',
      createdAt: new Date()
    };
    reviewServiceSpy.createReview.and.returnValue(of(mockResponse));
    
    // Spy on event emitter
    spyOn(component.reviewSubmitted, 'emit');
    
    // Set form values
    component.rating.setValue(5);
    component.comment.setValue('Great place');
    
    // Replace the form with a mock that will be considered valid
    component.reviewForm = { valid: true } as any;
    
    // Submit form
    component.onSubmit();
    
    // Verify createReview was called
    expect(reviewServiceSpy.createReview).toHaveBeenCalled();
    // Verify event was emitted
    expect(component.reviewSubmitted.emit).toHaveBeenCalledWith(mockResponse);
  });
  
  it('should call updateReview for existing reviews', () => {
    // Setup component in edit mode
    const existingReview: Review = {
      reviewId: 1,
      userId: 1,
      restaurantId: 1,
      rating: 3,
      comment: 'Original review',
      createdAt: new Date()
    };
    component.review = existingReview;
    component.ngOnInit();
    
    // Setup mock response
    const mockResponse = {
      ...existingReview,
      rating: 4,
      comment: 'Updated review'
    };
    reviewServiceSpy.updateReview.and.returnValue(of(mockResponse));
    
    // Spy on event emitter
    spyOn(component.reviewSubmitted, 'emit');
    
    // Update form values
    component.rating.setValue(4);
    component.comment.setValue('Updated review');
    
    // Replace the form with a mock that will be considered valid
    component.reviewForm = { valid: true } as any;
    
    // Submit form
    component.onSubmit();
    
    // Verify updateReview was called
    expect(reviewServiceSpy.updateReview).toHaveBeenCalled();
    // Verify event was emitted
    expect(component.reviewSubmitted.emit).toHaveBeenCalledWith(mockResponse);
  });
  
  it('should handle error when submission fails', () => {
    // Setup error response
    const errorResponse = { status: 409, statusText: 'Conflict' };
    reviewServiceSpy.createReview.and.returnValue(
      throwError(() => errorResponse)
    );
    
    // Replace the form with a mock that will be considered valid
    component.reviewForm = { valid: true } as any;
    
    // Submit form
    component.onSubmit();
    
    // Verify error handling occurred
    expect(component.loading).toBeFalse();
    expect(component.error).toBeTruthy();
  });
  
  it('should emit canceled event when cancel button clicked', () => {
    // Spy on event emitter
    spyOn(component.canceled, 'emit');
    
    // Trigger cancel
    component.onCancel();
    
    // Verify event was emitted
    expect(component.canceled.emit).toHaveBeenCalled();
  });
});