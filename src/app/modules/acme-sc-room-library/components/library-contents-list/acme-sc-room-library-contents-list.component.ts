import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';

import { ILibraryContentEntity } from '../../entities/library-content';

import { MatDialog } from '@angular/material/dialog';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

import { AcmeSUploadContentComponent } from '../dialogs/upload-content/acme-sc-upload-content.component';


// services
import { AcmeSCRoomLibraryService } from '../../services/acme-sc-room-library.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

@Component({
    selector: 'acme-sc-room-library-contents-list',
    templateUrl: './acme-sc-room-library-contents-list.component.html',
    styleUrls: ['./acme-sc-room-library-contents-list.component.scss']
})
export class AcmeSCRoomTopicsListComponent {

    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';

    isProgress = false;
    isSuccessFull = true;
    libraryResponseMessage = '';

    roomLibraryContentsList: ILibraryContentEntity[] = [];
    filteredroomLibraryContentsList: ILibraryContentEntity[] = [];

    constructor(public dialog: MatDialog, private acmeSCRoomLibraryService: AcmeSCRoomLibraryService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService) {

      
    }

    ngOnChanges(changes: SimpleChanges) {
        const filterSearchText: SimpleChange = changes.filterText;
        if(filterSearchText) {
            this.filteredroomLibraryContentsList=this.filterTopic(filterSearchText.currentValue);
        }
    }

    ngOnInit() {
        this.getLibraryContents();
    }

    refreshLibraryContent() {
        this.getLibraryContents();
    }

    uploadNewContent() {
        const dialogRef = this.dialog.open(AcmeSUploadContentComponent, {
            width: '700px',
            height: '380px',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { roomId: this.room._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getLibraryContents();
            }
        });
    }

    libraryContentDeleted($event) {
        this.getLibraryContents();
    }

    getLibraryContents() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomLibraryService.getLibrarycontents(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomLibraryContentsList = response.data;
                this.filteredroomLibraryContentsList = this.roomLibraryContentsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.libraryResponseMessage = err.error.description;
                } else {
                    this.libraryResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    private filterTopic(value: string): ILibraryContentEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.roomLibraryContentsList;
        } else {
            return this.roomLibraryContentsList.filter(roomsLibraryContentList => roomsLibraryContentList.name.toLowerCase().includes(filterValue));
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
}
