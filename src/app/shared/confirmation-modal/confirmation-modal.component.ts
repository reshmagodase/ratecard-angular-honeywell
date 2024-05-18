import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  actionButton = "Clear";
  message = "Are you sure you want to clear text?"
  constructor(
    public dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
      if(this.data!=null && this.data!=undefined)
      {
        this.actionButton = this.data.actionButton;
        this.message = this.data.message;
      }
   }

  ngOnInit() {
  }

  clear() {
    this.dialogRef.close(true);
  }
}
