import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

// validator
import { WhiteSpaceValidator } from '../../../../../core/validators/acme-sc-whitespace-validator';

import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// services
import { AcmeSCRoomAssesmentService } from '../../../services/acme-sc-room-assesment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../../shared/services/acme-sc-ui-utiltities.services';

//translation
import { TranslateService } from '@ngx-translate/core';


import Quill from 'quill';
import ImageResize from 'quill-image-resize-module';

Quill.register('modules/imageResize', ImageResize);

@Component({
    selector: 'acme-sc-submit-assesment',
    templateUrl: './acme-sc-submit-assesment.component.html',
    styleUrls: ['./acme-sc-submit-assesment.component.scss']
})
export class AcmeSubmitAssesmentComponent {
    isProgress = false;
    submitAssesmentFormGroup: any;
    buttonLabel: string = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_SUBMISSION_BUTTON_LABEL_SUBMIT');
    assesmentContent: string = '';

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

    constructor(public dialogRef: MatDialogRef<AcmeSubmitAssesmentComponent>, private formBuilder: FormBuilder,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {

        this.submitAssesmentFormGroup = this.formBuilder.group({
            fileNameControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]]
        });

    }

    get f() {
        return this.submitAssesmentFormGroup.controls;
    }

    createAssesmentEvaluation() {
        let body =this.createAssesmentSubmissionData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssesmentService.createUserAssignment(body, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESSMENT_DIALOG_SUBMISSION_ASSESSMENT_SUBMIT_SUCCESS'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: body });
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

    createAssesmentSubmissionData() {
        const formData = new FormData();
        formData.append('assesmentData', this.submitAssesmentFormGroup.get('fileSourceControl')?.value);
        formData.append('data',this.assesmentContent);
        formData.append('assesmentId', this.data.assesmentId);
        formData.append('submittedFileName', this.submitAssesmentFormGroup.get('fileSourceControl')?.value.name);
        return formData;
    }

    cancelAssesmentSubmission() {
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
            this.submitAssesmentFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }
}