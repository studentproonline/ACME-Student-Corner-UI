import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssignmentEntity } from '../../entities/assignment';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

@Component({
    selector: 'acme-sc-assignment-details',
    templateUrl: './acme-sc-room-assignment-details.component.html',
    styleUrls: ['./acme-sc-room-assignment-details.component.scss']
})
export class AcmeSCAssignmentDetailsComponent {
    loginEntity: ILoginEntity;
    assignment: IAssignmentEntity;
    assignmentTitle: string= '';
    isProgress = false;
    isSuccessFull = false;
    isAssignmentOwner = false;
    showSearchBox = false;
    nickName;
    fullName;
    roomAssignmentDetailsResponseMessage = '';
    roomId;
    roomType;
    roomName;
    roomStatus;
    assignmentId;
    selectedUser='';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
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
                this.roomName=params.roomName;
                this.assignmentId = params.assignmentId;
                this.assignmentTitle = params.assignmentTitle;
                this.roomStatus =params.roomStatus;
                this.getAssignmentDetails();
            });
    }

    getAssignmentDetails() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomAssignmentService.getAssignment(this.assignmentId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.assignment = response.data;
                this.assignmentTitle=this.assignment.title

                if (this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
                    this.assignment.roomOwner.toUpperCase().trim() ||

                    this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
                    this.assignment.owner.toUpperCase().trim()) {

                    this.isAssignmentOwner = true;
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomAssignmentDetailsResponseMessage = err.error.description;
                } else {
                    this.roomAssignmentDetailsResponseMessage = 'Server Error';
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
