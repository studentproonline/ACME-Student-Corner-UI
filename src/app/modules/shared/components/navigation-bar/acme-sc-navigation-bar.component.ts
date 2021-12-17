import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';

import { IRoomEntity } from '../../entities/acme-sc-room.entity';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-navigation-bar',
    templateUrl: './acme-sc-navigation-bar.component.html',
    styleUrls: ['./acme-sc-navigation-bar.component.scss']
})
export class AcmeSCNavigationBarComponent {
    @Input() room: IRoomEntity;
    @Input() roomType: any;
    constructor( private router: Router, private translateService: TranslateService) {

    }

    gotoRoomsList() {
        this.router.navigateByUrl ( '/home?roomType='+ this.roomType);
    }
    gotoHome() {
        this.router.navigateByUrl ( '/home?roomType='+this.translateService.instant('EXPLORER_NAVIGATION_SIDE_BAR_MY_HOME'));
    }

    gotoTopics() {
        this.router.navigateByUrl ( '/roomDetails?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }
    gotoAssignments() {
        this.router.navigateByUrl ( '/assignments?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }
    gotoAssesments() {
        this.router.navigateByUrl ( '/assesments?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }
    gotoLibrary() {
        this.router.navigateByUrl ( '/library?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }

    gotoReportCards() {
        this.router.navigateByUrl ( '/reportcards?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }

    gotoConferenceCall() {
        this.router.navigateByUrl ( '/conference?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }

}