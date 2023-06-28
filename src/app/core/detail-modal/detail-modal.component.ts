import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ModalData {
    id: number;
    title?: string;
    body?: string;
  }

@Component({
    selector: 'detail-modal',
    templateUrl: 'detail-modal.component.html',
    styleUrls: ['detail-modal.component.scss']
  })
  export class DetailModal {
    constructor(
      public dialogRef: MatDialogRef<DetailModal>,
      @Inject(MAT_DIALOG_DATA) public data: ModalData,
    ) {}

    onCloseClick(): void {
      this.dialogRef.close();
    }
  }
