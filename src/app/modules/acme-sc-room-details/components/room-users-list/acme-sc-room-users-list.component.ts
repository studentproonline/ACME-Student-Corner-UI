import { Component, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCShareRoomComponent } from '../../../shared/components/dialogs/share-room/acme-sc-share-room.component';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

//entities
import { IRoomUserEntity } from '../../../shared/entities/acme-sc-room-user.entity';

//translation
import { TranslateService } from '@ngx-translate/core';

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
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {

    }

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        const currentRoom: SimpleChange = changes.room;
        if (currentRoom) {
            this.room = currentRoom.currentValue;
            if (this.room) {
                this.getSharedRoomUserList();
                const userRoomRole = this.acmeSCAuthorizationService.getUserRoomRole();
                if(userRoomRole === 'Owner' || userRoomRole == 'Admin') {
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
                    this.sharedRoomUsersResponseMessage = this.translateService.instant('ROOM_DETAILS_USER_LIST_SERVER_ERROR');
                }
            }
        );
    }

    // share room
    shareRoom() {
        const dialogRef = this.dialog.open(AcmeSCShareRoomComponent, {
            width: '40vw',
            height: '40vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { room: this.room }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                //this.updateRoomStatus(status);
            }
        });
    }

    // remove user event
    roomUserRemoved($event) {
        this.getSharedRoomUserList();
    }

    // user role update event
    roomUserRoleUpdated($event) {
        this.getSharedRoomUserList();
    }
}