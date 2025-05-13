import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/enviroment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/user`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Verify there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return user and store header value on successful login', (done) => {
    // Mock user and header response
    const mockResponse = {
      user: {
        userId: 1,
        username: 'john.doe',
        email: 'john@example.com',
        passwordHash: 'VerySecret!',
        createdAt: new Date()
      },
      headerValue: 'Basic am9obi5kb2U6VmVyeVNlY3JldCE='
    };

    service.login('john.doe', 'VerySecret!').subscribe(user => {
      // Check that the user object is returned
      expect(user).toEqual(mockResponse.user);
      
      // Check that values are stored in localStorage
      expect(localStorage.getItem('authHeader')).toBe('Basic am9obi5kb2U6VmVyeVNlY3JldCE=');
      expect(localStorage.getItem('currentUser')).toBe(JSON.stringify(mockResponse.user));
      
      // Check that currentUserValue is updated
      expect(service.currentUserValue).toEqual(mockResponse.user);
      
      done();
    });

    // Expect a POST request to the login endpoint
    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    
    // Respond with mock data
    req.flush(mockResponse);
  });

  it('should handle login failure', (done) => {
    service.login('wrong', 'password').subscribe({
      next: () => {
        // Should not reach here
        fail('Expected login to fail');
      },
      error: (error) => {
        // Should reach here
        expect(error).toBeTruthy();
        
        // No data should be stored in localStorage
        expect(localStorage.getItem('authHeader')).toBeNull();
        expect(localStorage.getItem('currentUser')).toBeNull();
        
        done();
      }
    });

    // Expect a POST request to the login endpoint
    const req = httpMock.expectOne(`${apiUrl}/login`);
    expect(req.request.method).toBe('POST');
    
    // Respond with an error
    req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
  });

  it('should remove user data on logout', () => {
    // Setup: store some data in localStorage
    const mockUser = { 
      userId: 1, 
      username: 'john.doe',
      email: 'john@example.com',
      passwordHash: 'VerySecret!',
      createdAt: new Date('2025-05-05T09:07:37.624Z')  // Convert string to Date object
    };
    localStorage.setItem('currentUser', JSON.stringify(mockUser));
    localStorage.setItem('authHeader', 'Basic am9obi5kb2U6VmVyeVNlY3JldCE=');
    
    // Initial state check - force a refresh of the behavior subject
    service['currentUserSubject'].next(mockUser);
    expect(service.currentUserValue).toEqual(mockUser);
    
    // Act: call logout
    service.logout();
    
    // Assert: data should be cleared
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(localStorage.getItem('authHeader')).toBeNull();
    expect(service.currentUserValue).toBeNull();
  });
});