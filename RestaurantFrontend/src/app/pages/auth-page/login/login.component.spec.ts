import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  beforeEach(async () => {
    // Create auth service spy
    const spy = jasmine.createSpyObj('AuthService', ['login']);
    spy.currentUserValue = null; // Set initial state as logged out
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        LoginComponent
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();
    
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  
  it('should create', () => {
    // Basic component creation test
    expect(component).toBeTruthy();
  });
    
  it('should toggle password visibility', () => {
    // Test password visibility toggle
    expect(component.hidePassword).toBeTrue();
    component.hidePassword = !component.hidePassword;
    expect(component.hidePassword).toBeFalse();
  });
  
  it('should call auth service login with form values on submit', () => {
    // Prepare mock response
    const mockUser = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date()
    };
    authServiceSpy.login.and.returnValue(of(mockUser));
    
    // Set form values
    component.username.setValue('testuser');
    component.password.setValue('password123');
    
    // Submit form
    component.onSubmit();
    
    // Verify auth service was called with correct values
    expect(authServiceSpy.login).toHaveBeenCalledWith('testuser', 'password123');
  });
  
  it('should not submit when form is invalid', () => {
    // Leave form empty to make it invalid
    component.username.setValue('');
    component.password.setValue('');
    
    // Submit form
    component.onSubmit();
    
    // Auth service should not be called
    expect(authServiceSpy.login).not.toHaveBeenCalled();
  });
});