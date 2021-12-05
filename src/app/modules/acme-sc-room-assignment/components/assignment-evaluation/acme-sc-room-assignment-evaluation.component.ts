import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { IAssignmentEntity } from '../../entities/assignment';
import { IUserAssignmentEntity } from '../../entities/userassignment';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';


@Component({
    selector: 'acme-sc-assignment-evaluation',
    templateUrl: './acme-sc-room-assignment-evaluation.component.html',
    styleUrls: ['./acme-sc-room-assignment-evaluation.component.scss']
})
export class AcmeSCAssignmentEvaluationComponent {
    @Input() assignment: IAssignmentEntity;
    @Input() userId: string = '';

    userAssignment: IUserAssignmentEntity;

    isProgress = false;
    isSuccessFull = false;
    isAssignmentFound = false;
    userAssignmentResponseMessage = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const currentUser: SimpleChange = changes.userId;
        if (currentUser) {
            this.userId = currentUser.currentValue;
            this.getUserAssignment();
        }
    }

    getUserAssignment() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.isAssignmentFound = false;
        this.acmeSCRoomAssignmentService.getUserAssignment(this.userId,
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
                        this.userAssignmentResponseMessage = err.error.description;
                    } else {
                        this.userAssignmentResponseMessage = 'Server Error';
                    }
                    if (err.status === 401 || err.status === 401.1) {
                        //  show session expired dialog
                        this.openSessionExpiredDialog();
                    }
                    if (err.status === 404) {
                        this.isAssignmentFound= false;
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
}
