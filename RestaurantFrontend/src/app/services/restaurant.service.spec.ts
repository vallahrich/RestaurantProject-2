import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RestaurantService } from './restaurant.service';
import { environment } from 'src/environments/enviroment';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/restaurant`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RestaurantService]
    });
    
    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return restaurant with id 1', (done) => {
    // Set auth header in localStorage as shown in the lecture
    localStorage.setItem('authHeader', 'Basic am9obi5kb2U6VmVyeVNlY3JldCE=');
    
    const mockRestaurant = {
      restaurantId: 1,
      name: 'Test Restaurant',
      address: '123 Test St',
      neighborhood: 'Downtown',
      openingHours: '9-5',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian options',
      createdAt: new Date('2025-05-05T09:07:37.624Z')
    };

    service.getRestaurantById(1).subscribe(restaurant => {
      expect(restaurant).toEqual(mockRestaurant);
      done();
    });

    const req = httpMock.expectOne(`${apiUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurant);
  });
});