import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssesmentService } from '../../services/acme-sc-room-assesment.service';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssesmentEntity } from '../../entities/assesment';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-assesment-details',
    templateUrl: './acme-sc-room-assesment-details.component.html',
    styleUrls: ['./acme-sc-room-assesment-details.component.scss']
})
export class AcmeSCAssesmentDetailsComponent {
    loginEntity: ILoginEntity;
    assesment: IAssesmentEntity;
    assesmentTitle: string= '';
    isProgress = false;
    isSuccessFull = false;
    isAssesmentOwner = false;
    showSearchBox = false;
    nickName;
    fullName;
    roomAssesmentDetailsResponseMessage = '';
    roomId;
    roomType;
    roomName;
    roomStatus;
    assesmentId;
    selectedUser='';
    roomRole;
    isContentOrRoomOwner

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog,
        private translateService: TranslateService) {

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
                this.roomName=params.roomName;
                this.assesmentId = params.assesmentId;
                this.assesmentTitle = params.assesmentTitle;
                this.roomStatus =params.roomStatus;
                const userRommRole = this.acmeSCAuthorizationService.getUserRoomRole();
                if(userRommRole === 'Owner' || userRommRole === 'Admin') {
                    this.isContentOrRoomOwner = true;
                }
                this.getAssesmentDetails();
            });
    }

    getAssesmentDetails() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomAssesmentService.getAssesment(this.assesmentId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.assesment = response.data;
                this.assesmentTitle=this.assesment.title
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomAssesmentDetailsResponseMessage = err.error.description;
                } else {
                    this.roomAssesmentDetailsResponseMessage = this.translateService.instant('ROOM_ASSESSMENT_DETAILS_SERVER_ERROR');
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
            width: this.acmesharedUiTuilitiesService.getSessionExpiredScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getSessionExpiredScreenHeight(),
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    userSelected($event) {
        // user id
        this.selectedUser = $event.userEmail;
    }
}
