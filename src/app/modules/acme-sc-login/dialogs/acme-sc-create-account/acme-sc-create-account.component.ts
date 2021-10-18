import { Component } from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IUser } from '../../Models/acme-sc-user.model';
import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';

//dialogs
import { AcmeSCActivateAccountComponent } from '../acme-sc-activate-account/acme-sc-activate-account.component';

// validator
import { WhiteSpaceValidator } from '../../../../core/validators/acme-sc-whitespace-validator';

@Component({
    selector: 'acme-sc-create-account',
    templateUrl: './acme-sc-create-account.component.html',
    styleUrls: ['./acme-sc-create-account.component.scss']
})
export class AcmeSCCreateAccountComponent {
    title = 'ACME-SC-Create-Account';
    createAccountFormGroup: any;
    hide = true;
    agreementCheck = true;
    isProgress = false;

    constructor(public dialogRef: MatDialog, private formBuilder: FormBuilder,
        private snackBar: MatSnackBar, private acmeSCAccountService: AcmeSCAccountService) {

        this.createAccountFormGroup = this.formBuilder.group({
            firstNameControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            lastNameControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            emailControl: ['', [Validators.required, Validators.email]],
            passwordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            confirmPasswordControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace,
                ( control => this.confirmPassword ( control, this.createAccountFormGroup, 'passwordControl' ) ) ] ]
        });
    }

    // create account
    createAccount(): void {

        const firstNameControl = 'firstNameControl';
        const lastNameControl = 'lastNameControl';
        const emailControl = 'emailControl';
        const passwordControl = 'passwordControl';

        const firstName: any = this.createAccountFormGroup.controls[firstNameControl].value;
        const lastName: any = this.createAccountFormGroup.controls[lastNameControl].value;
        const email: any = this.createAccountFormGroup.controls[emailControl].value;
        const password: any = this.createAccountFormGroup.controls[passwordControl].value;

        const user: IUser = { firstName, lastName, email, password };
        // show progress
        this.isProgress = true;

        // call account service to create account
        this.acmeSCAccountService.createAccount(user).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false; // end progress
                // success
                switch (response.code) {
                    case 'USER_ACOOUNT_PENDING':
                    case 'ENTITY_CREATED': {
                        this.dialogRef.closeAll();
                        this.openConfirmEmailDialog(email);
                        break;
                    }
                    case 'USER_ALREAY_EXISTS': {
                        this.snackBar.open('User account with given email id already exists', '', {
                            duration: 3000
                        });
                        break;
                    }
                    default: {
                        this.snackBar.open('Fail to create user account with unknown code', '', {
                            duration: 3000
                        });
                        break;
                    }
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

    // email confirmation dialog
    openConfirmEmailDialog(emailId: string): void {
        const dialogRef = this.dialogRef.open(AcmeSCActivateAccountComponent, {
            width: '500px',
            height: '250px',
            disableClose: true,
            data:{Email:emailId}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    // validation method
    confirmPassword(control: FormControl, group: FormGroup, matchPassword: string) {
        if (!control.value || !group.controls[matchPassword].value || group.controls[matchPassword].value === control.value) {
            return null;
        }
        return { mismatch: true };
    }

    // called when user change state of terms and condition checkbox
    agreementChange($event) {
        this.agreementCheck = $event.checked;
    }

    close($event): void {
        this.dialogRef.closeAll();
    }
}