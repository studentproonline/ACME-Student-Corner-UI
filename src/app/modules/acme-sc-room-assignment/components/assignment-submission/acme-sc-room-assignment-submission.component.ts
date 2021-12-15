import { Component, Input} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssignmentEntity } from '../../entities/assignment';
import { IUserAssignmentEntity } from '../../entities/userassignment';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSSubmitAssignmentComponent } from '../dialogs/submit-assignment/acme-sc-submit-assignment.component';

@Component({
    selector: 'acme-sc-assignment-submission',
    templateUrl: './acme-sc-room-assignment-submission.component.html',
    styleUrls: ['./acme-sc-room-assignment-submission.component.scss']
})
export class AcmeSCAssignmentSubmissionComponent {
    @Input() assignment: IAssignmentEntity;
    @Input() roomType: string;
    @Input() roomName: string;
    @Input() roomStatus: String;

    loginEntity: ILoginEntity;
    userAssignment: IUserAssignmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isfileDownloadProgress = false;
    isSuccessFull = false;
    isAssignmentFound = false;
    userSubmissionResponseMessage = '';
    showSearchBox=false;
    nickName: string;
    fullName: string;
    stars;
 
    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog, private router: Router, private snackBar: MatSnackBar) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);

       
    }

    ngOnInit() {
        this.roomDetailsEntity = {
            _id: this.assignment.roomId, name: '',
            owner: undefined,
            email: '',
            title: this.roomName,
            description: undefined,
            creationDate: undefined,
            status: undefined

        }
        this.getUserAssignment();
    }

    getUserAssignment() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.isAssignmentFound = false;
        this.acmeSCRoomAssignmentService.getUserAssignment(this.loginEntity.email,
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

    turnInAssignment(mode) {
        const dialogRef = this.dialog.open(AcmeSSubmitAssignmentComponent, {
            width: '60vw',
            height: '78vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: mode, userAssignment: this.userAssignment, assignmentId:this.assignment._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getUserAssignment();
            }
        });
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
        this.acmeSCRoomAssignmentService.getUserAssignmentSubmission(this.loginEntity.email,this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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
        this.acmeSCRoomAssignmentService.getUserAssignmentEvaluation(this.loginEntity.email,this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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