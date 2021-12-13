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
        public dialog: MatDialog,  private router: Router) {
    }

    ngOnInit() {

    }

    closeAssignment() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: this.acmesharedUiTuilitiesService.getConfirmationScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getConfirmationScreenHeight(),
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will close the assignment, which cannot be edited later.' }
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
                 this.snackBar.open(' Assignment is successfully deleted.', '', {
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
            this.snackBar.open('Assignment is closed cannot edit', '', {
                duration: 3000
            });
            return;
        }   
        const dialogRef = this.dialog.open(AcmeSUploadAssignmentComponent, {
            width: this.acmesharedUiTuilitiesService.getCreateAssignmentScreenWidth(),
            height: this.acmesharedUiTuilitiesService.getCreateAssignmentScreenHeight(),
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
                this.snackBar.open(' Assignment is successfully deleted.', '', {
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
            data: { message: 'This action will delete assignment.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.deleteRoomAssignment();
            }
        });
    }

    openAssignment() {
       this.router.navigateByUrl('/assignments/details?roomId=' + this.assignment.roomId + '&roomType=' 
        + this.roomType + '&assignmentId='+this.assignment._id +'&assignmentTitle='+this.assignment.title +
        '&roomStatus='+ this.roomStatus + '&roomName='+this.roomName);
    }
}