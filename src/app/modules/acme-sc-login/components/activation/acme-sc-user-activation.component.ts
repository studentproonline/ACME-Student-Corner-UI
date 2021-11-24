import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AcmeSCAccountService } from '../../services/acme-sc-user-account.service';

@Component({
    selector: 'acme-sc-user-activation',
    templateUrl: './acme-sc-user-activation.component.html',
    styleUrls: ['./acme-sc-user-activation.component.scss']
})
export class AcmeSCUserActivationComponent implements OnInit {
    isProgress = false;
    isSuccessFull = false;
    notApproved = false;
    activationResponseMessage = '';
    userId: string;
    contactInformation: any={}

    constructor(private route: ActivatedRoute, private router: Router, private acmeSCAccountService: AcmeSCAccountService) {

    }

    ngOnInit() {
        this.route.queryParams
            .subscribe(params => {
                this.userId = params.UserId;
                this.activateUser();
            });
    }

    gotoLoginScreen() {
        this.router.navigateByUrl ( '/login' );
    }

    activateUser() {
        this.isProgress = true;
        this.isSuccessFull = false;
        this.acmeSCAccountService.activateUserAccount(this.userId).subscribe(
            value => {
                const response: any = value;
                this.isProgress = false;
                switch (response.code) {
                    case 'NOT_FOUND':{
                        this.isSuccessFull = false;
                        this.activationResponseMessage = 'Activation link is expired';
                        return;
                    }
                    case 'INVALID_STATUS': {
                        this.isSuccessFull = false;
                        this.activationResponseMessage = 'Invalid user status';
                        return;
                    }
                    case'LINK_ACTIVATED':{
                        this.isSuccessFull = true;
                        this.activationResponseMessage = 'Already an activated account';
                        return;
                    }
                    case 'ACCOUNT_ACTIVATED':{
                        this.isSuccessFull = true;
                        this.activationResponseMessage = 'Congragulations, your account is now active.';
                        return;
                    }
                    default: {
                        this.isSuccessFull = false;
                        this.activationResponseMessage = 'unknown response code';
                        return;
                    }
                }
            },
            err => {
                this.isProgress = false;
                this.isSuccessFull = false;
                if (err.error && err.error.description) {
                    this.activationResponseMessage = err.error.description.message;
                } else {
                    this.activationResponseMessage = 'Server Error';
                }
                if(err.error.code === 'NOT_APPROVED') {
                    this.notApproved = true;
                    this.contactInformation = err.error.description;
                    this.activationResponseMessage = this.contactInformation.message;
                }
            }
        );
    }
}
