import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { RestaurantCardComponent } from './restaurant-card.component';
import { Restaurant } from '../../../models/restaurant.model';

describe('RestaurantCardComponent', () => {
  let component: RestaurantCardComponent;
  let fixture: ComponentFixture<RestaurantCardComponent>;
  
  // Mock restaurant data
  const mockRestaurant: Restaurant = {
    restaurantId: 1,
    name: 'Test Restaurant',
    address: '123 Test St',
    neighborhood: 'Downtown',
    openingHours: '9-5',
    cuisine: 'Italian',
    priceRange: 'M',
    dietaryOptions: 'Vegetarian options',
    createdAt: new Date()
  };
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        RestaurantCardComponent
      ]
    }).compileComponents();
  });
  
  beforeEach(() => {
    // Create component and set input
    fixture = TestBed.createComponent(RestaurantCardComponent);
    component = fixture.componentInstance;
    component.restaurant = mockRestaurant;
    fixture.detectChanges();
  });
  
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  
  it('should display the restaurant name', () => {
    // Check restaurant name is shown
    const titleElement = fixture.nativeElement.querySelector('mat-card-title');
    expect(titleElement.textContent).toContain('Test Restaurant');
  });
  
  it('should display cuisine and price range', () => {
    // Check subtitle shows cuisine and price
    const subtitleElement = fixture.nativeElement.querySelector('mat-card-subtitle');
    expect(subtitleElement.textContent).toContain('Italian');
    expect(subtitleElement.textContent).toContain('$$'); // M price range -> $$
  });
  
  it('should display the neighborhood', () => {
    // Check neighborhood is shown
    const content = fixture.nativeElement.querySelector('mat-card-content');
    expect(content.textContent).toContain('Downtown');
  });
  
  it('should display dietary options when available', () => {
    // Check dietary options are shown
    const content = fixture.nativeElement.querySelector('mat-card-content');
    expect(content.textContent).toContain('Vegetarian options');
  });
  
  it('should link to the restaurant detail page', () => {
    // Check link to detail page exists with correct ID
    const button = fixture.nativeElement.querySelector('a[mat-raised-button]');
    expect(button.textContent).toContain('View Details');
    expect(button.getAttribute('href')).toMatch(/\/restaurant\/1$/);
  });
  
  it('should convert price ranges to dollar signs', () => {
    // Test price range conversion helper method
    expect(component.getPriceRange('L')).toBe('$');
    expect(component.getPriceRange('M')).toBe('$$');
    expect(component.getPriceRange('H')).toBe('$$$');
    expect(component.getPriceRange('X')).toBe('$'); // Default for unknown
  });
});