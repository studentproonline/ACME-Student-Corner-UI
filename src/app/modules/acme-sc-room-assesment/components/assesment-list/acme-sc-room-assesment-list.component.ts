import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';

import { IAssesmentEntity } from '../../entities/assesment';

import { MatDialog } from '@angular/material/dialog';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

//dialogs
import { AcmeSUploadAssesmentComponent } from '../dialogs/upload-aasesment/acme-sc-upload-assesment.component'

// services
import { AcmeSCRoomAssesmentService } from '../../services/acme-sc-room-assesment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-assesment-list',
    templateUrl: './acme-sc-room-assesment-list.component.html',
    styleUrls: ['./acme-sc-room-assesment-list.component.scss']
})
export class AcmeSCRoomAssesmentListComponent {
    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';
    @Input() contentTypeFilter = '';

    isProgress = false;
    isSuccessFull = true;
    assesmentResponseMessage = '';
    roomRole;
    isContentOrRoomOwner;

    roomAssesmentsList: IAssesmentEntity[] = [];
    filteredroomAssesmentsList: IAssesmentEntity[] = [];

    constructor(public dialog: MatDialog, private acmeSCRoomAssesmentService: AcmeSCRoomAssesmentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService,
        private translateService: TranslateService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const filterSearchText: SimpleChange = changes.filterText;
        if (filterSearchText) {
            this.filteredroomAssesmentsList = this.filterTopic(filterSearchText.currentValue);
        }

        const contentTypeFilterText: SimpleChange = changes.contentTypeFilter;
        if (contentTypeFilterText) {
            this.filteredroomAssesmentsList = this.filterTopicByContent(this.roomAssesmentsList, contentTypeFilterText.currentValue);
        }
    }

    ngOnInit() {
        const userRommRole = this.acmeSCAuthorizationService.getUserRoomRole();
        if(userRommRole === 'Owner' || userRommRole === 'Admin') {
            this.isContentOrRoomOwner = true;
        }
        this.getAssesments();
    }

    refresAssesmentsContent() {
        this.roomAssesmentsList.length=0;
        this.getAssesments();
    }

    assesmentDeleted($event) {
        this.roomAssesmentsList.length=0;
        this.getAssesments();
    }

    assesmentUpdated($event) {
        this.roomAssesmentsList.length=0;
        this.getAssesments();
    }
    
    assesmentStatusUpdated($event) {
        this.roomAssesmentsList.length=0;
        this.getAssesments();
    }

    createNewAssesment() {
        const dialogRef = this.dialog.open(AcmeSUploadAssesmentComponent, {
            width: '55vw',
            height:'70vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: 'New', roomId: this.room._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getAssesments();
            }
        });
    }

    getAssesments() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomAssesmentService.getAssesments(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomAssesmentsList = response.data;
                this.filteredroomAssesmentsList =  this.roomAssesmentsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.assesmentResponseMessage = err.error.description;
                } else {
                    this.assesmentResponseMessage = this.translateService.instant('ROOM_ASSESMENT_LIST_SERVER_ERROR');
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    private filterTopic(value: string): IAssesmentEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.filterTopicByContent(this.roomAssesmentsList, this.contentTypeFilter);
        } else {
            let firstLevelFilterArray = this.roomAssesmentsList.filter(assesment => assesment.title.toLowerCase().includes(filterValue));
            return this.filterTopicByContent(firstLevelFilterArray, this.contentTypeFilter);
        }
    }

    private filterTopicByContent(array: any, value: string): IAssesmentEntity[] {
        const filterValue = value;
        if (filterValue=== '' || filterValue === 'All') {
            return array;
        } else {
            return array.filter(assesment => assesment.status.includes(value));
        }
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
}