import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

import { ReviewItemComponent } from './review-item.component';
import { Review } from '../../../models/review.model';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;
  
  // Test review data
  const mockReview: Review = {
    reviewId: 1,
    userId: 1,
    restaurantId: 1,
    rating: 4,
    comment: 'Great food and service!',
    createdAt: new Date('2025-05-01'),
    username: 'john.doe'
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        DatePipe,
        ReviewItemComponent
      ]
    }).compileComponents();
  });
  
  beforeEach(() => {
    // Create component and set input properties
    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = mockReview;
    fixture.detectChanges();
  });
  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display the reviewer username', () => {
    const titleElement = fixture.nativeElement.querySelector('.review-header');
    expect(titleElement.textContent).toContain('john.doe');
  });
  
  it('should display the correct star rating', () => {
    // Test the star display for a 4-star rating
    const starsElement = fixture.nativeElement.querySelector('.rating-stars');
    expect(starsElement.textContent).toBe('★★★★☆'); // 4 filled stars, 1 empty

    // Test the helper method directly for different ratings
    expect(component.getRatingStars(5)).toBe('★★★★★');
    expect(component.getRatingStars(3)).toBe('★★★☆☆');
    expect(component.getRatingStars(1)).toBe('★☆☆☆☆');
  });
  
  it('should display the review comment', () => {
    const commentElement = fixture.nativeElement.querySelector('mat-card-content p');
    expect(commentElement.textContent).toBe('Great food and service!');
  });
  
  it('should not show edit/delete buttons for other users\' reviews', () => {
    // Set as not user's own review
    component.isOwnReview = false;
    fixture.detectChanges();
    
    // No action buttons should be present
    const actionButtons = fixture.nativeElement.querySelector('.review-actions');
    expect(actionButtons).toBeFalsy();
  });
  
  it('should show edit/delete buttons for user\'s own reviews', () => {
    // Set as user's own review
    component.isOwnReview = true;
    fixture.detectChanges();
    
    // Action buttons should be present
    const actionButtons = fixture.nativeElement.querySelector('.review-actions');
    expect(actionButtons).toBeTruthy();
  });
  
  it('should emit edit event when edit button clicked', () => {
    // Spy on the edit event emitter
    spyOn(component.editReview, 'emit');
    
    // Set as user's own review to show edit button
    component.isOwnReview = true;
    fixture.detectChanges();
    
    // Trigger edit
    component.onEdit();
    
    // Verify event emission
    expect(component.editReview.emit).toHaveBeenCalledWith(mockReview);
  });
  
  it('should ask for confirmation before deleting a review', () => {
    // Mock window.confirm to return true
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.deleteReview, 'emit');
    
    // Trigger delete
    component.onDelete();
    
    // Verify confirmation was requested
    expect(window.confirm).toHaveBeenCalled();
    expect(component.deleteReview.emit).toHaveBeenCalledWith(mockReview);
  });
  
  it('should not delete if the user cancels the confirmation', () => {
    // Mock window.confirm to return false
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.deleteReview, 'emit');
    
    // Trigger delete
    component.onDelete();
    
    // Verify deletion was aborted
    expect(window.confirm).toHaveBeenCalled();
    expect(component.deleteReview.emit).not.toHaveBeenCalled();
  });
});