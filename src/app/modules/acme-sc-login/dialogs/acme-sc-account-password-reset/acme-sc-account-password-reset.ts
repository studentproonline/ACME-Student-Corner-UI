import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// validator
import { WhiteSpaceValidator } from '../../../../core/validators/acme-sc-whitespace-validator';

// models
import { IResetPasswordModel } from '../../Models/acme-sc-account-password-reset.model';

@Component({
    selector: 'acme-sc-account-password-reset',
    templateUrl: './acme-sc-account-password-reset.html',
    styleUrls: ['./acme-sc-account-password-reset.scss']
})
export class AcmeSCAccountPasswordResetComponent {
    accountPasswordResetFormGroup: any;
    isProgress = false;
    hide = true;
    otpGenerationMessage = '';

    constructor(public dialogRef: MatDialog, private formBuilder: FormBuilder, private acmeSCAccountService: AcmeSCAccountService,
        @Inject(MAT_DIALOG_DATA) public data: any, private snackBar: MatSnackBar,) {

        this.accountPasswordResetFormGroup = this.formBuilder.group({
            otpControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            emailControl: ['', [Validators.required, Validators.email]],
            passwordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace,
                ( control => this.confirmPassword ( control, this.accountPasswordResetFormGroup, 'confirmPasswordControl' ) )]],
            confirmPasswordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace,
                ( control => this.confirmPassword ( control, this.accountPasswordResetFormGroup, 'passwordControl' ) ) ] ]
        });
    }

    generateOTP(): void {
        const emailControl = 'emailControl';
        const email: any = this.accountPasswordResetFormGroup.controls[emailControl].value;

        // show progress
        this.isProgress = true;
        this.otpGenerationMessage = '';
        // call account service to generate OTP
        this.acmeSCAccountService.generateOtp(email).subscribe(
            value => {
                this.isProgress = false;
                this.otpGenerationMessage = 'OTP sent to your registered email id.';
            },
            err => {
                this.isProgress = false; // end progress
                this.otpGenerationMessage = 'Fail to generate OTP';
            }
        );
    }

    resetPassword(): void {
        const otpControl = 'otpControl';
        const passwordControl = 'passwordControl';
        const emailControl = 'emailControl';

        const otp: any = this.accountPasswordResetFormGroup.controls[otpControl].value;
        const email: any = this.accountPasswordResetFormGroup.controls[emailControl].value;
        const password: any = this.accountPasswordResetFormGroup.controls[passwordControl].value;

        const resetPassword: IResetPasswordModel = { otp, email, password };

         // show progress
         this.isProgress = true;
         this.otpGenerationMessage = '';

         this.acmeSCAccountService.resetPassword(resetPassword).subscribe(
            value => {
                this.isProgress = false;
                this.otpGenerationMessage = 'Your password is succesfully reset, login with new password.';
                this.snackBar.open('Your password is succesfully reset, login with new password', '', {
                    duration: 3000
                });
                this.dialogRef.closeAll();
            },
            err => {
                this.isProgress = false; // end progress
                this.otpGenerationMessage = 'Fail to reset password';
            }
         );
    }

    // validation method
    confirmPassword(control: FormControl, group: FormGroup, matchPassword: string) {
        if (!control.value || !group.controls[matchPassword].value || group.controls[matchPassword].value === control.value) {
            return null;
        }
        return { mismatch: true };
    }

    close($event): void {
        this.dialogRef.closeAll();
    }
}
