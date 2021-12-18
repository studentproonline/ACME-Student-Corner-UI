import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-report-card-explorer',
    templateUrl: './acme-sc-room-report-card-explorer.component.html',
    styleUrls: ['./acme-sc-room-report-card-explorer.component.scss']
})
export class AcmeSCReportCardExplorerComponent {
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
    selectedUser='';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute, private router: Router,
        public dialog: MatDialog,
        public translateService: TranslateService) {

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
                this.roomDetailsEntity= this.acmeSCAuthorizationService.getRoomDetails();
                this.isSuccessFull= true;
            });
    }

  
    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '45vw',
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

    OnContentTypeSelected($event) {
        this.contentFilterType =$event;
    }

    userSelected($event) {
        // user id
        this.selectedUser = $event.userEmail;
    }

    groupItemClicked($event) {
        this.router.navigateByUrl('/reportcards/details?roomId=' + this.roomId + '&roomType=' 
        + this.roomType + '&assesmentgroup='+$event +
        '&roomName='+this.roomDetailsEntity.title + '&selectedUser='+this.selectedUser);
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }

}