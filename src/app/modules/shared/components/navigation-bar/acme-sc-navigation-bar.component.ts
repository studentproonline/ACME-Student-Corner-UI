import { Component, Input} from '@angular/core';
import { Router } from '@angular/router';

import { IRoomEntity } from '../../entities/acme-sc-room.entity';

@Component({
    selector: 'acme-sc-navigation-bar',
    templateUrl: './acme-sc-navigation-bar.component.html',
    styleUrls: ['./acme-sc-navigation-bar.component.scss']
})
export class AcmeSCNavigationBarComponent {
    @Input() room: IRoomEntity;
    @Input() roomType: any;
    constructor( private router: Router) {

    }

    gotoRoomsList() {
        this.router.navigateByUrl ( '/home?roomType='+ this.roomType);
    }
    gotoHome() {
        this.router.navigateByUrl ( '/home?roomType=My Rooms');
    }

    gotoTopics() {
        this.router.navigateByUrl ( '/roomDetails?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }
    gotoLibrary() {
        this.router.navigateByUrl ( '/library?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }

    gotoConferenceCall() {
        this.router.navigateByUrl ( '/conference?roomType='+ this.roomType + '&roomId='+ this.room._id);
    }

}