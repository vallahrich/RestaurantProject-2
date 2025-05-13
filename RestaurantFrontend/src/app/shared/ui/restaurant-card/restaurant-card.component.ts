/**
 * Restaurant Card Component
 *
 * Reusable presentational component that displays restaurant information in a card format.
 *
 * Key features:
 * - Consistent display of restaurant details (name, cuisine, price range, etc.)
 * - Link to detailed restaurant page
 * - Price range formatting with currency symbols
 * - Conditional rendering of optional restaurant information
 * - Material design styling with hover effects
 */
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { Restaurant } from '../../../models/restaurant.model';

@Component({
  selector: 'app-restaurant-card',
  standalone: true,
  imports: [
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    NgIf
  ],
  templateUrl: './restaurant-card.component.html',
  styleUrls: ['./restaurant-card.component.css']
})
export class RestaurantCardComponent {
  @Input() restaurant!: Restaurant;
  
  getPriceRange(priceRange: string): string {
    switch(priceRange) {
      case 'L': return '$';
      case 'M': return '$$';
      case 'H': return '$$$';
      default: return '$';
    }
  }
}