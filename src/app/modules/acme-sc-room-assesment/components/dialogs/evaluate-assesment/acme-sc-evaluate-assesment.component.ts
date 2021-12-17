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
    selector: 'acme-sc-evaluate-assesment',
    templateUrl: './acme-sc-evaluate-assesment.component.html',
    styleUrls: ['./acme-sc-evaluate-assesment.component.scss']
})
export class AcmeEvaluateAssesmentComponent {
    isProgress = false;
    evaluateAssesmentFormGroup: any;
    buttonLabel: string = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_EVALUATION_BUTTON_LABEL_SUBMIT');
    evaluationContent: string = '';
    marksPlaceHolder;
    fileName: string='';

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

    constructor(public dialogRef: MatDialogRef<AcmeEvaluateAssesmentComponent>, private formBuilder: FormBuilder,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {

        this.evaluateAssesmentFormGroup = this.formBuilder.group({
            gradeControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            marksControl: ['', [Validators.required]],
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]]
        });

        this.marksPlaceHolder = 'Total Marks ' + this.data.userAssesment.totalMarks;

    }

    ngOnInit() {
        if(this.data.userAssesment) {
            this.evaluateAssesmentFormGroup.get('gradeControl')?.setValue(this.data.userAssesment.grade);
            this.evaluateAssesmentFormGroup.get('marksControl')?.setValue(this.data.userAssesment.marksObtained);
            this.evaluationContent = this.data.userAssesment.evaluatedData;
            this.fileName = this.data.userAssesment.evaluatedFileName;
        }
    }

    get f() {
        return this.evaluateAssesmentFormGroup.controls;
    }

    submitAssesmentEvaluation() {
        let body =this.createAssesmentEvaluationData();
        // show progress
        this.isProgress = true;
        this.acmeSCRoomAssesmentService.evaluateUserAssesment(this.data.userAssesment._id,body, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESSMENT_DIALOG_EVALUATION_ASSESMENT_EVALUATED_SUCCESS'), '', {
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

    createAssesmentEvaluationData() {
        const formData = new FormData();
        formData.append('assesmentData', this.evaluateAssesmentFormGroup.get('fileSourceControl')?.value);
        formData.append('data',this.evaluationContent);
        formData.append('assesmentId', this.data.assesmentId);
        formData.append('evaluatedFileName', this.evaluateAssesmentFormGroup.get('fileSourceControl')?.value.name);
        formData.append('grade', this.evaluateAssesmentFormGroup.get('gradeControl')?.value);
        formData.append('marksObtained', this.evaluateAssesmentFormGroup.get('marksControl')?.value);
        return formData;
    }

    cancelAssesmentEvaluation() {
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
            this.evaluateAssesmentFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }


}