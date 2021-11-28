import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//services
import { AcmesharedRoomService } from '../../../../shared/services/acme-sc-shared-room.service';

@Component({
    selector: 'acme-sc-room-public-details',
    templateUrl: './acme-sc-room-public-details.component.html',
    styleUrls: ['./acme-sc-room-public-details.component.scss']
})
export class AcmeSCGetRoomPublicDetailsComponent {
    isProgress = false;
    isSuccessFull = true;
    responseMessage ='';
    roomDetails: any ={};
    constructor(public dialogRef: MatDialogRef<AcmeSCGetRoomPublicDetailsComponent>, 
        private acmesharedRoomService: AcmesharedRoomService, @Inject ( MAT_DIALOG_DATA ) public data: any) {

    }

    ngOnInit() {
        this.getRoomPublicDetails();
    }

    getRoomPublicDetails() {
        // show progress
        this.isProgress = true;
        this.isSuccessFull = false;
        // call account service to create account
        this.acmesharedRoomService.getRoomPublicDetails(this.data.roomId).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.isSuccessFull = true;
                const response: any = value;
                this.roomDetails = response.data;
            },
            err => {
                this.isProgress = false; // end progress
                this.responseMessage=err.error.description;
            }
        );
    }

    close() {
        this.dialogRef.close();
    }
}
