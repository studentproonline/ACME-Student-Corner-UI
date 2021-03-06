import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-topic',
    templateUrl: './acme-sc-room-topic.component.html',
    styleUrls: ['./acme-sc-room-topic.component.scss']
})
export class AcmeSCRoomTopicItemComponent implements OnInit {
    @Input() topic: ITopicEntity
    @Input() roomType: string
    @Input() roomName: string
    @Input() height

    tagRemove: boolean = false;
    topicClosed: boolean = false;
    topicClosedEnabled: boolean = true;
    closeColor = "warn";
    isProgress = false;
    isTopicOrRoomOwner = false;

    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService, private snackBar: MatSnackBar,
        private router: Router,
        private translateService: TranslateService) {

    }

    ngOnInit() {
        if (this.topic.status === 'Active') {
            this.topicClosed = false;
        } else {
            this.topicClosed = true;
        }
        const userRommRole = this.acmeSCAuthorizationService.getUserRoomRole();
        if (userRommRole === 'Owner' || userRommRole === 'Admin' ||
            this.topic.owner.toUpperCase() === this.acmeSCAuthorizationService.getSession().email.toUpperCase()) {
            this.isTopicOrRoomOwner = true;
        }
    }

    getHeight() {
        return {
            height: this.height
        };
    }

    lauchTopic() {
        this.router.navigateByUrl('/topics/comments?topicId=' + this.topic._id + "&roomType=" + this.roomType + '&roomName=' + this.roomName);
    }

    updateTopic($event) {
        let newStatus = ''
        if ($event === 'Closed') {
            newStatus = 'Closed'
        } else {
            newStatus = 'Active'
        }
        this.isProgress = true;
        this.acmeRoomTopicsService.updateRoomTopic(this.topic._id, newStatus, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open(this.translateService.instant('ROOM_DETAILS_TOPIC_ITEM_TOPIC_UPDATED'), '', {
                    duration: 3000
                });
                if(newStatus === 'Active') {
                    this.topicClosed = false;
                } else {
                    this.topicClosed = true;
                }
            },
            err => {
                this.isProgress = false; // end progress
                this.snackBar.open(err.error.description, '', {
                    duration: 3000
                });
            }
        );
    }
}
