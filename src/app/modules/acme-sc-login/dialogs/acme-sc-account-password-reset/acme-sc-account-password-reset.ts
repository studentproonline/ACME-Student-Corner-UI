import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// validator
import { WhiteSpaceValidator } from '../../../../core/validators/acme-sc-whitespace-validator';

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
            passwordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            confirmPasswordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace,
                ( control => this.confirmPassword ( control, this.accountPasswordResetFormGroup, 'passwordControl' ) ) ] ]
        });
    }

    generateOTP(): void {
        const otpControl = 'otpControl';
        const passwordControl = 'passwordControl';
        const emailControl = 'emailControl';

        const otp: any = this.accountPasswordResetFormGroup.controls[otpControl].value;
        const email: any = this.accountPasswordResetFormGroup.controls[emailControl].value;
        const password: any = this.accountPasswordResetFormGroup.controls[passwordControl].value;

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
