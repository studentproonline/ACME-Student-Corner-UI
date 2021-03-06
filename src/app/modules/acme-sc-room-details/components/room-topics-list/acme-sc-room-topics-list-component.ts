import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCSRoomCreateTopicComponent } from '../dialogs/create-topic/acme-sc-create-topic.component';
import { AcmeSCSessionExpiredComponent } from '../../../shared/components/dialogs/session-expired/acme-sc-session-expired.component';

import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmesharedUiTuilitiesService } from '../../../shared/services/acme-sc-ui-utiltities.services';
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-topics-list',
    templateUrl: './acme-sc-room-topics-list-component.html',
    styleUrls: ['./acme-sc-room-topics-list-component.scss']
})
export class AcmeSCRoomTopicsListComponent {
    @Input() room: any;
    @Input() roomType: string;
    @Input() filterText = '';

    isProgress = true;
    isSuccessFull = false;
    topicsResponseMessage = '';
    clientHeight = 0;
    topicHeight = '';

    roomTopicsList: ITopicEntity[] = [];
    filteredRoomTopicsList: ITopicEntity[] = [];

    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private translateService: TranslateService,
        public dialog: MatDialog) {

    }

    ngOnChanges(changes: SimpleChanges) {
        const currentRoom: SimpleChange = changes.room;
        if (currentRoom) {
            this.room = currentRoom.currentValue;
            if (this.room) {
                this.getRoomTopicsList();
            }
        }

        const filterSearchText: SimpleChange = changes.filterText;
        if (filterSearchText) {
            this.filteredRoomTopicsList = this.filterTopic(filterSearchText.currentValue);
        }

    }

    createTopic() {
        const dialogRef = this.dialog.open(AcmeSCSRoomCreateTopicComponent, {
            width: '40vw',
            height: '45vh',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: { roomId: this.room._id }
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data) {
                this.getRoomTopicsList();
            }
        });
    }

    refreshTopicsList() {
        this.getRoomTopicsList();
    }

    private filterTopic(value: string): ITopicEntity[] {
        const filterValue = value.toLowerCase();
        if (filterValue.toLowerCase().trim() === '') {
            return this.roomTopicsList;
        } else {
            return this.roomTopicsList.filter(roomsTopicsList => roomsTopicsList.title.toLowerCase().includes(filterValue));
        }
    }

    getRoomTopicsList() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeRoomTopicsService.getRoomTopics(this.room._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomTopicsList = response.data;
                this.filteredRoomTopicsList = this.roomTopicsList;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.topicsResponseMessage = err.error.description;
                } else {
                    this.topicsResponseMessage = this.translateService.instant('ROOM_DETAILS_TOPIC_LIST_SERVER_ERROR');
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
            width: '45vw',
            height: '14vh',
            disableClose: true,
            data: {}
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }
}
