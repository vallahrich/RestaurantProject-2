/**
 * Login Component
 *
 * Handles user authentication through a login form interface.
 * Manages form state, validation, and authentication API calls.
 *
 * Key features:
 * - Two-way form binding for username and password inputs
 * - Form validation with error messages
 * - Loading state management during authentication
 * - Password visibility toggle
 * - Successful login redirects to saved return URL
 * - Session expiration detection and messaging
 * - Development convenience with pre-populated test credentials
 */
import { Component, Input, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() returnUrl: string | null = '/';
  
  // Form controls
  username: FormControl = new FormControl('', [Validators.required]);
  password: FormControl = new FormControl('', [Validators.required]);
  
  // Form group
  loginForm: FormGroup = new FormGroup({
    username: this.username,
    password: this.password
  });
  
  loading = false;
  error = '';
  hidePassword = true;
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) { }
  
  ngOnInit(): void {
    // Redirect if already logged in
    if (this.authService.currentUserValue) { 
      this.router.navigate(['/']);
    }
    
    // Pre-populate with standard credentials
   /* this.username.setValue('john.doe');
    this.password.setValue('VerySecret!'); */
  }
  
  onSubmit(): void {
    // Check if form is valid
    if (!this.loginForm.valid) {
      return;
    }

    this.loading = true;
    this.error = '';
    
    this.authService.login(
      this.username.value,
      this.password.value
    ).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl || '/']);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.status === 401 
          ? 'Invalid username or password' 
          : 'Login failed. Please try again.';
        this.loading = false;
      }
    });
  }
}