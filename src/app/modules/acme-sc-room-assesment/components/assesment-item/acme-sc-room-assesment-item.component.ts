import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { IAssesmentEntity } from '../../entities/assesment';

//dialogs
import { AcmeSUploadAssesmentComponent } from '../dialogs/upload-aasesment/acme-sc-upload-assesment.component'
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// services
import { AcmeSCRoomAssesmentService } from '../../services/acme-sc-room-assesment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-assesment-item',
    templateUrl: './acme-sc-room-assesment-item.component.html',
    styleUrls: ['./acme-sc-room-assesment-item.component.scss']
})
export class AcmeSCRoomAssesmentItemComponent {
    
    @Input() assesment: IAssesmentEntity
    @Input() roomOwner: string
    @Input() roomType: string
    @Input() roomName: string
    @Input() roomStatus: string
    @Input() isContentOrRoomOwner: boolean=false;

    @Output() assesmentDeleted = new EventEmitter<IAssesmentEntity>();
    @Output() assesmentUpdated = new EventEmitter<IAssesmentEntity>();
    @Output() assesmentStatusUpdated= new EventEmitter<IAssesmentEntity>();

    assesmentResponseMessage = '';
    roomRole;
    isProgress = false;
    isSuccessFull = true;

    constructor(private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog,  private router: Router,
        private translateService: TranslateService) {
    }

    startAssesment() {
        this.StartStopAssesment('Active');
    }

    closeAssesment() {
        this.StartStopAssesment('Closed');
    }

    updateAssesment() {
        if(this.assesment.status == 'Closed') {
            this.snackBar.open(this.translateService.instant('ROOM_ASSESMENT_ASSESSMENT_CLOSED_NO_EDIT'), '', {
                duration: 3000
            });
            return;
        }   
        const dialogRef = this.dialog.open(AcmeSUploadAssesmentComponent, {
            width: '55vw',
            height:'70vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: 'Edit', assesment: this.assesment }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.assesmentUpdated.emit(this.assesment);
            }
        });
    }

    deleteAssesment() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_ASSESMENT_ASSESSMENT_DELETE_WARNING') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.deleteRoomAssesment();
            }
        });
    }

    deleteRoomAssesment() {
        this.isProgress = true;
        this.acmeSCRoomAssesmentService.deleteAssesment( this.assesment._id,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESMENT_ASSESSMENT_DELETE_SUCCESS'), '', {
                    duration: 3000
                });
                this.assesmentDeleted.emit(this.assesment);
            },
            err => {
                
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });

                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    StartStopAssesment(status) {
        this.isProgress = true;
        this.assesment.status = status;
        this.acmeSCRoomAssesmentService.updateAssesment( this.assesment._id,this.assesment,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESMENT_ASSESSMENT_UPDATE_SUCCESS'), '', {
                    duration: 3000
                });
                this.assesmentStatusUpdated.emit(this.assesment);
            },
            err => {
                if(status === 'Active') {
                    this.assesment.status = "Scheduled";
                } else {
                    this.assesment.status = "Active"
                }
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });

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

    
    openAssesment() {
        this.router.navigateByUrl('/assesments/details?roomId=' + this.assesment.roomId + '&roomType=' 
        + this.roomType + '&assesmentId='+this.assesment._id +'&assesmentTitle='+this.assesment.title +
        '&roomStatus='+ this.roomStatus + '&roomName='+this.roomName);
    }

}