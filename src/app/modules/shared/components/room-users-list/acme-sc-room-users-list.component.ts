import { Component, Input, Output, EventEmitter } from '@angular/core';

//entities
import { IRoomUserEntity } from '../../entities/acme-sc-room-user.entity';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedRoomService } from '../../services/acme-sc-shared-room.service';

@Component({
    selector: 'acme-sc-room-users-list',
    templateUrl: './acme-sc-room-users-list.component.html',
    styleUrls: ['./acme-sc-room-users-list.component.scss']
})
export class AcmeSCRoomUsersListComponent {

    @Input() roomId: any;
    @Output() userClicked = new EventEmitter<IRoomUserEntity>();

    sharedRoomUsersList: IRoomUserEntity[] = [];

    isProgress = true;
    isSuccessFull = false;
    sharedRoomUsersResponseMessage = ''
    selectedUserId='';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedRoomService: AcmesharedRoomService) {

       
    }

    ngOnInit() {
        this.getSharedRoomUserList();
    }

    refreshUsersList() {
        this.getSharedRoomUserList();
    }

    onUserSelected($event) {
        this.selectedUserId = $event.userEmail;
        this.userClicked.emit( $event);
    }

    getSelected(user) {
        if(this.selectedUserId === user.userEmail) {
            return true;
        }
        return false;
    }

    getSharedRoomUserList() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmesharedRoomService.getSharedRoomUsers(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.sharedRoomUsersList = response.data;
                this.selectedUserId = this.sharedRoomUsersList[0].userEmail;
                this.userClicked.emit( this.sharedRoomUsersList[0]);
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

}