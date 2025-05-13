/**
 * Password Section Component
 *
 * Handles password change functionality within the user profile page.
 *
 * Key features:
 * - Form for entering current and new password
 * - Password validation and matching confirmation
 * - Password visibility toggles for all fields
 * - Security verification of current password before update
 * - Form state management during submission
 * - Success/error event emission to parent component
 */
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-password-section',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './password-section.component.html',
  styleUrls: ['./password-section.component.css']
})
export class PasswordSectionComponent implements OnInit {
  @Input() userId!: number;
  @Output() passwordUpdated = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();
  
  // Form controls
  currentPassword: FormControl = new FormControl('', [Validators.required]);
  newPassword: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);
  
  // Form group
  passwordForm: FormGroup = new FormGroup({
    currentPassword: this.currentPassword,
    newPassword: this.newPassword,
    confirmPassword: this.confirmPassword
  });
  
  loading = false;
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;
  passwordsNotMatching = false;
  
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}
  
  ngOnInit(): void {
    // Setup password match validation
    this.confirmPassword.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
    
    this.newPassword.valueChanges.subscribe(() => {
      if (this.confirmPassword.value) {
        this.checkPasswordMatch();
      }
    });
  }
  
  checkPasswordMatch(): void {
    this.passwordsNotMatching = 
      this.newPassword.value !== this.confirmPassword.value &&
      this.confirmPassword.value.length > 0;
  }
  
  onSubmit(): void {
    // Check if form is valid
    if (!this.passwordForm.valid || this.passwordsNotMatching) {
      return;
    }
    
    this.loading = true;
    
    this.userService.updatePassword(
      this.userId,
      this.currentPassword.value,
      this.newPassword.value
    ).subscribe({
      next: () => {
        this.loading = false;
        // Reset form
        this.passwordForm.reset();
        this.passwordUpdated.emit('Password updated successfully!');
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        if (err.status === 400) {
          this.error.emit('Current password is incorrect.');
        } else {
          this.error.emit('Failed to update password. Please try again.');
        }
        console.error('Error updating password:', err);
      }
    });
  }
}