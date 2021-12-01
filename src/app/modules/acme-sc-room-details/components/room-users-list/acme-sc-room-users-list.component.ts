import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCShareRoomComponent } from '../../../shared/components/dialogs/share-room/acme-sc-share-room.component';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';


//entities
import { IRoomUserEntity } from '../../../shared/entities/acme-sc-room-user.entity';

@Component({
    selector: 'acme-sc-room-users-list',
    templateUrl: './acme-sc-room-users-list.component.html',
    styleUrls: ['./acme-sc-room-users-list.component.scss']
})
export class AcmeSCRoomUsersListComponent implements OnChanges {
    @Input() room: any;
    @Input() canAddUser: boolean = false;

    isProgress = true;
    isSuccessFull = false;
    sharedRoomUsersResponseMessage = ''
    isRoomOwner = false;

    sharedRoomUsersList: IRoomUserEntity[] = [];

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedRoomService: AcmesharedRoomService, public dialog: MatDialog,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        const currentRoom: SimpleChange = changes.room;
        if (currentRoom) {
            this.room = currentRoom.currentValue;
            if (this.room) {
                this.getSharedRoomUserList();
                if (this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
                    this.room.email.toUpperCase().trim()) {
                    this.isRoomOwner = true;
                }
            }

        }
    }

    refreshUsersList() {
        this.getSharedRoomUserList();
    }

    getSharedRoomUserList() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmesharedRoomService.getSharedRoomUsers(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.sharedRoomUsersList = response.data;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.sharedRoomUsersResponseMessage = err.error.description;
                } else {
                    this.sharedRoomUsersResponseMessage = 'Server Error';
                }
            }
        );
    }

    // share room
    shareRoom() {
        const dialogRef = this.dialog.open(AcmeSCShareRoomComponent, {
            width: this.acmesharedUiTuilitiesService.getShareRoomScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getShareScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { room: this.room }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data) {
                //this.updateRoomStatus(status);
            }
        });
    }

    // remove user event
    roomUserRemoved($event) {
        this.getSharedRoomUserList();
    }
}