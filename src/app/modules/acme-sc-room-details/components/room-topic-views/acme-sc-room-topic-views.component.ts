import { Component, Input, OnInit } from '@angular/core'
import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

@Component({
    selector: 'acme-sc-room-topic-views',
    templateUrl: './acme-sc-room-topic-views.component.html',
    styleUrls: ['./acme-sc-room-topic-views.component.scss']
})
export class AcmeSCRoomTopicViewsComponent  implements OnInit {
    @Input() topic: ITopicEntity
    commentsCount:Number;
    isProgress = false;

    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService) {


    }

    ngOnInit() {
                
        this.getTopicCommentsCount();
    }
    getTopicCommentsCount() {
        this.isProgress=true;
        this.acmeRoomTopicsService.getTopicCommentsCount(this.topic._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress=false;
                const response: any = value;
                this.commentsCount=response.data.commentCount;
            },
            err => {
                this.isProgress=false;
                this.commentsCount =NaN;
            }
        );
    }
}
