import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// services
import { AcmeSCRoomAssignmentService } from '../../../services/acme-sc-room-assigment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../../shared/services/acme-sc-ui-utiltities.services';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

@Component({
    selector: 'acme-sc-submit-assignment',
    templateUrl: './acme-sc-submit-assignment.component.html',
    styleUrls: ['./acme-sc-submit-assignment.component.scss']
})
export class AcmeSSubmitAssignmentComponent {
    isProgress = false;
    buttonLabel: string = 'Create'
    assignmentContent: string = '';
    submitAssignmentFormGroup: any;

    modules = {
        imageResize: { modules: ['Resize', 'DisplaySize', 'Toolbar'] },
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
            ['blockquote', 'code-block'],

            [{ 'header': 1 }, { 'header': 2 }],               // custom button values
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
            [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
            [{ 'direction': 'rtl' }],                         // text direction
            [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],                                        // remove formatting button
            ['link', 'image', 'video']                         // link and image, video
        ]
    };

    constructor(public dialogRef: MatDialogRef<AcmeSSubmitAssignmentComponent>,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {

        this.submitAssignmentFormGroup = this.formBuilder.group({
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]]
        });

        if (data.mode === 'New') {
            this.buttonLabel = "Create";
        } else {
            this.buttonLabel = "Turn in";

        }
    }

    get f() {
        return this.submitAssignmentFormGroup.controls;
    }

    ngOnInit() {
        if (this.data.mode !== 'New') {
            this.assignmentContent = this.data.userAssignment.submitedData;
        }
    }

    createUpdateAssignment() {
        if (this.data.mode !== 'New') {
            this.updateAssignmentEvaluation();
        } else {
            this.createAssignmentEvaluation();
        }
    }

    createAssignmentEvaluation() {
        
        let userAssigmentModel=this.createAssigmentSubmissionData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.createUserAssignment(userAssigmentModel, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(' Assignment is successfully submitted.', '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: userAssigmentModel });
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

    updateAssignmentEvaluation() {
        let userAssigmentModel=this.createAssigmentSubmissionData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.updateUserAssignment(this.data.userAssignment._id, userAssigmentModel, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(' Assignment is successfully modified.', '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: userAssigmentModel });
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

    cancelAssignmentSubmission() {
        this.dialogRef.close();
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

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.submitAssignmentFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }

    createAssigmentSubmissionData() {
        
        let userAssignmentId;
        if (this.data.mode === 'New') {
            userAssignmentId = this.data.assignmentId;
        } else {
            userAssignmentId = this.data.userAssignment.assignmentId;
        }
      
        const formData = new FormData();
        formData.append('assesmentData', this.submitAssignmentFormGroup.get('fileSourceControl')?.value);
        formData.append('submitedData',this.assignmentContent);
        formData.append('assignmentId', userAssignmentId);
        formData.append('submittedFileName', this.submitAssignmentFormGroup.get('fileSourceControl')?.value.name);
        return formData;
    }
}
