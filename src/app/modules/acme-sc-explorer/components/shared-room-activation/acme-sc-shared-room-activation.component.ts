import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//services
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';

@Component({
    selector: 'acme-sc-shared-room-activation',
    templateUrl: './acme-sc-shared-room-activation.component.html',
    styleUrls: ['./acme-sc-shared-room-activation.component.scss']
})
export class AcmeSCSharedRoomActivationComponent implements OnInit {

    isProgress = false;
    isSuccessFull = false;
    activationResponseMessage = '';
    sharedLinkId: string;

    constructor(private route: ActivatedRoute, private router: Router, private acmesharedRoomService: AcmesharedRoomService) {

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.sharedLinkId = params.shareId;
                this.activateSharedRoom();
            });
    }

    gotoLoginScreen() {
        this.router.navigateByUrl ( '/login' );
    }

    activateSharedRoom() {
        this.isProgress = true;
        this.isSuccessFull = false;
        const sharedLink = {'sharedRoomLinkId': this.sharedLinkId}
        this.acmesharedRoomService.activateSharedRoom(sharedLink).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                switch (response.code) {
                    case 'ALREADY_EXISTS':{
                        this.activationResponseMessage = 'Room is already shared and activated';
                        return;
                    }
                    case 'SHARED_ROOM_CREATED': {
                        this.activationResponseMessage = 'Room is now shared with you, please login to access the room.';
                        return;
                    }
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.activationResponseMessage = err.error.description;
                } else {
                    this.activationResponseMessage = 'Server Error';
                }
            }
        );
    }
}