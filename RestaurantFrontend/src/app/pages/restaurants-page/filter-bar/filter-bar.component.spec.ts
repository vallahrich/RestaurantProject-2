import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { FilterBarComponent } from './filter-bar.component';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        FilterBarComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create component
    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    // Form should be initialized with empty defaults
    expect(component.filterForm.get('neighborhood')?.value).toBe('');
    expect(component.filterForm.get('cuisine')?.value).toBe('');
    expect(component.filterForm.get('priceRange')?.value).toBe('');
    expect(component.filterForm.get('dietaryOptions')?.value).toBe('');
  });

  it('should emit filter values when applying filters', () => {
    // Monitor event emission
    spyOn(component.filtersApplied, 'emit');
    
    // Set filter values
    component.filterForm.patchValue({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });

    // Apply filters
    component.applyFilters();

    // Verify events emitted with correct values
    expect(component.filtersApplied.emit).toHaveBeenCalledWith({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });
  });

  it('should reset form and emit empty values when clearing filters', () => {
    // Monitor event emission
    spyOn(component.filtersApplied, 'emit');
    
    // Set initial filter values
    component.filterForm.patchValue({
      neighborhood: 'Nørrebro',
      cuisine: 'Italian',
      priceRange: 'M',
      dietaryOptions: 'Vegetarian'
    });

    // Clear filters
    component.clearFilters();

    // Form should be reset (null values)
    expect(component.filterForm.get('neighborhood')?.value).toBeNull();
    expect(component.filterForm.get('cuisine')?.value).toBeNull();
    expect(component.filterForm.get('priceRange')?.value).toBeNull();
    expect(component.filterForm.get('dietaryOptions')?.value).toBeNull();
    
    // Event should be emitted with reset values
    expect(component.filtersApplied.emit).toHaveBeenCalled();
  });

  it('should provide predefined filter options', () => {
    // Verify default filter options are provided
    expect(component.neighborhoods.length).toBeGreaterThan(0);
    expect(component.cuisines.length).toBeGreaterThan(0);
    
    // Check a few expected values
    expect(component.neighborhoods).toContain('Nørrebro');
    expect(component.cuisines).toContain('Italian');
  });
});