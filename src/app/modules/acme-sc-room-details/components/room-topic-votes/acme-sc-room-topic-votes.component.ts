import { Component, Input } from '@angular/core'
import { ITopicEntity } from '../../entities/topic.entity';

// services
import { AcmeRoomTopicsService } from '../../services/acme-sc-room-topics.service';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

@Component({
    selector: 'acme-sc-room-topic-votes',
    templateUrl: './acme-sc-room-topic-votes.component.html',
    styleUrls: ['./acme-sc-room-topic-votes.component.scss']
})
export class AcmeSCRoomTopicVotesComponent {
    
    @Input() topic: ITopicEntity
    votesCount:Number;
    isProgress = false;
    
    constructor(private acmeRoomTopicsService: AcmeRoomTopicsService,
        private acmeSCAuthorizationService: AcmeSCAuthorizationService) {
    }

    
    ngOnInit() {
                
        this.getTopicVotesCount();
    }
    
    getTopicVotesCount() {
        this.isProgress=true;
        this.acmeRoomTopicsService.getTopicVotesCount(this.topic._id, this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                this.isProgress=false;
                const response: any = value;
                this.votesCount=response.data.votesCount;
            },
            err => {
                this.isProgress=false;
                this.votesCount =NaN;
            }
        );
    }
}
