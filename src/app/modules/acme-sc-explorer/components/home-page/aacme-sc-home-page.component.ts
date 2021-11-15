import { Component, OnInit } from '@angular/core';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';

import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'acme-sc-home-page',
    templateUrl: './acme-sc-home-page.component.html',
    styleUrls: ['./acme-sc-home-page.component.scss']
})
export class AcmeSCMainPageComponent implements OnInit {

    loginEntity: ILoginEntity;
    nickName: string;
    fullName: string;
    email: string;
    selectedNavigationItem: string = 'My Rooms';
    isProgress = false;
    isSuccesfull= true;
    filterText: string = '';

    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService,
        private route: ActivatedRoute, private router: Router,) {

        this.loginEntity = this.acmeSCAuthorizationService.getSession();
        const firstNameChar = (this.loginEntity.firstName.substring(0, 1)).toUpperCase();
        const lastNameChar = (this.loginEntity.lastName.substring(0, 1)).toUpperCase();
        this.nickName = firstNameChar.concat(lastNameChar);
        this.fullName = this.loginEntity.firstName.concat(' ', this.loginEntity.lastName);
        this.email = this.loginEntity.email;
    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.selectedNavigationItem = params.roomType;
            });
    }
 
    userNameClicked($event) {
        console.log('nick name clicked')
    }

    navigationItemSelected($event) {
        this.selectedNavigationItem = $event;
    }

    searchTextchange($event) {
        this.filterText=$event;
    }
}
