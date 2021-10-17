import { Component, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCSRoomCreateTopicComponent } from '../dialogs/create-topic/acme-sc-create-topic.component';

import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';

@Component({
    selector: 'acme-sc-room-topics-list',
    templateUrl: './acme-sc-room-topics-list-component.html',
    styleUrls: ['./acme-sc-room-topics-list-component.scss']
})
export class AcmeSCRoomTopicsListComponent {
    @Input() room: any;
    @Input() roomType: string;

    isProgress = true;
    isSuccessFull = false;
    topicsResponseMessage = '';

    roomTopicsList:ITopicEntity[]=[];
    
    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        public dialog: MatDialog) {

    }

    ngOnChanges(changes: SimpleChanges) {
        const currentRoom: SimpleChange = changes.room;
        if(currentRoom) {
            this.room = currentRoom.currentValue;
            if(this.room) {
                this.getRoomTopicsList();
            }
        }

    }

    createTopic() {
        const dialogRef = this.dialog.open(AcmeSCSRoomCreateTopicComponent, {
            width: '700px',
            height: '250',
            panelClass: 'acme-sc-custom-container',
            disableClose: true,
            data: {roomId: this.room._id}
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.data ) {
                this.getRoomTopicsList();
            }
        });
    }

    refreshTopicsList() {
        this.getRoomTopicsList();
    }

    getRoomTopicsList() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeRoomTopicsService.getRoomTopics(this.room._id,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomTopicsList=response.data;
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.topicsResponseMessage = err.error.description;
                } else {
                    this.topicsResponseMessage = 'Server Error';
                }
            }
        );
    }
}
