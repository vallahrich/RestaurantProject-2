/**
 * Home Page Component
 *
 * Main landing page component that showcases the application's purpose
 * and displays featured restaurants to encourage exploration.
 *
 * Key features:
 * - Hero section with call-to-action buttons
 * - Featured restaurants display (limited to 6)
 * - Conditional UI elements based on authentication state
 * - Loading state management while fetching restaurant data
 * - Error handling for API failures
 * - Responsive layout for various screen sizes
 */

import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';

import { Restaurant } from '../../models/restaurant.model';
import { RestaurantService } from '../../services/restaurant.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantCardComponent } from '../../shared/ui/restaurant-card/restaurant-card.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    RouterLink,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    RestaurantCardComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  featuredRestaurants: Restaurant[] = [];
  isLoggedIn = false;
  loading = true;
  error = '';
  
  constructor(
    private restaurantService: RestaurantService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    
    // Subscribe to auth changes to update UI when login status changes
    this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
    });
    
    this.loadFeaturedRestaurants();
  }
  
  loadFeaturedRestaurants(): void {
    this.loading = true;
    this.restaurantService.getAllRestaurants().subscribe({
      next: (restaurants) => {
        this.featuredRestaurants = restaurants.slice(0, 6);
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load featured restaurants.';
        this.loading = false;
        console.error('Error loading restaurants:', error);
      }
    });
  }
}