import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeRoomService } from '../../services/acme-sc-room.service';
import { AcmeFavRoomService } from '../../services/acme-sc-fav-room.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

// dialogs
import { AcmeSCCreateRoomComponent } from '../dialogs/create-room/acme-sc-create-room.component';
import { Observable } from 'rxjs';
import { filter } from 'rxjs-compat/operator/filter';

@Component({
    selector: 'acme-sc-rooms-list',
    templateUrl: './acme-sc-rooms-list.component.html',
    styleUrls: ['./acme-sc-rooms-list.component.scss']
})
export class AcmeSCRoomsListComponent implements OnInit, OnChanges {

    @Input() roomType = 'My Rooms';
    @Input() filterText = '';

    roomsList: IRoomEntity[] = [];
    filteredRoomsList: IRoomEntity[] = [];
    isProgress = false;
    isSuccesfull = true;

    // your current result based on filters input
    filteredOptions: Observable<string[]>;


    constructor(public dialog: MatDialog, private acmeRoomService: AcmeRoomService,
        private acmeFavRoomService: AcmeFavRoomService,
        private acmesharedRoomService: AcmesharedRoomService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService) {

    }
    ngOnInit() {

    }

    private filterRooms(value: string): IRoomEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.roomsList;
        } else {
            return this.roomsList.filter(roomsList => roomsList.title.toLowerCase().includes(filterValue));
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const currentacademicSession: SimpleChange = changes.roomType;
        if(currentacademicSession) {
            this.roomType = currentacademicSession.currentValue;
            this.getRooms();
        }

        const filterSearchText: SimpleChange = changes.filterText;
        if(filterSearchText) {
            this.filteredRoomsList=this.filterRooms(filterSearchText.currentValue);
        }
    }
    getRoomsList() {
        this.isProgress = true;
        this.acmeRoomService.getRooms(this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                const response: any = value;
                this.roomsList = response.data;
                this.filteredRoomsList= this.roomsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccesfull = false;
            }
        );
    }

    getFavRoomsList() {
        this.isProgress = true;
        this.acmeFavRoomService.getFavRooms(this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                const response: any = value;
                this.roomsList = response.data;
                this.filteredRoomsList= this.roomsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccesfull = false;
            }
        );
    }

    getSharedRoomsList() {
        this.isProgress = true;
        this.acmesharedRoomService.getSharedRoom(this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false;
                const response: any = value;
                this.roomsList = response.data;
                this.filteredRoomsList= this.roomsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccesfull = false;
            }
        );
    }

    // events
    roomCreated() {
        console.log('room created event recieved')
        this.getRooms();
    }

    roomDeleted() {
        this.getRooms();
    }

    favRoomDeleted() {
        this.getRooms();
    }

    sharedRoomDeleted() {
        this.getRooms();
    }

    createRoom() {
        const dialogRef = this.dialog.open(AcmeSCCreateRoomComponent, {
            width: '500px',
            height: '300px',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result.data) {
                this.roomsList.push(result.data);
            }
        });
    }

    getRooms() {
        this.isSuccesfull = true;
        switch (this.roomType) {
            case 'My Rooms': {
                this.getRoomsList();
                break;
            }
            case 'Favorites': {
                this.roomsList.length = 0;
                this.getFavRoomsList();
                break;
            }
            case 'Shared with Me': {
                this.getSharedRoomsList();
                break;
            }
            default:
                break;
        }

    }

}