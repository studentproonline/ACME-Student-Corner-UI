import { Component, Input, SimpleChanges, SimpleChange, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { IAssesmentEntity } from '../../entities/assesment';
import {IRoomUserEntity } from '../../../shared/entities/acme-sc-room-user.entity';

import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

// services
import { AcmeSCRoomReportCardService } from '../../services/acme-sc-room-report-card.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';

@Component({
    selector: 'acme-sc-room-assesment-group-list',
    templateUrl: './acme-sc-room-assesment-group-list.component.html',
    styleUrls: ['./acme-sc-room-assesment-group-list.component.scss']
})
export class AcmeSCRoomAssesmentGroupListComponent {
    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';
    @Input() selectedUser: IRoomUserEntity;
    @Output() groupItemClicked = new EventEmitter<string>();
    
    isProgress = false;
    isSuccessFull = true;
    assesmentResponseMessage = '';
    roomRole;
    isContentOrRoomOwner;

    roomAssesmentsList: IAssesmentEntity[] = [];
    filteredRoomAssesmentsList: IAssesmentEntity[] = [];

    constructor(public dialog: MatDialog, private acmeSCRoomReportCardService: AcmeSCRoomReportCardService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private acmesharedUiTuilitiesService: AcmesharedUiTuilitiesService) {
    }

    ngOnChanges(changes: SimpleChanges) {
        const filterSearchText: SimpleChange = changes.filterText;
        if (filterSearchText) {
            this.filteredRoomAssesmentsList = this.filterTopic(filterSearchText.currentValue);
        }
    }

    ngOnInit() {
        this.getRole();
    }

    assesmentGroupItemClicked($event) {
        this.groupItemClicked.emit($event);
    }

    refresAssesmentsContent() {
        this.roomAssesmentsList.length = 0;
        this.getAssesments();
    }

    getAssesments() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomReportCardService.getAssesments(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomAssesmentsList = response.data;
                let flags = {};
                let assesmentGroups = this.roomAssesmentsList.filter(function (assesment) {
                    if (flags[assesment.group]) {
                        return false;
                    }
                    flags[assesment.group] = true;
                    return true;

                });
                this.roomAssesmentsList = assesmentGroups;
                this.filteredRoomAssesmentsList = assesmentGroups;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.assesmentResponseMessage = err.error.description;
                } else {
                    this.assesmentResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
    }

    getRole() {
        this.isProgress = true;
        this.isSuccessFull = false;

        this.acmeSCRoomReportCardService.getUserRoomRole(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.roomRole = response.data;
                if (this.roomRole.role === 'Owner' || this.roomRole.role === 'Admin') {
                    this.isContentOrRoomOwner = true;
                }
                if (this.isContentOrRoomOwner) {
                    this.getAssesments();
                } else {
                    this.isProgress = false;
                    this.isSuccessFull = false;
                    this.assesmentResponseMessage = 'You are not having privilages to generate report card, only admins and room owners are allowed to generate report card';
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.assesmentResponseMessage = err.error.description;
                } else {
                    this.assesmentResponseMessage = 'Server Error';
                }
                if (err.status === 401 || err.status === 401.1) {
                    //  show session expired dialog
                    this.openSessionExpiredDialog();
                }
            }
        );
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

    private filterTopic(value: string): IAssesmentEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.roomAssesmentsList;
        } else {
            return this.roomAssesmentsList.filter(assesment => assesment.group.toLowerCase().includes(filterValue));
        }
    }
}
