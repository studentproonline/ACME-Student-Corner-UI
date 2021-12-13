import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
import { AcmeEvaluateAssesmentComponent } from '../dialogs/evaluate-assesment/acme-sc-evaluate-assesment.component';

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
    @Input() fileName: String;

    userAssesment: IUserAssesmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isfileDownloadProgress = false;
    isSuccessFull = false;
    isAssesmentFound = false;
    userAssesmentResponseMessage = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private router: Router,
        private snackBar: MatSnackBar) {


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

    openAssesmentFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssesmentService.getAssesmentFile(this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isfileDownloadProgress = false;
                var blob = new Blob([this._base64ToArrayBuffer(response.data.assesmentData)], { type: response.data.contentType });
                const url = URL.createObjectURL(blob);
                window.open(url);
            },
            err => {
                this.isfileDownloadProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    reviewAssesment() {
        const dialogRef = this.dialog.open(AcmeEvaluateAssesmentComponent, {
            width: '65vw',
            height: '85vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {assesmentId: this.assesment._id, userAssesment: this.userAssesment }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getUserAssesment();
            }
        });
    }

    GetEvaluatedFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssesmentService.getUserAssesmentEvaluation(this.userId,this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isfileDownloadProgress = false;
                var blob = new Blob([this._base64ToArrayBuffer(response.data.assesmentData)], { type: response.data.contentType });
                const url = URL.createObjectURL(blob);
                window.open(url);
            },
            err => {
                this.isfileDownloadProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    GetSubmittedFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssesmentService.getUserAssesmentSubmission(this.userId,this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isfileDownloadProgress = false;
                var blob = new Blob([this._base64ToArrayBuffer(response.data.assesmentData)], { type: response.data.contentType });
                const url = URL.createObjectURL(blob);
                window.open(url);
            },
            err => {
                this.isfileDownloadProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
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

    _base64ToArrayBuffer(base64Data) {
        const binary_string = window.atob(base64Data);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

}
