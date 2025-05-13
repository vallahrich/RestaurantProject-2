/**
 * Register Component
 *
 * Manages new user registration through a form interface.
 * Handles form state, validation, and registration API calls.
 *
 * Key features:
 * - Input validation for username, email, and password
 * - Password strength requirements enforcement
 * - Password confirmation matching validation
 * - Loading state management during registration
 * - Success/failure messaging
 * - Automatically redirects to login view after successful registration
 * - Emits completion event to parent component for tab switching
 */
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {
  @Output() registered = new EventEmitter<boolean>();
  
  // Form controls
  username: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)]);
  email: FormControl = new FormControl('', [Validators.required, Validators.email]);
  password: FormControl = new FormControl('', [Validators.required, Validators.minLength(6)]);
  confirmPassword: FormControl = new FormControl('', [Validators.required]);
  
  // Form group
  registerForm: FormGroup = new FormGroup({
    username: this.username,
    email: this.email,
    password: this.password,
    confirmPassword: this.confirmPassword
  });
  
  loading = false;
  error = '';
  success = '';
  hidePassword = true;
  hideConfirmPassword = true;
  passwordsNotMatching = false;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }
  
  ngOnInit(): void {
    // Setup password match validation
    this.confirmPassword.valueChanges.subscribe(() => {
      this.checkPasswordMatch();
    });
    
    this.password.valueChanges.subscribe(() => {
      if (this.confirmPassword.value) {
        this.checkPasswordMatch();
      }
    });
  }
  
  checkPasswordMatch(): void {
    this.passwordsNotMatching = 
      this.password.value !== this.confirmPassword.value &&
      this.confirmPassword.value.length > 0;
  }
  
  onSubmit(): void {
    // Check if form is valid
    if (!this.registerForm.valid || this.passwordsNotMatching) {
      return;
    }

    this.loading = true;
    this.authService.register(
      this.username.value,
      this.email.value,
      this.password.value
    ).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Registration successful! You can now login.';
        this.error = '';
        
        // Notify parent component to switch to login view
        setTimeout(() => {
          this.registered.emit(true);
        }, 1500);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 409) {
          this.error = 'Username or email already exists.';
        } else {
          this.error = 'Registration failed. Please try again.';
        }
        this.loading = false;
        this.success = '';
      }
    });
  }
}