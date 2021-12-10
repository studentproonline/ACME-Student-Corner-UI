import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { IAssignmentEntity } from '../../entities/assignment';
import { IUserAssignmentEntity } from '../../entities/userassignment';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCEvaluateAssignmentComponent } from '../dialogs/evaluate-assignment/acme-sc-evaluate-assignment.component';


@Component({
    selector: 'acme-sc-assignment-evaluation',
    templateUrl: './acme-sc-room-assignment-evaluation.component.html',
    styleUrls: ['./acme-sc-room-assignment-evaluation.component.scss']
})
export class AcmeSCAssignmentEvaluationComponent {
    @Input() assignment: IAssignmentEntity;
    @Input() roomId: string;
    @Input() roomType: string;
    @Input() roomName: string;
    @Input() userId: string = '';
    @Input() roomStatus: String;

    userAssignment: IUserAssignmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isSuccessFull = false;
    isAssignmentFound = false;
    userAssignmentResponseMessage = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private router: Router) {

         
    }

    ngOnInit() {
        this.roomDetailsEntity = {
            _id: this.roomId, name: '',
            owner: undefined,
            email: '',
            title: this.roomName,
            description: undefined,
            creationDate: undefined,
            status: undefined

        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const currentUser: SimpleChange = changes.userId;
        if (currentUser) {
            this.userId = currentUser.currentValue;
            this.getUserAssignment();
        }
    }

    reviewAssignment() {
        let mode;
        if(this.userAssignment.status === 'Returned') {
            mode='Edit';
        } else {
            mode='New';
        }
        const dialogRef = this.dialog.open(AcmeSCEvaluateAssignmentComponent, {
            width: this.acmesharedUiTuilitiesService.getCreateAssignmentScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getCreateAssignmentScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: mode, userAssignment: this.userAssignment }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getUserAssignment();
            }
        });
    }

    getUserAssignment() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.isAssignmentFound = false;
        this.acmeSCRoomAssignmentService.getUserAssignment(this.userId,
            this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
                value => {
                    const response: any = value;
                    this.userAssignment = response.data;
                    let roomDetails: IRoomEntity = {
                        _id: this.userAssignment.roomId, name: '',
                        owner: undefined,
                        email: this.userAssignment.roomOwner,
                        title: this.roomName,
                        description: undefined,
                        creationDate: undefined,
                        status: undefined

                    }
                    this.roomDetailsEntity = roomDetails;
                    this.isProgress = false;
                    this.isSuccessFull = true;
                    this.isAssignmentFound = true;
                  
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

    goToAllassignments() {
        this.router.navigateByUrl('/assignments?roomId=' + this.assignment.roomId + '&roomType=' + this.roomType);
    }

    gotoHome() {
        this.router.navigateByUrl('/home?roomType=My Rooms');
    }
}
