import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';

import { IRoomModel } from '../../../models/acme-sc-room.model';

// services
import { AcmeRoomService } from '../../../services/acme-sc-room.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';

// validator
import { WhiteSpaceValidator } from '../../../../../core/validators/acme-sc-whitespace-validator';

@Component({
    selector: 'acme-sc-create-room',
    templateUrl: './acme-sc-create-room.component.html',
    styleUrls: ['./acme-sc-create-room.component.scss']
})
export class AcmeSCCreateRoomComponent {
    createRoomFormGroup: any;
    isProgress = false;
    constructor(public dialogRef: MatDialogRef<AcmeSCCreateRoomComponent>, private formBuilder: FormBuilder, private snackBar: MatSnackBar,
        private acmeRoomService: AcmeRoomService, private acmeSCAuthorizationService: AcmeSCAuthorizationService) {

        this.createRoomFormGroup = this.formBuilder.group({
            titleControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            descriptionControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]]
        });
    }

    createRoom() {

        const titleControl = 'titleControl';
        const descriptionControl = 'descriptionControl';

        const title: any = this.createRoomFormGroup.controls[titleControl].value;
        const description: any = this.createRoomFormGroup.controls[descriptionControl].value;
        
        const room: IRoomModel = {
            title, description,
            _id: ''
        };
        // show progress
        this.isProgress = true;
        // call account service to create account
        this.acmeRoomService.createRoom(room, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false; // end progress
                this.snackBar.open('Room is succesfully created', '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: room });
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    closeButtonClicked($event) {
        this.dialogRef.close();
    }
}