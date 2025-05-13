import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user.model';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  beforeEach(async () => {
    // Create auth service spy
    const spy = jasmine.createSpyObj('AuthService', ['register']);
    
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();
    
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    
    // Set up mock for NgForm - this is important
    component.registerForm = {
      valid: true,
      resetForm: jasmine.createSpy('resetForm')
    } as unknown as NgForm;
    
    fixture.detectChanges();
  });
  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should validate password match', () => {
    component.registerModel.password = 'password123';
    component.registerModel.confirmPassword = 'differentpassword';
    
    component.checkPasswordMatch();
    
    expect(component.passwordsNotMatching).toBeTrue();
    
    component.registerModel.confirmPassword = 'password123';
    component.checkPasswordMatch();
    
    expect(component.passwordsNotMatching).toBeFalse();
  });
  
  it('should call register method and show success on successful registration', () => {
    // Prepare mock user response
    const mockUser: User = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date()
    };
    
    // Setup spy return value
    authServiceSpy.register.and.returnValue(of(mockUser));
    
    // Setup model data
    component.registerModel = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'testuser', 'test@example.com', 'password123'
    );
    expect(component.loading).toBeFalse();
    expect(component.success).toContain('Registration successful');
    expect(component.error).toBe('');
  });
  
  it('should handle registration error when user already exists', () => {
    // Setup spy return value for error
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 409 }))
    );
    
    // Setup model data
    component.registerModel = {
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    // Act
    component.onSubmit();
    
    // Assert
    expect(authServiceSpy.register).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
    expect(component.error).toContain('already exists');
    expect(component.success).toBe('');
  });
  
  it('should emit registered event after successful registration', fakeAsync(() => {
    // Setup spy for emit
    spyOn(component.registered, 'emit');
    
    // Prepare mock user response
    const mockUser: User = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date()
    };
    
    // Setup spy return value
    authServiceSpy.register.and.returnValue(of(mockUser));
    
    // Setup model data
    component.registerModel = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    };
    
    // Act
    component.onSubmit();
    
    // The emit is inside a setTimeout(1500) in the component,
    // so we need to advance the timer
    tick(1500);
    
    // Assert
    expect(component.registered.emit).toHaveBeenCalledWith(true);
  }));
});