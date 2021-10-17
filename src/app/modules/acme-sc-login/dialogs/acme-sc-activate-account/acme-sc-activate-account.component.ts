import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'acme-sc-activate-account',
    templateUrl: './acme-sc-activate-account.component.html',
    styleUrls: ['./acme-sc-activate-account.component.scss']
})
export class AcmeSCActivateAccountComponent {
    isProgress = false;
    constructor(public dialogRef: MatDialog, private acmeSCAccountService: AcmeSCAccountService,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,) {

    }

    // re-generate activation link
    resendEmailConfirmation(): void {
        // show progress
        this.isProgress = true;
        this.acmeSCAccountService.regenarateActivationLink(this.data.Email).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false; // end progress
                // success
                switch (response.code) {
                    case 'LINK_GENERATED':
                        this.snackBar.open('Activation link sent to email Id', '', {
                            duration: 3000
                        });
                        break;
                    case 'INVALID_STATUS':
                        this.snackBar.open('Fail to generate activation link, invalid user status', '', {
                            duration: 3000
                        });
                        break;
                    case 'ACCOUNT_ACTIVATED':
                        this.snackBar.open('User account is already activated', '', {
                            duration: 3000
                        });
                        break;
                    default:
                        this.snackBar.open('Fail to generate activation link, unknown error', '', {
                            duration: 3000
                        });
                        break;
                }
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    close($event): void {
        this.dialogRef.closeAll();
    }
}