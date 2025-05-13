/**
 * Root Application Component
 * 
 * Acts as the main entry point and container for the Copenhagen Restaurant Explorer application.
 * This standalone component provides the application shell structure, incorporating
 * consistent header and footer components with a dynamic content area managed by the router.
 * 
 * The component defines the basic layout framework that remains consistent across
 * all pages, while the RouterOutlet displays different page components based on
 * the current route.
 * 
 * This component has minimal logic, serving primarily as a structural container
 * for the application's main UI sections.
 */

import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Copenhagen Restaurant Explorer';
}