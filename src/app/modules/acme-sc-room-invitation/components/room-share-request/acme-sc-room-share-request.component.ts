import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

//dialogs
import { AcmeSCGetRoomPublicDetailsComponent } from '../dialogs/room-public-details/acme-sc-room-public-details.component';

//services
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';

// validator
import { WhiteSpaceValidator } from '../../../../core/validators/acme-sc-whitespace-validator';

@Component({
    selector: 'acme-sc-room-share-request',
    templateUrl: './acme-sc-room-share-request.component.html',
    styleUrls: ['./acme-sc-room-share-request.component.scss']
})
export class AcmeSCSharedRoomShareRequestComponent implements OnInit {
    isProgress = false;
    isSuccessFull = true;
    invitationResponseMessage = '';
    roomId: string;
    sendRequestFormGroup: any;

    constructor(private route: ActivatedRoute, private router: Router, 
        private acmesharedRoomService: AcmesharedRoomService, private formBuilder: FormBuilder,
        public dialog: MatDialog) {
        this.sendRequestFormGroup = this.formBuilder.group({
            emailControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            nameControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]]
        });
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.roomId = params.roomId;
            });
    }

    sendRequest() {
        // show progress
        this.isProgress = true;
        this.isSuccessFull = false;
        // call account service to create account
        const emailControl = 'emailControl';
        const nameControl = 'nameControl';
        let body: any ={};
        body.roomId=this.roomId;
        body.inviteeEmail = this.sendRequestFormGroup.controls[emailControl].value;
        body.userName = this.sendRequestFormGroup.controls[nameControl].value;

        this.acmesharedRoomService.sendRequestToJoinRoom(body).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.isSuccessFull = true;
                this.invitationResponseMessage= 'Succesfully placed request to join room.'
            },
            err => {
                this.isProgress = false; // end progress
                this.invitationResponseMessage=err.error.description;
            }
        );
    }

    gotoLoginScreen() {
        this.router.navigateByUrl ( '/login' );
    }

    getRoomDetails() {
        const dialogRef = this.dialog.open(AcmeSCGetRoomPublicDetailsComponent, {
            width: '500px',
            height: '350px',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { roomId: this.roomId }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data ) {
               
            }
        });
    }
}
