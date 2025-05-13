/**
 * Profile Page Component
 *
 * Container component for the user profile area that manages different
 * sections of user-related functionality.
 *
 * Key features:
 * - Fetches and displays current user data
 * - Manages profile sections (personal info, password, bookmarks)
 * - Coordinates communication between child components
 * - Handles success/error messaging for all profile operations
 * - Protected by authentication guard
 * - Auto-dismissing notifications for user feedback
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/models/user.model';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { PasswordSectionComponent } from './password-section/password-section.component';
import { BookmarksSectionComponent } from './bookmarks-section/bookmarks-section.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    ProfileInfoComponent,
    PasswordSectionComponent,
    BookmarksSectionComponent
  ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css']
})
export class ProfilePageComponent implements OnInit {
  user: User | null = null;
  successMessage = '';
  errorMessage = '';
  loading = false;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    this.loading = true;
    this.user = this.authService.currentUserValue;
    
    if (!this.user) {
      this.router.navigate(['/auth']);
      return;
    }
    
    // Get fresh user data from the API
    this.userService.getUserById(this.user.userId).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load user data. Please try again.';
        this.loading = false;
        console.error('Error loading user data:', error);
        
        //fall back to the stored user info if cant load user data
        this.user = this.authService.currentUserValue;
      }
    });
  }
  
  onProfileUpdated(message: string): void {
    this.successMessage = message;
    this.errorMessage = '';
    
    // Refresh user data
    this.user = this.authService.currentUserValue;
    
    // Scroll to top to show the success message
    window.scrollTo(0, 0);
    
    // Auto-dismiss the message after 3 seconds
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }
  
  onError(message: string): void {
    this.errorMessage = message;
    this.successMessage = '';
    
    // Scroll to top to show the error message
    window.scrollTo(0, 0);
  }
}