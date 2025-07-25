import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { LoaderComponent } from './additional/loader/loader.component';

@Component({
  selector: 'app-confirm-dialog',
  imports:[MatDialogModule, MatButtonModule, LoaderComponent],
  template: `
      <app-loader [loading]="loading" [type]="'loader-bubble'"></app-loader>
    <h2 mat-dialog-title>{{ data.title || 'Are you sure?' }}</h2>
    <mat-dialog-content>{{ data.message || 'Please confirm this action.' }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button  (click)="dialogRef.close(false)">Cancel</button>
     <button mat-flat-button class="warn formCancelBtn" (click)="dialogRef.close(true)">Delete</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  loading:boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
