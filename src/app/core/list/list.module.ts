import { NgModule } from '@angular/core';
import { ListComponent } from './list.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DetailModal } from '../detail-modal/detail-modal.component';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { DetailBottomSheet } from '../detail-bottom-sheet/detail-bottom-sheet.component';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
    declarations: [
        ListComponent,
        DetailModal,
        DetailBottomSheet
    ],
    exports: [ListComponent],
    imports: [CommonModule, MatIconModule, MatTooltipModule, MatBottomSheetModule, MatButtonModule, MatCardModule, MatDialogModule]
})
export class ListModule { }
