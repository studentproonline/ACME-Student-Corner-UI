import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssesmentService } from '../../services/acme-sc-room-assesment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { IAssesmentEntity } from '../../entities/assesment';
import { IUserAssesmentEntity } from '../../entities/userassesment';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { IAssesmentModel } from '../../models/assesment.model';
import { IAssignmentEntity } from 'src/app/modules/acme-sc-room-assignment/entities/assignment';
//import { AcmeSCEvaluateAssignmentComponent } from '../dialogs/evaluate-assignment/acme-sc-evaluate-assignment.component';

@Component({
    selector: 'acme-sc-assesment-evaluation',
    templateUrl: './acme-sc-room-assesment-evaluation.component.html',
    styleUrls: ['./acme-sc-room-assesment-evaluation.component.scss']
})
export class AcmeSCAssesmentEvaluationComponent {
    @Input() assesment: IAssesmentEntity;
    @Input() roomId: string;
    @Input() roomType: string;
    @Input() roomName: string;
    @Input() userId: string = '';
    @Input() roomStatus: String;

    userAssesment: IUserAssesmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isSuccessFull = false;
    isAssesmentFound = false;
    userAssesmentResponseMessage = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
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
            this.getUserAssesment();
        }
    }

    reviewAssesment() {
    }

    getUserAssesment() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.isAssesmentFound = false;
        this.acmeSCRoomAssesmentService.getUserAssesment(this.userId,
            this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
                value => {
                    const response: any = value;
                    this.userAssesment = response.data;
                    let roomDetails: IRoomEntity = {
                        _id: this.userAssesment.roomId, name: '',
                        owner: undefined,
                        email: this.userAssesment.roomOwner,
                        title: this.roomName,
                        description: undefined,
                        creationDate: undefined,
                        status: undefined

                    }
                    this.roomDetailsEntity = roomDetails;
                    this.isProgress = false;
                    this.isSuccessFull = true;
                    this.isAssesmentFound = true;
                },
                err => {
                    this.isProgress = false;
                    this.isSuccessFull = false;
                    if (err.error && err.error.description) {
                        this.userAssesmentResponseMessage = err.error.description;
                    } else {
                        this.userAssesmentResponseMessage = 'Server Error';
                    }
                    if (err.status === 401 || err.status === 401.1) {
                        //  show session expired dialog
                        this.openSessionExpiredDialog();
                    }
                    if (err.status === 404) {
                        this.isAssesmentFound = false;
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
        this.router.navigateByUrl('/assesments?roomId=' + this.assesment.roomId + '&roomType=' + this.roomType);
    }

    gotoHome() {
        this.router.navigateByUrl('/home?roomType=My Rooms');
    }

}
