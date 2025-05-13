import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;

  beforeEach(async () => {
    // Arrange - module setup
    await TestBed.configureTestingModule({
      declarations: [FilterBarComponent],
      imports: [
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        NoopAnimationsModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Arrange - component creation
    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    // Assert
    expect(component.filterForm.get('neighborhood')?.value).toBe('');
    expect(component.filterForm.get('cuisine')?.value).toBe('');
    expect(component.filterForm.get('priceRange')?.value).toBe('');
    expect(component.filterForm.get('dietaryOptions')?.value).toBe('');
  });

  it('should emit filter values when applyFilters is called', () => {
    // Arrange
    spyOn(component.filtersApplied, 'emit');
    component.filterForm.patchValue({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });

    // Act
    component.applyFilters();

    // Assert
    expect(component.filtersApplied.emit).toHaveBeenCalledWith({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });
  });

  it('should reset form and emit empty values when clearFilters is called', () => {
    // Arrange
    spyOn(component.filtersApplied, 'emit');
    component.filterForm.patchValue({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });

    // Act
    component.clearFilters();

    // Assert
    expect(component.filterForm.get('neighborhood')?.value).toBeNull();
    expect(component.filterForm.get('cuisine')?.value).toBeNull();
    expect(component.filterForm.get('priceRange')?.value).toBeNull();
    expect(component.filterForm.get('dietaryOptions')?.value).toBeNull();
    expect(component.filtersApplied.emit).toHaveBeenCalled();
  });

  it('should correctly populate filter options', () => {
    // Assert
    expect(component.neighborhoods.length).toBeGreaterThan(0);
    expect(component.cuisines.length).toBeGreaterThan(0);
    expect(component.neighborhoods).toContain('Nørrebro');
    expect(component.cuisines).toContain('Italian');
  });
});