import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeRoomService } from '../../services/acme-sc-room.service';
import { AcmeFavRoomService } from '../../services/acme-sc-fav-room.service';
import { AcmesharedRoomService } from '../../../shared/services/acme-sc-shared-room.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

// dialogs
import { AcmeSCCreateRoomComponent } from '../dialogs/create-room/acme-sc-create-room.component';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { Observable } from 'rxjs';

//translation
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'acme-sc-rooms-list',
    templateUrl: './acme-sc-rooms-list.component.html',
    styleUrls: ['./acme-sc-rooms-list.component.scss']
})
export class AcmeSCRoomsListComponent implements OnInit, OnChanges {

    @Input() roomType = this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME');
    @Input() filterText = '';
    @Input() loggedInUser = '';

    roomsList: IRoomEntity[] = [];
    filteredRoomsList: IRoomEntity[] = [];
    isProgress = false;
    isSuccesfull = true;
    clientWidth= 0;
    clientHeight =0;
    cardHeight='';
    
    
    // your current result based on filters input
    filteredOptions: Observable<string[]>;

    @ViewChild('roomListContainer', { static: false, read: ElementRef }) roomListContainer: ElementRef;

    constructor(public dialog: MatDialog, private acmeRoomService: AcmeRoomService,
        private router: Router,
        private acmeFavRoomService: AcmeFavRoomService,
        private acmesharedRoomService: AcmesharedRoomService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public translateService: TranslateService) {

    }
    ngOnInit() {
      
    }

    getWidth() {
        return {
            width: (this.roomListContainer.nativeElement.clientWidth/3) -34 + 'px'
        };
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
                console.log(err);
                if(err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
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
                if(err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
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
                if(err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
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
            width: '40vw',
            height: '45vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getRooms();
            }
        });
    }

    getRooms() {
        this.isSuccesfull = true;
        switch (this.roomType) {
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME'): {
                this.getRoomsList();
                break;
            }
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_FAVORITES'): {
                this.roomsList.length = 0;
                this.getFavRoomsList();
                break;
            }
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_SHARED_WITH_ME'): {
                this.getSharedRoomsList();
                break;
            }
            case this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_ACHIEVEMENTS'): {
                this.router.navigateByUrl('/achievements');
            }
            default:
                break;
        }
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: this.acmesharedUiTuilitiesService.getSessionExpiredScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getSessionExpiredScreenHeight(),
            disableClose: true,
            data:{}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
