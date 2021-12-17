import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { IRoomUserEntity } from '../../../shared/entities/acme-sc-room-user.entity';

//dialogs
import { AcmeSCUserConfirmationComponent} from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-user-item',
    templateUrl: './acme-sc-room-user-item.component.html',
    styleUrls: ['./acme-sc-room-user-item.component.scss']
})
export class AcmeSCRoomUserItemComponent {
    @Input() user: IRoomUserEntity
    @Input() canRemoveUser: boolean = false;
    @Output() roomUserRemoved = new EventEmitter<IRoomUserEntity>();
    @Output() roomUserRoleUpdated = new EventEmitter<IRoomUserEntity>();

    isProgress = false;

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedRoomService: AcmesharedRoomService, public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private translateService: TranslateService) {

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
                this.snackBar.open(action + this.translateService.instant('ROOM_DETAILS_USER_ITEM_JOINING'), '', {
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
            width: '32.5vw',
            height: '20vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_DETAILS_USER_ITEM_THIS_ACTION_WILL') + message + this.translateService.instant('ROOM_DETAILS_USER_ITEM_JOIN_THE_ROOM') }
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
            width: '32.5vw',
            height: '20vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_DETAILS_USER_ITEM_REMOVE_USER_WARNING') }
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
                this.snackBar.open(this.translateService.instant('ROOM_DETAILS_USER_ITEM_REMOVE_USER_SUCCESS'), '', {
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

    // update user role
    makeAdmin(istrue) {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '32.5vw',
            height: '20vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_DETAILS_USER_ITEM_UPDATE_ROLE_WARNING') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data === 'true') {
                this.updateUserRole(istrue);
            }
        });
    }

    updateUserRole(istrue) {
        this.isProgress = true;
        let body: any = {};
        body.roomId=this.user.roomId;
        body.userEmail = this.user.userEmail;
        if(istrue === 'true') {
            body.role = 'Admin';
        } else{
            body.role="Participant";
        }

        this.acmesharedRoomService.updateUserRole(body,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                this.snackBar.open(this.translateService.instant('ROOM_DETAILS_USER_ITEM_UPDATE_ROLE_SUCCESS'), '', {
                    duration: 3000
                });
                this.roomUserRoleUpdated.emit(this.user);
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
