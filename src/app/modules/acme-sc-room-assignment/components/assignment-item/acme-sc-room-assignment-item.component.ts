import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { IAssignmentEntity } from '../../entities/assignment';

//dialogs
import { AcmeSUploadAssignmentComponent } from '../dialogs/upload-assignment/acme-sc-upload-assignment.component'


// services
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';
import { IAssignmentModel } from '../../models/assignment.Model';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-assignment-item',
    templateUrl: './acme-sc-room-assignment-item.component.html',
    styleUrls: ['./acme-sc-room-assignment-item.component.scss']
})
export class AcmeSCRoomAssignmentItemComponent {
    @Input() assignment: IAssignmentEntity
    @Input() roomOwner: string
    @Input() roomType: string
    @Input() roomName: string
    @Input() roomStatus: string
    @Input() isContentOrRoomOwner:boolean = false;
    @Output() assignmentDeleted = new EventEmitter<IAssignmentEntity>();
    @Output() assignmentUpdated = new EventEmitter<IAssignmentEntity>();

    isProgress = false;
    isSuccessFull = true;

    constructor(private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        public dialog: MatDialog,  private router: Router,
        private translateService: TranslateService) {
    }

    ngOnInit() {

    }

    closeAssignment() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_ASSIGNMENT_ITEM_ASSIGNMENT_CLOSE_ASSIGNMENT_WARNING') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.closeRoomAssignment();
            }
        });
    }

    closeRoomAssignment() {
         // show progress
         this.isProgress = true;
         let assigmentModel: IAssignmentModel = {
            title: this.assignment.title, description: this.assignment.description,
            roomId: this.assignment.roomId, expiryDate: this.assignment.expiryDate,
            data: this.assignment.data, status: 'Closed'
        }
         this.acmeSCRoomAssignmentService.updateAssignment(this.assignment._id,assigmentModel,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
             value => {
                 this.isProgress = false; // end progress
                 this.snackBar.open(this.translateService.instant('ROOM_ASSIGNMENT_ITEM_ASSIGNMENT_DELETED'), '', {
                     duration: 3000
                 });
                 this.assignmentDeleted.emit(this.assignment);
             },
             err => {
                 this.isProgress = false; // end progress
                 this.snackBar.open(err.error.description, '', {
                     duration: 3000
                 });
             }
        );
    }

    updateAssignment() {
        if(this.assignment.status == 'Closed') {
            this.snackBar.open(this.translateService.instant('ROOM_ASSIGNMENT_ITEM_ASSIGNMENT_EDIT_FAILED'), '', {
                duration: 3000
            });
            return;
        }   
        const dialogRef = this.dialog.open(AcmeSUploadAssignmentComponent, {
            width: '65vw',
            height: '85vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: 'Edit', assignment: this.assignment }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.assignmentUpdated.emit(this.assignment);
            }
        });
    }

    deleteRoomAssignment() {
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.deleteAssignment(this.assignment._id,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSIGNMENT_ITEM_ASSIGNMENT_DELETE_SUCCESS'), '', {
                    duration: 3000
                });
                this.assignmentDeleted.emit(this.assignment);
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );

    }

    deleteAssignment() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: this.translateService.instant('ROOM_ASSIGNMENT_ITEM_ASSIGNMENT_DELETE_WARNING') }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.deleteRoomAssignment();
            }
        });
    }

    GetAssignmentFile() {
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.getUserAssesmentFile(this.assignment._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                var blob = new Blob([this._base64ToArrayBuffer(response.data.assesmentData)], { type: response.data.contentType });
                const url = URL.createObjectURL(blob);
                window.open(url);
            },
            err => {
                this.isProgress = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    openAssignment() {
       this.router.navigateByUrl('/assignments/details?roomId=' + this.assignment.roomId + '&roomType=' 
        + this.roomType + '&assignmentId='+this.assignment._id +'&assignmentTitle='+this.assignment.title +
        '&roomStatus='+ this.roomStatus + '&roomName='+this.roomName);
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