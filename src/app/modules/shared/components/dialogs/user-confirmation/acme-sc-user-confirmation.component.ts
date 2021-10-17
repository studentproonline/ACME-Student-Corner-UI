import { Component,Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-user-confirmation',
    templateUrl: './acme-sc-user-confirmation.component.html',
    styleUrls: ['./acme-sc-user-confirmation.component.scss']
})
export class AcmeSCUserConfirmationComponent {
    constructor(public dialogRef: MatDialogRef<AcmeSCUserConfirmationComponent>, 
         @Inject ( MAT_DIALOG_DATA ) public data: any) {
        
    }
    // cancel operation
    close() {
        this.dialogRef.close();
    }
    // confirm operation
    confirm() {
        this.dialogRef.close({ data: 'true' });
    }
}
