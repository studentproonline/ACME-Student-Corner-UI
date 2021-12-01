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
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {
    }

    ngOnInit() {
        this.owner ="Owner: " +this.room.email;
        this.roomLink = apiConfig.host + '/shareRoom?roomId='+this.room._id;
    }
    getHeight() {
        return {
            height: this.height
        };
    }

    
    enterRoom() {
        this.router.navigateByUrl('/roomDetails?roomId='+this.room._id +'&roomType='+this.roomType);
        this.roomClicked.emit(this.room);
    }

    // update room
    updateRoom(status: string) {
        let displayMessage: string;
        if (status === 'Locked') {
            displayMessage = 'User will no longer be able to post content in this room.'
        } else if (status === 'Deleted') {
            displayMessage = 'This action will permanently delete the room which cannot be undone.'
        } else if (status === 'Active') {
            displayMessage = 'This action will open room for content posting.'
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
                        this.snackBar.open('Room status is succesfully changed', '', {
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
            case 'My Rooms': {
                this.updateRoom(status);
                break;
            }
            case 'Favorites': {
                this.deleteFavoriteRoom();
                break;
            }
            case 'Shared with Me': {
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
                this.snackBar.open('Room is succesfully added to favorite list', '', {
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
                this.snackBar.open('Room is succesfully removed from favorite list', '', {
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
            width: this.acmesharedUiTuilitiesService.getShareRoomScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getShareScreenHeight(),
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
            data: { message: 'This action will remove you from the shared room.' }
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
        this.snackBar.open('Room invitation link copied to clipboard', '', {
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
                this.snackBar.open('Room is succesfully removed from favorite list', '', {
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
