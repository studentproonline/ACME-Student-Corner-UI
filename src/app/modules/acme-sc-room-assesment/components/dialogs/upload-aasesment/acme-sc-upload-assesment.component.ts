import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';

// services
import { AcmeSCRoomAssesmentService } from '../../../services/acme-sc-room-assesment.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../../shared/services/acme-sc-ui-utiltities.services';

// validator
import { WhiteSpaceValidator } from '../../../../../core/validators/acme-sc-whitespace-validator';

import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { MatDialog } from '@angular/material/dialog';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-upload-assesment',
    templateUrl: './acme-sc-upload-assesment.component.html',
    styleUrls: ['./acme-sc-upload-assesment.component.scss']
})
export class AcmeSUploadAssesmentComponent {
    isProgress = false;
    createAssesmentFormGroup: any;
    buttonLabel: string = 'Create';
    fileName: string='';
    dialogTitle = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_CREATE_NEW');

    constructor(public dialogRef: MatDialogRef<AcmeSUploadAssesmentComponent>, private formBuilder: FormBuilder,
        private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog, private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {

        this.createAssesmentFormGroup = this.formBuilder.group({
            titleControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            descriptionControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            groupControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            maxMarksControl: ['', [Validators.required]],
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]],
        });
        
        if (data.mode === 'New') {
            this.buttonLabel = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_ASSESSMENT_BUTTON_LABEL_CREATE');
        } else {
            this.buttonLabel = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_ASSESSMENT_BUTTON_LABEL_EDIT');
            this.dialogTitle = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_UPDATE');
        }
    }

    get f() {
        return this.createAssesmentFormGroup.controls;
    }


    ngOnInit() {
        if (this.data.mode !== 'New') {
            this.createAssesmentFormGroup.get('titleControl')?.setValue(this.data.assesment.title);
            this.createAssesmentFormGroup.get('descriptionControl')?.setValue(this.data.assesment.description);
            this.createAssesmentFormGroup.get('groupControl')?.setValue(this.data.assesment.group);
            this.createAssesmentFormGroup.get('maxMarksControl')?.setValue(this.data.assesment.maxMarks);
            this.fileName = this.data.assesment.fileName;
            this.dialogTitle = this.translateService.instant('ROOM_ASSESSMENT_DIALOG_UPDATE');
        }
    }

    createUpdateAssesment() {
        if(this.data.mode !== 'New') {
            this.updateAssesment();
        } else{
            this.createAssesment();
        }
    }

    updateAssesment() {
        let postBody;
        postBody = this.createAssesmentData();
        this.isProgress = true;
        this.acmeSCRoomAssesmentService.updateAssesment( this.data.assesment._id,postBody,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESSMENT_DIALOG_ASSESSMENT_UPDATE_SUCCESS'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: this.data.assesment });
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

    createAssesment() {
        let postBody;
        postBody = this.createAssesmentData();
        this.isProgress = true;
        this.acmeSCRoomAssesmentService.uploadAssesment(this.acmeSCAuthorizationService.getAccessToken(), postBody).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_ASSESSMENT_DIALOG_ASSESSMENT_UPLOAD_SUCCESS'), '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: postBody });
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

    cancelAssesmentCreation() {
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

    isValid() {
        if (this.createAssesmentFormGroup.controls['descriptionControl'].errors?.required ||
        this.createAssesmentFormGroup.controls['descriptionControl'].errors?.whiteSpace ||
        
        this.createAssesmentFormGroup.controls['titleControl'].errors?.required ||
        this.createAssesmentFormGroup.controls['titleControl'].errors?.whiteSpace ||
        
        this.createAssesmentFormGroup.controls['groupControl'].errors?.required ||
        this.createAssesmentFormGroup.controls['groupControl'].errors?.whiteSpace ||
        
        this.createAssesmentFormGroup.controls['maxMarksControl'].errors?.required) {
             return false;
        }
        else {
            if (this.data.mode === 'New') {
                if(this.createAssesmentFormGroup.controls['fileControl'].errors?.required) {
                    return false;
                }
            }
        }
        return true;
    }

    createAssesmentData() {
        const formData = new FormData();
        formData.append('assesmentData', this.createAssesmentFormGroup.get('fileSourceControl')?.value);
        formData.append('title', this.createAssesmentFormGroup.get('titleControl')?.value);
        formData.append('description', this.createAssesmentFormGroup.get('descriptionControl')?.value);
        formData.append('fileName', this.createAssesmentFormGroup.get('fileSourceControl')?.value.name);
        formData.append('group', this.createAssesmentFormGroup.get('groupControl')?.value);
        formData.append('maxMarks', this.createAssesmentFormGroup.get('maxMarksControl')?.value);
        formData.append('roomId', this.data.roomId);
        if (this.data.mode !== 'New') {
            formData.append('status',  this.data.assesment.status);
        }
        return formData;
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.createAssesmentFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }
}
