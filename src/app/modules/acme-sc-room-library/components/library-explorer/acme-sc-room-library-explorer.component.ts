import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomLibraryService } from '../../services/acme-sc-room-library.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';


@Component({
    selector: 'acme-sc-library-explorer',
    templateUrl: './acme-sc-room-library-explorer.component.html',
    styleUrls: ['./acme-sc-room-library-explorer.component.scss']
})
export class AcmeSCLibraryExplorerComponent {
    loginEntity: ILoginEntity;
    nickName: string;
    fullName: string;
    roomId: string;
    roomType: string;
    roomName: string;
    ownerName: string;
    roomDetailsEntity: any;

    isProgress = false;
    isSuccessFull = false;
    isRoomOwner = false;
    roomDetailsResponseMessage = '';
    filterText: string = '';
    contentFilterType='All';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute, private router: Router,
        private acmeSCRoomLibraryService: AcmeSCRoomLibraryService,
        public dialog: MatDialog) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.roomId = params.roomId;
                this.roomType = params.roomType;
                this.getRoomDetails();
            });
    }

    getRoomDetails() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomLibraryService.getRoomById(this.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomDetailsEntity = response.data;
                this.roomName = response.data.title;
                this.ownerName = response.data.email;
                if (this.loginEntity.email.toUpperCase().trim() === response.data.email.toUpperCase().trim()) {
                    this.isRoomOwner = true;
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomDetailsResponseMessage = err.error.description;
                } else {
                    this.roomDetailsResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '45.5vw',
            height: '14vh',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    searchTextchange($event) {
        this.filterText = $event;
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }

    gotoTopics() {
        this.router.navigateByUrl('/roomDetails?roomId='+this.roomId+'&roomType=' + this.roomType);
    }

    gotoHome() {
        this.router.navigateByUrl ( '/home?roomType=My Rooms');
    }

    gotoRoomsList() {
        this.router.navigateByUrl('/home?roomType=' + this.roomType);
    }

    gotoConferenceCall() {
        this.router.navigateByUrl ( '/conference?roomType='+ this.roomType + '&roomId='+ this.roomId);
    }

    OnContentTypeSelected($event) {
        this.contentFilterType =$event;
    }
}