import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from './services/auth.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let authServiceMock: Partial<AuthService>;

  beforeEach(async () => {
    // Create a mock AuthService
    authServiceMock = {
      currentUser: of(null),
      currentUserValue: null,
      isLoggedIn: () => false
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,  // Add this to provide HttpClient
        AppComponent  // Import AppComponent as a standalone component
      ],
      // Mock the AuthService dependency
      providers: [
        { provide: AuthService, useValue: authServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have the 'Copenhagen Restaurant Explorer' title`, () => {
    expect(app.title).toEqual('Copenhagen Restaurant Explorer');
  });

  it('should render header component', () => {
    const compiled = fixture.nativeElement;
    const headerElement = compiled.querySelector('app-header');
    expect(headerElement).toBeTruthy();
  });
});