import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';
import { IFavRoomModel } from '../../models/acme-sc-fav-room.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

// services
import { AcmeRoomService } from '../../services/acme-sc-room.service';
import { AcmeFavRoomService } from '../../services/acme-sc-fav-room.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

import { apiConfig } from '../../../../config/config';

//dialogs
import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';
import { AcmeSCShareRoomComponent } from '../../../shared/components/dialogs/share-room/acme-sc-share-room.component';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-card',
    templateUrl: './acme-sc-room-card.component.html',
    styleUrls: ['./acme-sc-room-card.component.scss']
})
export class AcmeSCRoomComponent implements OnInit {

    isProgress = false;
    owner: string;
    roomLink='';
    @Input() room: IRoomEntity
    @Input() roomType: string;
    @Input() height: string;
    @Input() width: string;


    @Output() roomClicked = new EventEmitter<IRoomEntity>();
    @Output() roomDeleted = new EventEmitter();
    @Output() favRoomDeleted = new EventEmitter();
    @Output() sharedRoomDeleted = new EventEmitter();

    constructor(private acmeRoomService: AcmeRoomService, private acmeFavRoomService: AcmeFavRoomService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService, private acmesharedRoomService: AcmesharedRoomService,
        private router: Router,private snackBar: MatSnackBar, public dialog: MatDialog,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public translateService: TranslateService) {
    }

    ngOnInit() {
        this.owner =this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_OWNER_LABEL') +this.room.email;
        this.roomLink = apiConfig.host + '/shareRoom?roomId='+this.room._id;
    }
    getHeight() {
        return {
            height: this.height
        };
    }

    getRoomDetails () {
        this.isProgress = true;
        this.acmeRoomService.getRoomById(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                const roomDetailsResponse = response.data;
                this.acmeSCAuthorizationService.setRoomDetails(roomDetailsResponse.room);
                this.acmeSCAuthorizationService.setUserRoomRole(roomDetailsResponse.role);
                sessionStorage.setItem('RoomDetails',JSON.stringify(roomDetailsResponse.room));
                sessionStorage.setItem('UserRoomRole',JSON.stringify(roomDetailsResponse.role));
                this.isProgress = false; // end progress
                this.router.navigateByUrl('/roomDetails?roomId='+this.room._id +'&roomType='+this.roomType);
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }
    
    enterRoom() {
        this.getRoomDetails();
        this.roomClicked.emit(this.room);
    }

    // update room
    updateRoom(status: string) {
        let displayMessage: string;
        if (status === 'Locked') {
            displayMessage = this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_CLOSE_ROOM');
        } else if (status === 'Deleted') {
            displayMessage = this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_PERMANENT_DELETE');
        } else if (status === 'Active') {
            displayMessage = this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_OPEN_ROOM');
        }
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: displayMessage }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.updateRoomStatus(status);
            }
        });
    }

    // update room status
    updateRoomStatus(status: string) {
        try {
            // show progress
            console.log('update room called')
            this.isProgress = true;
            let currentRoom = Object.assign({}, this.room)
            this.room.status = status;
            console.log("ROOM STATUS IS "+ this.room.status);
            this.acmeRoomService.updateRoom(this.room, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
                value => {
                    this.isProgress = false;

                    if (status === 'Deleted') {
                        this.roomDeleted.emit();
                    } else {
                        this.snackBar.open(this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_STATUS_CHANGE'), '', {
                            duration: 3000
                        });
                    }
                },
                err => {
                    this.isProgress = false; // end progress
                    this.room.status = currentRoom.status;
                    this.snackBar.open(err.error.description, '', {
                        duration: 3000
                    });
                }
            );

        }
        catch (error) {
            this.snackBar.open(error.message, '', {
                duration: 3000
            });
        }
    }

    // delete room
    deleteRoom(status: string) {
        switch (this.roomType) {
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME'): {
                this.updateRoom(status);
                break;
            }
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_FAVORITES'): {
                this.deleteFavoriteRoom();
                break;
            }
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_SHARED_WITH_ME'): {
                this.deleteShareRoom();
                break;
            }
            default:
                break;
        }
    }


    // add room to favorites
    addRoomToFavorites() {
        console.log('addRoomToFavorites called')
        this.isProgress = true;
        const favRoom: IFavRoomModel = {
            roomId: this.room._id
        };
        this.acmeFavRoomService.createFavRoom(favRoom, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_ADDED_TO_FAV_LIST'), '', {
                    duration: 3000
                });
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }

        );
    }

    // delete favorite room
    deleteFavoriteRoom() {
        console.log('deleteFavoriteRoom called')
        this.isProgress = true;
        const favRoom: IFavRoomModel = {
            roomId: this.room._id
        };
        this.acmeFavRoomService.deleteRoom(favRoom, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_FAV_LIST_REMOVED'), '', {
                    duration: 3000
                });
                this.sharedRoomDeleted.emit();
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
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
            if (result && result.data ) {
                //this.updateRoomStatus(status);
            }
        });
    }

    // delete share room
    deleteShareRoom() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_DELETE_SHARED_ROOM') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.removeUserFromSharedRoom();
            }
        });
    }

    // copy room link to clipboard
    copyRoomLinkToClipboard() {
        //
        this.snackBar.open(this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_LINK_COPIED_CLIPBOARD'), '', {
            duration: 3000
        });
    }

    // remove user from share room
    removeUserFromSharedRoom() {
        this.isProgress = true;
        const sharedRoom: any = {
            roomId: this.room._id
        };
        this.acmesharedRoomService.deleteSharedRoom(sharedRoom, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('EXPLORER_ROOM_ROOM_CARD_ROOM_REMOVED_FAV_LIST'), '', {
                    duration: 3000
                });
                this.favRoomDeleted.emit();
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
