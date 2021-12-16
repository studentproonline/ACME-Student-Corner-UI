import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

@Component({
    selector: 'acme-sc-assignment-explorer',
    templateUrl: './acme-sc-room-assignment-explorer.component.html',
    styleUrls: ['./acme-sc-room-assignment-explorer.component.scss']
})
export class AcmeSCAssignmentExplorerComponent {
    loginEntity: ILoginEntity;
    nickName: string;
    fullName: string;
    roomId: string;
    roomType: string;
    roomName: string;
    ownerName: string;
    roomDetailsEntity: any;

    isProgress = false;
    isSuccessFull = false;
    isRoomOwner = false;
    roomDetailsResponseMessage = '';
    filterText: string = '';
    contentFilterType='All';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute ) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.roomId = params.roomId;
                this.roomType = params.roomType;
                this.roomDetailsEntity = this.acmeSCAuthorizationService.getRoomDetails();
                const userRommRole = this.acmeSCAuthorizationService.getUserRoomRole();
                if(userRommRole === 'Owner' || userRommRole === 'Admin') {
                    this.isRoomOwner = true;
                }
                this.isSuccessFull = true;
            });
    }

    searchTextchange($event) {
        this.filterText = $event;
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }

    OnAssignmentTypeSelected($event) {
        this.contentFilterType =$event;
    }
}
