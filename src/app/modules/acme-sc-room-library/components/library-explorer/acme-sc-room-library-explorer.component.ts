import { Component} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { AcmeSCRoomLibraryService } from '../../services/acme-sc-room-library.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

@Component({
    selector: 'acme-sc-library-explorer',
    templateUrl: './acme-sc-room-library-explorer.component.html',
    styleUrls: ['./acme-sc-room-library-explorer.component.scss']
})
export class AcmeSCLibraryExplorerComponent {
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

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
    private route: ActivatedRoute, private router: Router, private acmeSCRoomLibraryService: AcmeSCRoomLibraryService){

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
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCRoomLibraryService.getRoomById(this.roomId,this.acmeSCAuthorizationService.getAccessToken()).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                this.isSuccessFull = true;
                this.roomDetailsEntity = response.data;
                this.roomName=response.data.title;
                this.ownerName = response.data.email;
                if(this.loginEntity.email.toUpperCase().trim() === response.data.email.toUpperCase().trim()) {
                    this.isRoomOwner=true;
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.roomDetailsResponseMessage = err.error.description;
                } else {
                    this.roomDetailsResponseMessage = 'Server Error';
                }
            }
        );
    }

    searchTextchange($event) {
        this.filterText = $event;
    }

    userNameClicked($event) {
        console.log('nick name clicked')
    }

    gotoLibrary() {
        this.router.navigateByUrl ( '/home?roomType='+ this.roomType);
    }

    gotoRoomsList() {
        this.router.navigateByUrl ( '/home?roomType='+ this.roomType);
    }
}