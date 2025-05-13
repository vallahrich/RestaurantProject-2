import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog.component';

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;

  const mockDialogData: ConfirmationDialogData = {
    title: 'Test Confirmation',
    message: 'Are you sure you want to test this?',
    confirmText: 'Yes, Test It',
    confirmColor: 'warn'
  };

  beforeEach(async () => {
    // Arrange - dialog ref spy
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData },
        { provide: MatDialogRef, useValue: spy }
      ]
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<ConfirmationDialogComponent>>;
  });

  beforeEach(() => {
    // Arrange - component creation
    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    // Assert
    expect(component).toBeTruthy();
  });

  it('should display the correct title and message', () => {
    // Arrange
    const dialogTitle = fixture.nativeElement.querySelector('h2');
    const dialogMessage = fixture.nativeElement.querySelector('mat-dialog-content p');
    
    // Assert
    expect(dialogTitle.textContent).toBe('Test Confirmation');
    expect(dialogMessage.textContent).toBe('Are you sure you want to test this?');
  });

  it('should show custom confirm button text and color', () => {
    // Arrange
    const confirmButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
    
    // Assert
    expect(confirmButton.textContent).toContain('Yes, Test It');
    expect(confirmButton.classList).toContain('mat-warn');
  });

  it('should use default confirm text when not provided', () => {
    // Arrange - data without custom confirm text
    TestBed.resetTestingModule();
    
    const defaultData: ConfirmationDialogData = {
      title: 'Default Test',
      message: 'Testing defaults'
    };
    
    TestBed.configureTestingModule({
      declarations: [ConfirmationDialogComponent],
      imports: [
        MatDialogModule,
        MatButtonModule
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: defaultData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();
    
    const defaultFixture = TestBed.createComponent(ConfirmationDialogComponent);
    defaultFixture.detectChanges();
    
    // Act
    const confirmButton = defaultFixture.nativeElement.querySelector('button[mat-raised-button]');
    
    // Assert
    expect(confirmButton.textContent).toContain('Confirm');
    expect(confirmButton.classList).toContain('mat-primary');
  });

  it('should close dialog with true when confirm button is clicked', () => {
    // Arrange
    const confirmButton = fixture.nativeElement.querySelector('button[mat-raised-button]');
    
    // Act
    confirmButton.click();
    
    // Assert
    expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with no value when cancel button is clicked', () => {
    // Arrange
    const cancelButton = fixture.nativeElement.querySelector('button[mat-dialog-close]:not([mat-raised-button])');
    
    // Act
    cancelButton.click();
    
    // Assert
    expect(dialogRefSpy.close).not.toHaveBeenCalledWith(true);
  });
});