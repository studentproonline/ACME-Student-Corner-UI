import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

// services
import { AcmeSCRoomAssignmentService } from '../../../services/acme-sc-room-assigment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../../shared/services/acme-sc-ui-utiltities.services';

// validator
import { WhiteSpaceValidator } from '../../../../../core/validators/acme-sc-whitespace-validator';

import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

//translation
import { TranslateService } from '@ngx-translate/core';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

@Component({
    selector: 'acme-sc-upload-assignment',
    templateUrl: './acme-sc-upload-assignment.component.html',
    styleUrls: ['./acme-sc-upload-assignment.component.scss']
})
export class AcmeSUploadAssignmentComponent {
    isProgress = false;
    createAssignmentFormGroup: any;
    assignmentContent: string = '';
    minDate: Date;
    buttonLabel: string = 'Create'
    fileName: string='';
    dialogTitle = this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_LABEL_CREATE');

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

    constructor(public dialogRef: MatDialogRef<AcmeSUploadAssignmentComponent>, private formBuilder: FormBuilder,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {

        this.createAssignmentFormGroup = this.formBuilder.group({
            titleControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            descriptionControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            expiryDateControl: ['', [Validators.required]],
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]]
        });
        this.minDate = new Date();
        if (data.mode === 'New') {
            this.buttonLabel = this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_ASSIGNMENT_BUTTON_CREATE_LABEL');
        } else {
            this.buttonLabel = this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_ASSIGNMENT_BUTTON_EDIT_LABEL');;

        }
    }
    
    get f() {
        return this.createAssignmentFormGroup.controls;
    }

    ngOnInit() {
        if (this.data.mode !== 'New') {
            this.createAssignmentFormGroup.get('titleControl')?.setValue(this.data.assignment.title);
            this.createAssignmentFormGroup.get('descriptionControl')?.setValue(this.data.assignment.description);
            this.createAssignmentFormGroup.get('expiryDateControl')?.setValue(this.data.assignment.expiryDate);
            this.assignmentContent = this.data.assignment.data;
            this.fileName = this.data.assignment.fileName;
            this.dialogTitle = this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_LABEL_UPDATE');
        }
    }

    createUpdateAssignment() {
        if(this.data.mode !== 'New') {
            this.updateAssignment();
        } else{
            this.createAssignment();
        }
    }
    updateAssignment() {
       
        let assigmentModel= this.createAssigmentData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.updateAssignment(this.data.assignment._id, assigmentModel,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_ASSIGNMENT_UPDATE_SUCCESS_MESSAGE'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: assigmentModel });
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

    createAssignment() {
        let assigmentModel= this.createAssigmentData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.createAssignment(assigmentModel, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSIGNMENT_DIALOG_ASSIGNMENT_CREATE_SUCCESS_MESSAGE'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: assigmentModel });
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

    cancelAssignmentCreation() {
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
            this.createAssignmentFormGroup.patchValue({
                fileSourceControl: file
            });
            this.fileName =this.createAssignmentFormGroup.get('fileSourceControl').value.name
        }
    }
    
    /**
     * let assigmentModel: IAssignmentModel = {
            title: title, description: description,
            roomId: this.data.roomId, expiryDate: expiryDate,
            data: this.assignmentContent, status: 'Active'
        }
     */
    createAssigmentData() {
        
        let status;
        if (this.data.mode === 'New') {
            status = 'Active';
        } else {
            status = this.data.assignment.status;
        }
      
        const formData = new FormData();
        formData.append('title', this.createAssignmentFormGroup.get('titleControl')?.value);
        formData.append('description',this.createAssignmentFormGroup.get('descriptionControl')?.value);
        formData.append('status',status);
        formData.append('roomId', this.data.roomId);
        formData.append('expiryDate', this.createAssignmentFormGroup.get('expiryDateControl')?.value);
        formData.append('data', this.assignmentContent);
        formData.append('assesmentData', this.createAssignmentFormGroup.get('fileSourceControl')?.value);
        formData.append('fileName', this.createAssignmentFormGroup.get('fileSourceControl')?.value.name);
        return formData;
    }
}
