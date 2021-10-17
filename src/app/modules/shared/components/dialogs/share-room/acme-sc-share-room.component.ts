import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// services
import { AcmesharedRoomService } from '../../../services/acme-sc-shared-room.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';

//models
import { ISharedRoomModel } from '../../../models/acme-sc-shared-room.model';

@Component({
    selector: 'acme-sc-share-room',
    templateUrl: './acme-sc-share-room.component.html',
    styleUrls: ['./acme-sc-share-room.component.scss']
})
export class AcmeSCShareRoomComponent {
    shareRoomFormGroup: any;
    isProgress = false;

    constructor(public dialogRef: MatDialogRef<AcmeSCShareRoomComponent>, private formBuilder: FormBuilder,
        private acmesharedRoomService: AcmesharedRoomService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject ( MAT_DIALOG_DATA ) public data: any) {

        this.shareRoomFormGroup = this.formBuilder.group({
            emailControl: ['', [Validators.required, , Validators.email]],
            nameControl: ['', [Validators.required] ]
        });
       
    }
    cancelShare() {
        this.dialogRef.close();
    }

    shareRoom() {
        const emailControl = 'emailControl';
        const nameControl = 'nameControl';
        
        const sharedRoom: ISharedRoomModel = {
          roomId: this.data.room._id,
          roomName: this.data.room.title,
          userEmail: this.shareRoomFormGroup.controls[emailControl].value, 
          userName:  this.shareRoomFormGroup.controls[nameControl].value
        };
        if(sharedRoom.userEmail.toUpperCase() === this.acmeSCAuthorizationService.getSession().email.toUpperCase()) {
            this.snackBar.open('You are an owner of this room, cannot share room to yourself', '', {
                duration: 3000
            });
            return;
        }
        // show progress
        this.isProgress = true;
        // call account service to create account
        this.acmesharedRoomService.sharedRoom(sharedRoom, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open('Room is succesfully shared with ' + this.shareRoomFormGroup.controls[emailControl].value, '', {
                    duration: 3000
                });
                this.dialogRef.close();
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }
}