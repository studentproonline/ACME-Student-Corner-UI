import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssignmentEntity } from '../../entities/assignment';
import { IUserAssignmentEntity } from '../../entities/userassignment';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';


@Component({
    selector: 'acme-sc-assignment-submission',
    templateUrl: './acme-sc-room-assignment-submission.component.html',
    styleUrls: ['./acme-sc-room-assignment-submission.component.scss']
})
export class AcmeSCAssignmentSubmissionComponent {
    @Input() assignment: IAssignmentEntity;
    @Input() roomType: string;
    @Input() roomStatus: String;

    loginEntity: ILoginEntity;
    userAssignment: IUserAssignmentEntity;

    isProgress = false;
    isSuccessFull = false;
    isAssignmentFound = false;
    userSubmissionResponseMessage = '';
 
    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private router: Router,) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();

       
    }

    ngOnInit() {
        console.log(this.assignment);
        this.getUserAssignment();
    }

    getUserAssignment() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.isAssignmentFound = false;
        this.acmeSCRoomAssignmentService.getUserAssignment(this.loginEntity.id,
            this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
                value => {
                    const response: any = value;
                    this.isProgress = false;
                    this.isSuccessFull = true;
                    this.isAssignmentFound = true;
                    this.userAssignment = response.data;
                },
                err => {
                    this.isProgress = false;
                    this.isSuccessFull = false;
                    if (err.error && err.error.description) {
                        this.userSubmissionResponseMessage = err.error.description;
                    } else {
                        this.userSubmissionResponseMessage = 'Server Error';
                    }
                    if (err.status === 401 || err.status === 401.1) {
                        //  show session expired dialog
                        this.openSessionExpiredDialog();
                    }
                    if (err.status === 404) {
                        this.isAssignmentFound = false;
                        this.isSuccessFull = true;
                    }
                }
            );
    }

    turnInAssignment() {

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

    goToAllassignments() {
        this.router.navigateByUrl('/assignments?roomId=' + this.assignment.roomId + '&roomType=' + this.roomType);
    }

    gotoHome() {
        this.router.navigateByUrl('/home?roomType=My Rooms');
    }


}