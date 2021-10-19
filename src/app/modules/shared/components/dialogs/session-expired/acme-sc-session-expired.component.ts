import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
    selector: 'acme-sc-session-expired',
    templateUrl: './acme-sc-session-expired.component.html',
    styleUrls: ['./acme-sc-session-expired.component.scss']
})
export class AcmeSCSessionExpiredComponent {
    constructor(public dialogRef: MatDialogRef<AcmeSCSessionExpiredComponent>,
          @Inject ( MAT_DIALOG_DATA ) public data: any, private router: Router) {
    }

    gotoLoginPage() {
        this.router.navigateByUrl("/login");
        this.dialogRef.close();

    }
}
