import { Component, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

// services
import { AcmeSCRoomLibraryService } from '../../../services/acme-sc-room-library.service';
import { AcmeSCAuthorizationService } from '../../../../../core/services/acme-sc-authorization.service';

// validator
import { WhiteSpaceValidator } from '../../../../../core/validators/acme-sc-whitespace-validator';

import { AcmeSCSessionExpiredComponent } from '../../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'acme-sc-upload-content',
    templateUrl: './acme-sc-upload-content.component.html',
    styleUrls: ['./acme-sc-upload-content.component.scss']
})
export class AcmeSUploadContentComponent {
    isProgress = false;
    documentuploadFormGroup: any;
    selectedTab = "Documents";

    tags: string[] = [];

    selectable = false;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    constructor(public dialogRef: MatDialogRef<AcmeSUploadContentComponent>, private formBuilder: FormBuilder,
        private acmeSCRoomLibraryService: AcmeSCRoomLibraryService, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar, @Inject(MAT_DIALOG_DATA) public data: any,
        public dialog: MatDialog) {

        this.documentuploadFormGroup = this.formBuilder.group({
            fileDescriptionControl: ['', [Validators.required, WhiteSpaceValidator.whiteSpace]],
            fileControl: ['', [Validators.required]],
            fileSourceControl: ['', [Validators.required]],
            tagControl: []
        });

    }

    get f() {
        return this.documentuploadFormGroup.controls;
    }

    uploadContent() {

        const formData = new FormData();
        formData.append('libraryFile', this.documentuploadFormGroup.get('fileSourceControl')?.value);
        formData.append('title', this.documentuploadFormGroup.get('fileTitleControl')?.value);
        formData.append('description', this.documentuploadFormGroup.get('fileDescriptionControl')?.value);
        formData.append('roomId', this.data.roomId);
        formData.append('documentType', 'document');
        formData.append('tags', this.tags.toString());

        // show progress
        this.isProgress = true;
        this.acmeSCRoomLibraryService.uploadDocument(this.acmeSCAuthorizationService.getAccessToken(), formData).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open('New content is successfully uploaded.', '', {
                    duration: 3000
                });
                this.dialogRef.close({ data: formData });
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

    cancelUploadContent() {
        this.dialogRef.close();
    }

    onFileChange(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.documentuploadFormGroup.patchValue({
                fileSourceControl: file
            });
        }
    }

    openSessionExpiredDialog(): void {
        const dialogRef = this.dialog.open(AcmeSCSessionExpiredComponent, {
            width: '700px',
            height: '100px',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
    isValid() {
        if (this.selectedTab === 'Documents') {
            if (this.documentuploadFormGroup.controls['fileDescriptionControl'].errors?.required ||
                this.documentuploadFormGroup.controls['fileDescriptionControl'].errors?.whiteSpace ||
                this.documentuploadFormGroup.controls['fileControl'].errors?.required) {
                return false;
            }
            return true;
        } else {

        }
        return false;
    }

    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        // Add tag
        if(this.tags.find(key => key.toUpperCase().trim() === value.toUpperCase().trim()) === undefined) {
            this.tags.push(value);
        }
          
        // Clear the input value
        event.chipInput!.clear();
    
        this.documentuploadFormGroup.controls['tagControl'].setValue(null);
    }

    removeTag(tag: string) {

    }

}
