import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  beforeEach(async () => {
    // Create auth service spy
    const spy = jasmine.createSpyObj('AuthService', ['login', 'currentUserValue']);
    
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: spy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParams: {} },
            queryParams: of({})
          }
        }
      ]
    }).compileComponents();
    
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    Object.defineProperty(authServiceSpy, 'currentUserValue', { get: () => null });
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
    
  it('should show password when toggle is clicked', () => {
    // Initially password should be hidden
    expect(component.hidePassword).toBe(true);
    
    // Get the toggle button
    const button = fixture.nativeElement.querySelector('button[matSuffix]');
    button.click();
    
    expect(component.hidePassword).toBe(false);
  });
  
  it('should call auth service login on form submit', () => {
    // Prepare the successful login response
    const mockUser = {
      userId: 1,
      username: 'john.doe',
      email: 'john@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date()
    };
    authServiceSpy.login.and.returnValue(of(mockUser));
    
    // Make sure the loginModel has the expected values
    component.loginModel = {
      username: 'john.doe',
      password: 'VerySecret!'
    };
    
    // Mock the form to be valid
    component.loginForm = { valid: true } as any;
    
    // Trigger form submission
    component.onSubmit();
    
    // Check if auth service's login method was called with correct credentials
    expect(authServiceSpy.login).toHaveBeenCalledWith('john.doe', 'VerySecret!');
  });
  
  it('should disable submit button when loading', () => {
    // Set loading to true
    component.loading = true;
    
    // Force change detection to update the view
    fixture.detectChanges();
    
    // Get the submit button
    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    
    // Check if button is disabled
    expect(submitButton.disabled).toBeTruthy();
  });
});