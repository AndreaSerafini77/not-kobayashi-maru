import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { ModalData } from "../detail-modal/detail-modal.component";

@Component({
    selector: 'detail-bottom-sheet',
    templateUrl: 'detail-bottom-sheet.component.html',
})
export class DetailBottomSheet {
    constructor(private _bottomSheetRef: MatBottomSheetRef<DetailBottomSheet>,
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: ModalData) { }

    openLink(event: MouseEvent): void {
        this._bottomSheetRef.dismiss();
        event.preventDefault();
    }
}