import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomAssesmentService } from '../../services/acme-sc-room-assesment.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IAssesmentEntity } from '../../entities/assesment';
import { IUserAssesmentEntity } from '../../entities/userassesment';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { AcmeSubmitAssesmentComponent } from '../dialogs/submit-assesment/acme-sc-submit-assesment.component';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-assesment-submission',
    templateUrl: './acme-sc-room-assesment-submission.component.html',
    styleUrls: ['./acme-sc-room-assesment-submission.component.scss']
})
export class AcmeSCAssesmentSubmissionComponent {
    @Input() assesment: IAssesmentEntity;
    @Input() roomType: string;
    @Input() roomId: string;
    @Input() roomName: string;
    @Input() roomStatus: String;
    @Input() assesmentTitle: string;
    @Input() fileName: String;

    loginEntity: ILoginEntity;
    userAssesment: IUserAssesmentEntity;
    roomDetailsEntity: IRoomEntity;

    isProgress = false;
    isfileDownloadProgress = false;
    isSuccessFull = false;
    isAssesmentFound = false;
    userSubmissionResponseMessage = '';
    showSearchBox = false;
    nickName: string;
    fullName: string;
    grade;
    marksObtained;

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private translateService: TranslateService) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);
    }

    ngOnInit() {
        this.roomDetailsEntity = this.acmeSCAuthorizationService.getRoomDetails();
        this.getUserAssesment();
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

    GetEvaluatedFile() {
        this.isfileDownloadProgress = true;
        this.acmeSCRoomAssesmentService.getUserAssesmentEvaluation(this.loginEntity.email,this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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
        this.acmeSCRoomAssesmentService.getUserAssesmentSubmission(this.loginEntity.email,this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
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

        this.acmeSCRoomAssesmentService.getUserAssesment(this.loginEntity.email,
            this.assesment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
                value => {
                    const response: any = value;
                    this.userAssesment = response.data;
                    this.isProgress = false;
                    this.isSuccessFull = true;
                    this.isAssesmentFound = true;
                },
                err => {
                    this.isProgress = false;
                    this.isSuccessFull = false;
                    if (err.error && err.error.description) {
                        this.userSubmissionResponseMessage = err.error.description;
                    } else {
                        this.userSubmissionResponseMessage = this.translateService.instant('ROOM_ASSESSMENT_SUBMISSION_SERVER_ERROR');
                    }
                    if (err.status === 401 || err.status === 401.1) {
                        //  show session expired dialog
                        this.openSessionExpiredDialog();
                    }
                    if (err.status === 404) {
                        this.isAssesmentFound = false;
                        this.isSuccessFull = true;
                    }
                }
            );
    }

    turnInAssesment() {
        const dialogRef = this.dialog.open(AcmeSubmitAssesmentComponent, {
            width: '65vw',
            height: '85vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {assesmentId: this.assesment._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getUserAssesment();
            }
        });
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