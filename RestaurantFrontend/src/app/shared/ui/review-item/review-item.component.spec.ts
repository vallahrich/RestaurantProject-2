import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReviewItemComponent } from './review-item.component';
import { Review } from '../../../models/review.model';

describe('ReviewItemComponent', () => {
  let component: ReviewItemComponent;
  let fixture: ComponentFixture<ReviewItemComponent>;
  
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
        MatTooltipModule
      ],
      declarations: [ReviewItemComponent]
    }).compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewItemComponent);
    component = fixture.componentInstance;
    component.review = mockReview;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display username', () => {
    const titleElement = fixture.nativeElement.querySelector('.review-header');
    expect(titleElement.textContent).toContain('john.doe');
  });
  
  it('should display rating stars correctly', () => {
    const starsElement = fixture.nativeElement.querySelector('.rating-stars');
    expect(starsElement.textContent).toBe('★★★★☆'); // 4 filled stars, 1 empty
    
    // Test the method directly
    expect(component.getRatingStars(5)).toBe('★★★★★');
    expect(component.getRatingStars(3)).toBe('★★★☆☆');
    expect(component.getRatingStars(1)).toBe('★☆☆☆☆');
  });
  
  it('should display review comment', () => {
    const commentElement = fixture.nativeElement.querySelector('mat-card-content p');
    expect(commentElement.textContent).toBe('Great food and service!');
  });
  
  it('should not show edit/delete buttons when not own review', () => {
    component.isOwnReview = false;
    fixture.detectChanges();
    
    const actionButtons = fixture.nativeElement.querySelector('.review-actions');
    expect(actionButtons).toBeFalsy();
  });
  
  it('should show edit/delete buttons when own review', () => {
    component.isOwnReview = true;
    fixture.detectChanges();
    
    const actionButtons = fixture.nativeElement.querySelector('.review-actions');
    expect(actionButtons).toBeTruthy();
    
    const editButton = fixture.nativeElement.querySelector('button[matTooltip="Edit Review"]');
    const deleteButton = fixture.nativeElement.querySelector('button[matTooltip="Delete Review"]');
    
    expect(editButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
  });
  
  it('should emit edit event when edit button clicked', () => {
    spyOn(component.editReview, 'emit');
    component.isOwnReview = true;
    fixture.detectChanges();
    
    component.onEdit();
    
    expect(component.editReview.emit).toHaveBeenCalledWith(mockReview);
  });
  
  it('should confirm before deleting', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    spyOn(component.deleteReview, 'emit');
    
    component.onDelete();
    
    expect(window.confirm).toHaveBeenCalled();
    expect(component.deleteReview.emit).toHaveBeenCalledWith(mockReview);
  });
  
  it('should not delete if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    spyOn(component.deleteReview, 'emit');
    
    component.onDelete();
    
    expect(window.confirm).toHaveBeenCalled();
    expect(component.deleteReview.emit).not.toHaveBeenCalled();
  });
});