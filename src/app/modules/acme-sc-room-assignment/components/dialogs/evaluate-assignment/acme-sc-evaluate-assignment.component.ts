import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// services
import { AcmeSCRoomAssignmentService } from '../../../services/acme-sc-room-assigment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../../shared/services/acme-sc-ui-utiltities.services';

// models
import { IUserAssignmentEvaluateModel } from '../../../models/user-assignment-evaluate.model';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

@Component({
    selector: 'acme-sc-evaluate-assignment',
    templateUrl: './acme-sc-evaluate-assignment.component.html',
    styleUrls: ['./acme-sc-evaluate-assignment.component.scss']
})
export class AcmeSCEvaluateAssignmentComponent {
    isProgress = false;
    buttonLabel: string = 'Create'
    assignmentContent: string = '';
    Submitselected = true;
    returnAssignmentSelected = false;
    evaluateAssignmentFormGroup: any;
    status = 'Reviewed';
    stars = 1;

    starsArray: any[] = [{ 'id': 1, 'selected': false },
    { 'id': 2, 'selected': false },
    { 'id': 3, 'selected': false },
    { 'id': 4, 'selected': false },
    { 'id': 5, 'selected': false }]

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

    constructor(public dialogRef: MatDialogRef<AcmeSCEvaluateAssignmentComponent>,
        private acmeSCRoomAssignmentService: AcmeSCRoomAssignmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {

        this.evaluateAssignmentFormGroup = this.formBuilder.group({
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]]
        });

        if (data.mode === 'New') {
            this.buttonLabel = "Submit";
        } else {
            this.buttonLabel = "submit";

        }
        this.selectStars(1);
    }

    get f() {
        return this.evaluateAssignmentFormGroup.controls;
    }

    ngOnInit() {
        if (this.data.mode !== 'New') {
            this.assignmentContent = this.data.userAssignment.evaluatedData;
            this.selectStars(this.data.userAssignment.stars);
        }
    }

    createUpdateAssignment() {
        this.updateAssignmentEvaluation();
    }

    selectStars(id) {
        this.stars = 1;
        for (let i = 0; i < id; i += 1) {
            this.starsArray[i].selected = true;
        }
        for (let i = id; i < 5; i += 1) {
            this.starsArray[i].selected = false;
        }
    }

    selectAction(action) {
        if (action === 'Submit') {
            this.status = 'Reviewed';
            this.Submitselected = true;
            this.returnAssignmentSelected = false;
        } else {
            this.status = 'Returned';
            this.Submitselected = false;
            this.returnAssignmentSelected = true;
        }
    }

    updateAssignmentEvaluation() {
        let userAssigmentEvaluateModel= this.createAssigmentEvaluationData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssignmentService.updateUserEvaluationAssignment(this.data.userAssignment._id, userAssigmentEvaluateModel, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(' Assignment Evaluation is successfully modified.', '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: userAssigmentEvaluateModel });
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
            width: '65vw',
            height: '85vh',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.evaluateAssignmentFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }
   
    createAssigmentEvaluationData() {

        const formData = new FormData();
        formData.append('assesmentData', this.evaluateAssignmentFormGroup.get('fileSourceControl')?.value);
        formData.append('evaluatedData', this.assignmentContent);
        formData.append('assignmentId', this.data.userAssignment.assignmentId);
        formData.append('status', this.status);
        formData.append('stars', this.stars.toString());
        formData.append('evaluatedFileName', this.evaluateAssignmentFormGroup.get('fileSourceControl')?.value.name);
        return formData;
    }
}