import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private matSnack: MatSnackBar) {}

  successToast(message: string, action: string = 'X', duration: number = 3000) {
    this.matSnack.open(message, action, {
      duration,
      panelClass: ['toast-success'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
