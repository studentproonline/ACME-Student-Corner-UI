import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcmeSCCreateAccountComponent } from '../../dialogs/acme-sc-create-account/acme-sc-create-account.component';

import { ILoginModel } from '../../Models/acme-sc-login.model';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

import { AcmeSCLoginService } from '../../services/acme-sc-login.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeScCookiesService } from '../../../../core/services/acme-sc-cookies.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

//dialogs
import { AcmeSCActivateAccountComponent } from '../../dialogs/acme-sc-activate-account/acme-sc-activate-account.component';
import { AcmeSCAccountPasswordResetComponent } from '../../dialogs/acme-sc-account-password-reset/acme-sc-account-password-reset';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-login',
    templateUrl: './acme-sc-login.component.html',
    styleUrls: ['./acme-sc-login.component.scss']
})
export class AcmeSCLoginComponent {
    title = 'ACME-SC-Login';
    loginFormGroup: any;
    hide = true;
    isProgress = false;

    constructor(private formBuilder: FormBuilder, public dialog: MatDialog, private snackBar: MatSnackBar,
        private loginService: AcmeSCLoginService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeScCookiesService: AcmeScCookiesService, private router: Router,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public translateService: TranslateService) {
        this.loginFormGroup = this.formBuilder.group({
            emailControl: ['', [Validators.required, Validators.email]],
            passwordControl: ['', [Validators.required]],
            roleControl: ['Student']

        });
    }
    openCreateAccountDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCCreateAccountComponent, {
            width: '40vw',
            height: '70vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openAccountResetPasswordDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCAccountPasswordResetComponent, {
            width: '45vw',
            height: '60vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    login(): void {
        const emailControl = 'emailControl';
        const passwordControl = 'passwordControl';

        const email: any = this.loginFormGroup.controls[emailControl].value;
        const password: any = this.loginFormGroup.controls[passwordControl].value;

        if (email.trim() === '') {
            this.snackBar.open(this.translateService.instant('LOGIN_VALID_EMAIL_MESSAGE'), '', {
                duration: 3000
            });
            return;
        }

        if (password.trim() === '') {
            this.snackBar.open(this.translateService.instant('LOGIN_VALID_PASSWORD_MESSAGE'), '', {
                duration: 3000
            });
            return;
        }

        const loginDetails: ILoginModel = { email, password };
        // show progress
        this.isProgress = true;
        this.loginService.login(loginDetails).subscribe(
            value => {
                this.isProgress = false; // end progress
                const response: any = value;
                switch (response.code) {

                    case 'USER_LOGGEDIN': {
                        const loginEntity: ILoginEntity = response.data;
                        this.acmeSCAuthorizationService.setSession(loginEntity);
                        loginEntity.id=response.data.id;
                        this.acmeScCookiesService.setCookies(loginEntity);
                        this.router.navigateByUrl('/home?roomType='+this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME'));
                        return;
                    }
                    default: {
                        this.snackBar.open(this.translateService.instant('LOGIN_INVALID_RESPONSE_CODE'), '', {
                            duration: 3000
                        });
                        return;
                    }
                }
            },
            err => {
                this.isProgress = false; // end progress
                if (err.error) {
                    switch (err.error.code) {
                        case 'ACCOUNT_NOT_ACTIVE': {
                            const email: any = this.loginFormGroup.controls[emailControl].value
                            this.openConfirmEmailDialog(email);
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    if(err.status === 0) {
                        this.snackBar.open(err.message, '', {
                            duration: 3000
                        });
                        return;
                    }
                    this.snackBar.open(err.error.description, '', {
                        duration: 3000
                    });
                } else {
                    this.snackBar.open(this.translateService.instant('LOGIN_UNKNOWN_ERROR'), '', {
                        duration: 3000
                    });
                }
            }
        );
    }

    // email confirmation dialog
    openConfirmEmailDialog(emailId: string): void {
        const dialogRef = this.dialog.open(AcmeSCActivateAccountComponent, {
            width: '35vw',
            height: '32vh',
            disableClose: true,
            data: { Email: emailId }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
