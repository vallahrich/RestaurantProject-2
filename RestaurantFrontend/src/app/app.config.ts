/**
 * Application Configuration
 * 
 * Centralizes the application's global configuration settings and provider registration.
 * This file defines the core services, interceptors, and feature modules that are 
 * available throughout the application.
 * 
 * Key configurations:
 * - Routing setup with route definitions and component input binding
 * - HTTP client with authentication interceptor
 * - Animation support
 * - Any future application-wide providers and features
 */
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations()
  ]
};