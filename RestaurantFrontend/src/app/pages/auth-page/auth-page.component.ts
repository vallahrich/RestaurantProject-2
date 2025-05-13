/**
 * Auth Page Component
 *
 * Container component that manages the authentication page UI with tabbed interface
 * for switching between login and registration forms.
 *
 * Key features:
 * - Toggles between login and register components based on tab selection
 * - Preserves return URL from route parameters for post-login navigation
 * - Uses conditional rendering to improve performance by only mounting
 *   the active component (login or register)
 */
import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    MatTabsModule,
    LoginComponent,
    RegisterComponent
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent {
  showLogin = true;
  @Input() returnUrl: string | null = null;
  
  tabChanged(index: number): void {
    this.showLogin = index === 0;
  }
}