import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-contact-information',
    templateUrl: './acme-sc-contact-information.component.html',
    styleUrls: ['./acme-sc-contact-information.component.scss']
})
export class AcmeSCContactinformationComponent {
    constructor(public dialogRef: MatDialogRef<AcmeSCContactinformationComponent>) {

    }


    close() {
        this.dialogRef.close();
    }
}