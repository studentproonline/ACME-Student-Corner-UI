import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IRoomUserEntity } from '../../../shared/entities/acme-sc-room-user.entity';

//dialogs
import { AcmeSCUserConfirmationComponent} from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';

@Component({
    selector: 'acme-sc-room-user-item',
    templateUrl: './acme-sc-room-user-item.component.html',
    styleUrls: ['./acme-sc-room-user-item.component.scss']
})
export class AcmeSCRoomUserItemComponent {
    @Input() user: IRoomUserEntity
    @Input() canRemoveUser: boolean = false;
    @Output() roomUserRemoved = new EventEmitter<IRoomUserEntity>();

    isProgress = false;

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedRoomService: AcmesharedRoomService, public dialog: MatDialog,
        private snackBar: MatSnackBar) {

    }

    approveReject(action) {
        this.isProgress = true;
        let body: any= {};
        body.roomId=this.user.roomId;
        body.inviteeEmail = this.user.userEmail;
        body.action = action;
        
        this.acmesharedRoomService.approveRejectRequest(body,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                this.snackBar.open(action + ' room joing request', '', {
                    duration: 3000
                });
                this.roomUserRemoved.emit(this.user);
            },
            err => {
                this.isProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    approveRejectUser(action, message) {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will ' + message + ' user request to join the room.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data === 'true') {
                this.approveReject(action);
            }
        });
    }

    // delete share room
    removeUser() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will remove user from the room.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data === 'true') {
                this.removeUserFromRoom();
            }
        });
    }

    removeUserFromRoom() {
        this.isProgress = true;
        this.acmesharedRoomService.removeSharedRoomUser(this.user,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                this.snackBar.open('Succesfully removed user from the room.', '', {
                    duration: 3000
                });
                this.roomUserRemoved.emit(this.user);
            },
            err => {
                this.isProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }
}
