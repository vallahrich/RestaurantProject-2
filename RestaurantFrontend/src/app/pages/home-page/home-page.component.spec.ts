import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { of } from 'rxjs';

import { HomePageComponent } from './home-page.component';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantCardComponent } from '../../shared/ui/restaurant-card/restaurant-card.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let restaurantServiceSpy: jasmine.SpyObj<RestaurantService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Create spies for the services
    const restSpy = jasmine.createSpyObj('RestaurantService', ['getAllRestaurants']);
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn', 'currentUser']);
    
    // Setup the return values
    restSpy.getAllRestaurants.and.returnValue(of([]));
    authSpy.isLoggedIn.and.returnValue(false);
    authSpy.currentUser = of(null);
    
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatCardModule,
        MatDividerModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatButtonModule
      ],
      declarations: [
        HomePageComponent,
        RestaurantCardComponent
      ],
      providers: [
        { provide: RestaurantService, useValue: restSpy },
        { provide: AuthService, useValue: authSpy }
      ]
    }).compileComponents();

    restaurantServiceSpy = TestBed.inject(RestaurantService) as jasmine.SpyObj<RestaurantService>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});