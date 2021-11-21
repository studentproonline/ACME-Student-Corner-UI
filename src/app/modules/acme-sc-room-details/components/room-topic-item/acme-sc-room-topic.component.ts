import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

@Component({
    selector: 'acme-sc-room-topic',
    templateUrl: './acme-sc-room-topic.component.html',
    styleUrls: ['./acme-sc-room-topic.component.scss']
})
export class AcmeSCRoomTopicItemComponent implements OnInit {
    @Input() topic: ITopicEntity
    @Input() roomType: string

    tagRemove: boolean = false;
    topicClosed: boolean = false;
    topicClosedEnabled: boolean = true;
    closeColor = "warn";
    isProgress = false;
    isTopicOrRoomOwner = false;

    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService, private snackBar: MatSnackBar,
        private router: Router) {
           
    }

    ngOnInit() {
        if (this.topic.status === 'Active') {
            this.topicClosed = false;
        } else {
            this.topicClosed = true;
        }
        if (this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
                this.topic.roomOwner.toUpperCase().trim()||
                
                this.acmeSCAuthorizationService.getSession().email.toUpperCase().trim() ===
                this.topic.owner.toUpperCase().trim()) {
                
                    this.isTopicOrRoomOwner = true;
        }
    }

    lauchTopic() {
        this.router.navigateByUrl('/topics/comments?topicId='+this.topic._id+"&roomType="+this.roomType);
    }

    updateTopic($event) {
        let newStatus = ''
        if ($event.checked === true) {
            newStatus = 'Closed'
        } else {
            newStatus = 'Active'
        }
        this.isProgress = true; 
        this.acmeRoomTopicsService.updateRoomTopic(this.topic._id, newStatus, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress = false; // end progress
                this.snackBar.open('Topic is successfully updated.', '', {
                    duration: 3000
                });
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
