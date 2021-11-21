import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { ILibraryContentEntity } from '../../entities/library-content';

// services
import { AcmeSCRoomLibraryService } from '../../services/acme-sc-room-library.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

import { AcmeSCUserConfirmationComponent } from '../../../shared/components/dialogs/user-confirmation/acme-sc-user-confirmation.component';

@Component({
    selector: 'acme-sc-room-library-content',
    templateUrl: './acme-sc-library-content-item.component.html',
    styleUrls: ['./acme-sc-library-content-item.component.scss']
})
export class AcmeSCRoomLibraryContentItemComponent {
    @Input() libraryContent: ILibraryContentEntity
    @Input() roomOwner: string
    @Output() contentDeleted = new EventEmitter<string>();

    contentTags = [];
    tagRemove: boolean = false;
    isContentOrRoomOwner = false;
    isProgress = false;
    isSuccessFull = true;

    constructor(private acmeSCRoomLibraryService: AcmeSCRoomLibraryService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private snackBar: MatSnackBar,
        public dialog: MatDialog) {

    }

    ngOnInit() {
        this.contentTags = this.libraryContent.tags.split(',')
        if (this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
            this.roomOwner.toUpperCase().trim() ||

            this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
            this.libraryContent.owner.toUpperCase().trim()) {

            this.isContentOrRoomOwner = true;
        }
    }

    openDocument() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomLibraryService.getLibrarycontent(this.libraryContent._id, this.libraryContent.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                //
                if (response.data.contentType !== 'link') {
                    var blob = new Blob([this._base64ToArrayBuffer(response.data.fileData)], { type: response.data.contentType });
                    const url = URL.createObjectURL(blob);
                    window.open(url);
                } else {
                    var blob = new Blob([this._base64ToArrayBuffer(response.data.fileData)]);
                    var reader = new FileReader();
                    reader.onload = function () {
                        const url = reader.result.toString();
                        window.open(
                            url, "_blank");
                    }
                    reader.readAsText(blob);
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }

    deleteLibrarycontent() {
        const dialogRef = this.dialog.open(AcmeSCUserConfirmationComponent, {
            width: '500px',
            height: '150',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { message: 'This action will remove content from library.' }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data === 'true') {
                this.deleteDocument();
            }
        });
    }

    deleteDocument() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomLibraryService.deleteLibrarycontent(this.libraryContent._id, this.libraryContent.roomId, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.contentDeleted.emit(this.libraryContent._id);
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
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
