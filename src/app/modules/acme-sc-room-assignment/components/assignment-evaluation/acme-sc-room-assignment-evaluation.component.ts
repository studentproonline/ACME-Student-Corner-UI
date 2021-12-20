import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssignmentEntity } from '../../entities/assignment';
import { IUserAssignmentEntity } from '../../entities/userassignment';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSCEvaluateAssignmentComponent } from '../dialogs/evaluate-assignment/acme-sc-evaluate-assignment.component';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-assignment-evaluation',
    templateUrl: './acme-sc-room-assignment-evaluation.component.html',
    styleUrls: ['./acme-sc-room-assignment-evaluation.component.scss']
})
export class AcmeSCAssignmentEvaluationComponent {
    @Input() assignment: IAssignmentEntity;
    @Input() roomType: string;
    @Input() roomName: string;
    @Input() userId: string = '';
    @Input() roomStatus: String;

    loginEntity: ILoginEntity;
    userAssignment: IUserAssignmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isfileDownloadProgress = false;
    isSuccessFull = false;
    isAssignmentFound = false;
    userAssignmentResponseMessage = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private router: Router, private snackBar: MatSnackBar,
        private translateService: TranslateService) {
        
        this.loginEntity = this.acmeSCAuthorizationService.getSession();
         
    }

    ngOnInit() {
        this.roomDetailsEntity = this.acmeSCAuthorizationService.getRoomDetails();
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
            width: '65vw',
            height: '85vh',
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
                        this.userAssignmentResponseMessage = this.translateService.instant('ROOM_ASSIGNMENT_EVALUATION_ASSIGNMENT_SERVER_ERROR');
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

    GetAssignmentFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssignmentService.getUserAssesmentFile(this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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
        this.acmeSCRoomAssignmentService.getUserAssignmentSubmission(this.userId,this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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

    GetEvaluatedFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssignmentService.getUserAssignmentEvaluation(this.userId,this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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
