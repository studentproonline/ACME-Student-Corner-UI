import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';

import { IAssignmentEntity } from '../../entities/assignment';

import { MatDialog } from '@angular/material/dialog';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

//dialogs
import { AcmeSUploadAssignmentComponent } from '../dialogs/upload-assignment/acme-sc-upload-assignment.component'

// services
import { AcmeSCRoomAssignmentService } from '../../services/acme-sc-room-assigment.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

@Component({
    selector: 'acme-sc-room-assignment-list',
    templateUrl: './acme-sc-room-assignment-list.component.html',
    styleUrls: ['./acme-sc-room-assignment-list.component.scss']
})
export class AcmeSCRoomAssignmentListComponent {

    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';
    @Input() contentTypeFilter = '';

    isProgress = false;
    isSuccessFull = true;
    assignmentResponseMessage = '';

    isMore = false;
    currentPageNumber = 0;
    roomRole;
    isContentOrRoomOwner= false;

    roomAssignmentsList: IAssignmentEntity[] = [];
    roomAssignmentsTotalList: IAssignmentEntity[] = [];
    filteredroomAssignmentsList: IAssignmentEntity[] = [];

    constructor(public dialog: MatDialog, private acmeSCRoomLAssignmentService: AcmeSCRoomAssignmentService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const filterSearchText: SimpleChange = changes.filterText;
        if (filterSearchText) {
            this.filteredroomAssignmentsList = this.filterTopic(filterSearchText.currentValue);
        }

        const contentTypeFilterText: SimpleChange = changes.contentTypeFilter;
        if (contentTypeFilterText) {
            this.filteredroomAssignmentsList = this.filterTopicByContent(this.roomAssignmentsTotalList, contentTypeFilterText.currentValue);
        }
    }

    ngOnInit() {
        this.getRole();
    }

    refresAssignmentsContent() {
        this.roomAssignmentsTotalList.length=0;
        this.currentPageNumber = 0;
        this.getAssignments(0);
    }

    createNewAssignment() {
        const dialogRef = this.dialog.open(AcmeSUploadAssignmentComponent, {
            width: '65vw',
            height:'85vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { mode: 'New', roomId: this.room._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getAssignments(0);
            }
        });
    }

    fetchMoreRecords() {
        this.currentPageNumber = this.currentPageNumber + 1;
        this.getAssignments(this.currentPageNumber);
    }

    assignmentDeleted($event) {
        this.currentPageNumber = 0;
        this.roomAssignmentsTotalList.length=0;
        this.getAssignments(0);
    }

    assignmentUpdated($event) {
        this.currentPageNumber = 0;
        this.roomAssignmentsTotalList.length=0;
        this.getAssignments(0);
    }

    getAssignments(pageNumber: Number) {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomLAssignmentService.getAssignments(pageNumber, this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomAssignmentsList = response.data;
                if (this.roomAssignmentsList && this.roomAssignmentsList.length > 0) {
                    this.roomAssignmentsTotalList = this.roomAssignmentsTotalList.concat(this.roomAssignmentsList);
                    this.filteredroomAssignmentsList=this.roomAssignmentsTotalList;
                    if (this.roomAssignmentsList.length >= 10) {
                        this.isMore = true;
                    } else {
                        this.currentPageNumber = this.currentPageNumber - 1;
                        this.isMore = false;
                    }
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                this.isMore = false;
                if (err.error && err.error.description) {
                    this.assignmentResponseMessage = err.error.description;
                } else {
                    this.assignmentResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    private filterTopic(value: string): IAssignmentEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.filterTopicByContent(this.roomAssignmentsTotalList, this.contentTypeFilter);
        } else {
            let firstLevelFilterArray = this.roomAssignmentsTotalList.filter(assigment => assigment.title.toLowerCase().includes(filterValue));
            return this.filterTopicByContent(firstLevelFilterArray, this.contentTypeFilter);
        }
    }

    private filterTopicByContent(array: any, value: string): IAssignmentEntity[] {
        const filterValue = value;
        if (filterValue=== '' || filterValue === 'All') {
            return array;
        } else {
            return array.filter(roomAssignmentsTotalList => roomAssignmentsTotalList.status.includes(value));
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

    getRole() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomLAssignmentService.getUserRoomRole(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.roomRole = response.data;
                if(this.roomRole.role === 'Owner' || this.roomRole.role === 'Admin') {
                    this.isContentOrRoomOwner= true;
                }
                this.getAssignments(0);
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.assignmentResponseMessage = err.error.description;
                } else {
                    this.assignmentResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }
}