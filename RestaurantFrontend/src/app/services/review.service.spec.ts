import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from 'src/environments/enviroment';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/review`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
    
    localStorage.setItem('authHeader', 'Basic am9obi5kb2U6VmVyeVNlY3JldCE=');
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get reviews by restaurant ID', (done) => {
    // Mock API response
    const mockApiResponse = [
      {
        reviewId: 1,
        userId: 1,
        restaurantId: 1,
        rating: 4,
        comment: 'Great food!',
        createdAt: '2025-05-01T12:00:00.000Z',
        username: 'john.doe' // Include username in the mock API response
      }
    ];

    service.getReviewsByRestaurantId(1).subscribe(reviews => {
      expect(reviews.length).toBe(1);
      expect(reviews[0].reviewId).toBe(1);
      expect(reviews[0].rating).toBe(4);
      expect(reviews[0].username).toBe('john.doe');
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/restaurant/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockApiResponse);
  });

  it('should create a new review', (done) => {
    const newReview = {
      reviewId: 0,
      userId: 1,
      restaurantId: 1,
      rating: 5,
      comment: 'Excellent service!',
      createdAt: new Date(),
      username: undefined // Include the username property that will be added by the service
    };

    const returnedReview = {
      ...newReview,
      reviewId: 5,
      createdAt: '2025-05-05T09:07:37.624Z'
    };

    service.createReview(newReview).subscribe(review => {
      expect(review.reviewId).toBe(5);
      expect(review.rating).toBe(5);
      done();
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush(returnedReview);
  });
});