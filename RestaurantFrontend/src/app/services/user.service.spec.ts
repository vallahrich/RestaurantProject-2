import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { environment } from 'src/environments/enviroment';
import { User } from '../models/user.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/user`;

  beforeEach(() => {
    // Arrange
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify there are no outstanding requests
    httpMock.verify();
  });

  it('should be created', () => {
    // Assert
    expect(service).toBeTruthy();
  });

  it('should get a user by id', () => {
    // Arrange
    const mockUser: User = {
      userId: 1,
      username: 'testuser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date('2025-05-05T09:07:37.624Z')
    };

    // Act
    service.getUserById(1).subscribe(user => {
      // Assert
      expect(user).toEqual(mockUser);
    });

    // Assert - check that the correct HTTP request was made
    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    
    // Respond with mock data
    req.flush(mockUser);
  });

  it('should update a user', () => {
    // Arrange
    const mockUser: User = {
      userId: 1,
      username: 'updateduser',
      email: 'test@example.com',
      passwordHash: 'hashedpassword',
      createdAt: new Date('2025-05-05T09:07:37.624Z')
    };

    // Act
    service.updateUser(mockUser).subscribe(user => {
      // Assert
      expect(user).toEqual(mockUser);
    });

    // Assert - check that the correct HTTP request was made
    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockUser);
    
    // Respond with mock data
    req.flush(mockUser);
  });

  it('should update a password', () => {
    // Arrange
    const userId = 1;
    const oldPassword = 'oldPassword';
    const newPassword = 'newPassword';
    const expectedRequest = {
      UserId: userId,
      OldPasswordHash: oldPassword,
      NewPasswordHash: newPassword
    };

    // Act
    service.updatePassword(userId, oldPassword, newPassword).subscribe(response => {
      // Assert
      expect(response).toBe('Password updated successfully');
    });

    // Assert - check that the correct HTTP request was made
    const req = httpMock.expectOne(`${apiUrl}/password`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(expectedRequest);
    
    // Respond with mock data
    req.flush('Password updated successfully', { 
      headers: { 'content-type': 'text/plain' } 
    });
  });

  it('should delete a user', () => {
    // Arrange
    const userId = 1;

    // Act
    service.deleteUser(userId).subscribe(response => {
      // Assert
      expect(response).toBe('User deleted');
    });

    // Assert - check that the correct HTTP request was made
    const req = httpMock.expectOne(`${apiUrl}/${userId}`);
    expect(req.request.method).toBe('DELETE');
    
    // Respond with mock data
    req.flush('User deleted');
  });
});