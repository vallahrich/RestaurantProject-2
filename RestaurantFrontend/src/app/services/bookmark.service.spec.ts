import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BookmarkService } from './bookmark.service';
import { environment } from 'src/environments/enviroment';

describe('BookmarkService', () => {
  let service: BookmarkService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Bookmark`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BookmarkService]
    });
    
    service = TestBed.inject(BookmarkService);
    httpMock = TestBed.inject(HttpTestingController);
    
    // Set auth header in localStorage as shown in the lecture
    localStorage.setItem('authHeader', 'Basic am9obi5kb2U6VmVyeVNlY3JldCE=');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get bookmarked restaurants for a user', (done) => {
    const mockRestaurants = [
      {
        restaurantId: 1,
        name: 'Restaurant 1',
        address: '123 Test St',
        neighborhood: 'Downtown',
        openingHours: '9-5',
        cuisine: 'Italian',
        priceRange: 'M',
        dietaryOptions: 'Vegetarian options',
        createdAt: new Date('2025-05-05T09:07:37.624Z')
      }
    ];

    service.getBookmarkedRestaurants(1).subscribe(restaurants => {
      expect(restaurants).toEqual(mockRestaurants);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/user/1/restaurants`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants);
  });

  it('should check if a restaurant is bookmarked', (done) => {
    service.isBookmarked(1, 2).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/check/1/2`);
    expect(req.request.method).toBe('GET');
    req.flush(true);
  });

  it('should add a bookmark', (done) => {
    service.addBookmark(1, 2).subscribe(result => {
      expect(result).toBeTruthy();
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      userId: 1,
      restaurantId: 2,
      createdAt: jasmine.any(Date)
    });
    req.flush({success: true});
  });
});