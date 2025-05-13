/**
 * Confirmation Dialog Component
 *
 * Reusable dialog component for confirming user actions.
 *
 * Key features:
 * - Customizable title and message
 * - Configurable button text and colors
 * - Standardized dialog layout
 * - Returns boolean result based on user selection
 * - Used throughout the application for destructive operations
 */

import { Component, Inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
    title: string;
    message: string;
    confirmText?: string;
    confirmColor?: 'primary' | 'accent' | 'warn';
}

@Component({
    selector: 'app-confirmation-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        MatButtonModule
    ],
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.css']
})
export class ConfirmationDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) { }
}