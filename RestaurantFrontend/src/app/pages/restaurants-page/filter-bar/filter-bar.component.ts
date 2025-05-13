/**
 * Filter Bar Component
 *
 * Provides filtering controls for restaurant listings.
 *
 * Key features:
 * - Form with multiple filter criteria (neighborhood, cuisine, price, dietary)
 * - Pre-populated filter options
 * - Reactive form implementation
 * - Clear filters functionality
 * - Event emission of filter criteria to parent component
 * - Responsive layout for various screen sizes
 */

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgFor,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.css']
})
export class FilterBarComponent implements OnInit {
  @Output() filtersApplied = new EventEmitter<any>();
  
  filterForm!: FormGroup;
  
  // Filter options
  neighborhoods: string[] = ['Nørrebro', 'Vesterbro', 'Østerbro', 'Indre By', 'Amager', 'Frederiksberg'];
  cuisines: string[] = ['Italian', 'Danish', 'Asian', 'Mexican', 'French', 'Indian', 'International'];
  
  constructor(private formBuilder: FormBuilder) {}
  
  ngOnInit(): void {
    this.filterForm = this.formBuilder.group({
      neighborhood: [''],
      cuisine: [''],
      priceRange: [''],
      dietaryOptions: ['']
    });
  }
  
  applyFilters(): void {
    this.filtersApplied.emit(this.filterForm.value);
  }
  
  clearFilters(): void {
    this.filterForm.reset();
    this.filtersApplied.emit(this.filterForm.value);
  }
}