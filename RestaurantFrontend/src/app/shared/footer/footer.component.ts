/**
 * Footer Component
 *
 * Simple footer component displayed across the application.
 *
 * Key features:
 * - Displays copyright information with current year
 * - Consistent styling and positioning at bottom of layout
 * - Minimal, lightweight implementation
 */

import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}