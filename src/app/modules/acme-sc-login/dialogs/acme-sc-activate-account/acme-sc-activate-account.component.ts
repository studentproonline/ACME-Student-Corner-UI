import { Component, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-activate-account',
    templateUrl: './acme-sc-activate-account.component.html',
    styleUrls: ['./acme-sc-activate-account.component.scss']
})
export class AcmeSCActivateAccountComponent {
    isProgress = false;
    constructor(public dialogRef: MatDialog, private acmeSCAccountService: AcmeSCAccountService,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,
        private translateService: TranslateService) {

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
                        this.snackBar.open(this.translateService.instant('ACCOUNT_ACTIVATION_LINK_SENT_MESSAGE'), '', {
                            duration: 3000
                        });
                        break;
                    case 'INVALID_STATUS':
                        this.snackBar.open(this.translateService.instant('ACCOUNT_ACTIVATION_LINK_GENERATION_FAILED'), '', {
                            duration: 3000
                        });
                        break;
                    case 'ACCOUNT_ACTIVATED':
                        this.snackBar.open(this.translateService.instant('ACCOUNT_ACTIVATION_ALREADY_ACTIVATED'), '', {
                            duration: 3000
                        });
                        break;
                    default:
                        this.snackBar.open(this.translateService.instant('ACCOUNT_ACTIVATION_GENARATION_FAILED_UNKNOWN'), '', {
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