// notification.service.ts
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '@shared/additional/confirm-dialog/confirm-dialog.component';
import { SnackbarComponent } from '@shared/additional/snackbar/snackbar.component';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar, private dialog: MatDialog) {}

  show(message: string, type: 'success' | 'info' | 'error' = 'info') {
    const className = `snackbar-${type}`;
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: message,
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: [className],
    });
  }

  confirm(title: string, message: string): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { title, message },
    });
    return dialogRef.afterClosed().toPromise();
  }
}
