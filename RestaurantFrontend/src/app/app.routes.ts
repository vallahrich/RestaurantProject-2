/**
 * Application Routing Configuration
 * 
 * Defines the main navigation routes for the Copenhagen Restaurant Explorer application.
 * Maps URL paths to specific page components and implements route protection.
 * 
 * Routes:
 * - Home page (default route)
 * - Authentication page (login/register)
 * - Restaurants listing page
 * - Restaurant detail page with dynamic ID parameter
 * - User profile page (protected by authentication guard)
 * - Wildcard route that redirects to home page
 * 
 * The authGuard ensures that only authenticated users can access the profile page.
 * Unauthenticated users attempting to access protected routes will be redirected
 * to the authentication page.
 */

import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { RestaurantsPageComponent } from './pages/restaurants-page/restaurant-page.component';
import { RestaurantDetailPageComponent } from './pages/restaurant-detail-page/restaurant-detail-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'auth', component: AuthPageComponent },
  { path: 'restaurants', component: RestaurantsPageComponent },
  { path: 'restaurant/:id', component: RestaurantDetailPageComponent },
  { path: 'profile', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];