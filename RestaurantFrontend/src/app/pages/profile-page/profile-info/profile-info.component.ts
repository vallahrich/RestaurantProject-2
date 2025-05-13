/**
 * Profile Info Component
 *
 * Manages display and editing of user profile information.
 *
 * Key features:
 * - Displays user details (username, email, join date)
 * - Toggles between view and edit modes
 * - Form validation for profile updates
 * - Loading state management during API operations
 * - Account deletion functionality with confirmation dialog
 * - Event emission for operation results
 * - Handles API errors with appropriate messaging
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgIf, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from 'src/app/models/user.model';
import { ConfirmationDialogComponent } from '../../../shared/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [
    NgIf,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  @Input() user!: User;
  @Output() profileUpdated = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  
  profileForm!: FormGroup;
  loading = false;
  submitted = false;
  isEditing = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.profileForm = this.formBuilder.group({
      username: [this.user.username, [Validators.required, Validators.minLength(3)]]
    });
  }
  
  // Convenience getter for form fields
  get f() { return this.profileForm.controls; }
  
  startEditing(): void {
    this.isEditing = true;
  }
  
  cancelEditing(): void {
    this.isEditing = false;
    this.profileForm.patchValue({
      username: this.user.username
    });
    this.submitted = false;
  }
  
  onSubmit(): void {
    this.submitted = true;
    
    if (this.profileForm.invalid) {
      return;
    }
    
    this.loading = true;
    
    const updatedUser: User = {
      ...this.user,
      username: this.f['username'].value
    };
    
    this.userService.updateUser(updatedUser).subscribe({
      next: (data) => {
        // Update local storage and current user
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
          const updatedCurrentUser = {
            ...currentUser,
            username: data.username
          };
          localStorage.setItem('currentUser', JSON.stringify(updatedCurrentUser));
          // Force refresh of the user in the auth service
          this.authService.logout();
          this.authService.login(data.username, this.user.passwordHash).subscribe();
        }
        
        this.loading = false;
        this.isEditing = false;
        this.profileUpdated.emit('Profile updated successfully!');
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.error.emit('Username is already taken.');
        } else {
          this.error.emit('Failed to update profile. Please try again.');
        }
        console.error('Error updating profile:', err);
      }
    });
  }
  
  deleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Account',
        message: 'Are you sure you want to delete your account? This action cannot be undone.',
        confirmText: 'Delete Account',
        confirmColor: 'warn'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loading = true;
        this.userService.deleteUser(this.user.userId).subscribe({
          next: () => {
            this.authService.logout();
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.loading = false;
            this.error.emit('Failed to delete account. Please try again.');
            console.error('Error deleting account:', err);
          }
        });
      }
    });
  }
}