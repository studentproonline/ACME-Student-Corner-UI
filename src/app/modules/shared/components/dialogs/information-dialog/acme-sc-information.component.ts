import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-information',
    templateUrl: './acme-sc-information.component.html',
    styleUrls: ['./acme-sc-information.component.scss']
})
export class AcmeSCInformationComponent {

    constructor(public dialogRef: MatDialogRef<AcmeSCInformationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    closeDialog() {
        this.dialogRef.close();
    }
}