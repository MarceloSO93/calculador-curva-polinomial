import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-coordinates-dialog-component',
  templateUrl: './coordinates-dialog-component.component.html',
  styleUrls: ['./coordinates-dialog-component.component.css']
})
export class CoordinatesDialogComponentComponent {

  formData = { x: null, y: null };

  constructor(
    public dialogRef: MatDialogRef<CoordinatesDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("data: ", data)
    if (data) {
      this.formData = {x: data.x, y: data.y}
    }
  }

  submitForm() {
    if (this.formData.x !== null && this.formData.y !== null) {
      this.dialogRef.close(this.formData);
    }
  }

}
