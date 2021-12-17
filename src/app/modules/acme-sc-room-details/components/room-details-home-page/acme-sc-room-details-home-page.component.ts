import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeRoomDetailsService } from '../../services/acme-sc-room-details.service';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { IRoomEntity } from '../../../shared/entities/acme-sc-room.entity';

//translation
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'acme-sc-room-details-home-page',
    templateUrl: './acme-sc-room-details-home-page.component.html',
    styleUrls: ['./acme-sc-room-details-home-page.component.scss']
})
export class AcmeSCRoomDetailsHomePageComponent {
    loginEntity: ILoginEntity;
    roomDetailsEntity: IRoomEntity;
    nickName: string;
    fullName: string;
    roomId: string;
    roomType: string;
    roomName: string;
    ownerName: string;

    isProgress = false;
    isSuccessFull = false;
    isRoomOwner = false;
    roomDetailsResponseMessage = '';
    filterText: string = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
         private route: ActivatedRoute, private acmeRoomDetailsService: AcmeRoomDetailsService,
         public dialog: MatDialog,
         public translateService: TranslateService) {
        
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
                this.roomType=params.roomType;
                this.getRoomDetails();
            });
    }

    getRoomDetails() {
        this.roomDetailsEntity = this.acmeSCAuthorizationService.getRoomDetails();
        const userRoomRole = this.acmeSCAuthorizationService.getUserRoomRole();
        if(userRoomRole === 'Owner' || userRoomRole === 'Admin') {
            this.isRoomOwner = true;
        }
        this.isSuccessFull = true;
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }
    
    searchTextchange($event) {
      this.filterText = $event;
    }
}
