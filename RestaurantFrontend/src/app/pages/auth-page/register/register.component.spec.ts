import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  
  beforeEach(async () => {
    // Create auth service spy
    const spy = jasmine.createSpyObj('AuthService', ['register']);
    
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        RegisterComponent
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
    fixture.detectChanges();
  });
  
  it('should create', () => {
    // Basic component creation test
    expect(component).toBeTruthy();
  });
  
  it('should validate password match', () => {
    // Test password match validation
    component.password.setValue('password123');
    component.confirmPassword.setValue('different');
    
    component.checkPasswordMatch();
    expect(component.passwordsNotMatching).toBeTrue();
    
    component.confirmPassword.setValue('password123');
    component.checkPasswordMatch();
    expect(component.passwordsNotMatching).toBeFalse();
  });
  
  it('should call register service on valid form submission', () => {
    // Setup mock response
    const mockUser = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date()
    };
    authServiceSpy.register.and.returnValue(of(mockUser));
    
    // Set form values
    component.username.setValue('testuser');
    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    component.checkPasswordMatch();
    
    // Submit form
    component.onSubmit();
    
    // Verify register was called with correct values
    expect(authServiceSpy.register).toHaveBeenCalledWith(
      'testuser', 'test@example.com', 'password123'
    );
    expect(component.success).toContain('Registration successful');
  });
  
  it('should handle registration error', () => {
    // Setup error response
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 409 }))
    );
    
    // Set form values
    component.username.setValue('existinguser');
    component.email.setValue('existing@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    
    // Submit form
    component.onSubmit();
    
    // Error message should be shown
    expect(component.error).toContain('already exists');
  });
  
  it('should emit registered event after successful registration', fakeAsync(() => {
    // Spy on event emitter
    spyOn(component.registered, 'emit');
    
    // Setup mock response
    authServiceSpy.register.and.returnValue(of({} as any));
    
    // Set form values
    component.username.setValue('testuser');
    component.email.setValue('test@example.com');
    component.password.setValue('password123');
    component.confirmPassword.setValue('password123');
    
    // Submit form
    component.onSubmit();
    
    // Advance timer for the setTimeout
    tick(1500);
    
    // Verify event was emitted
    expect(component.registered.emit).toHaveBeenCalledWith(true);
  }));
});