import { Component, Output, EventEmitter } from '@angular/core';
import { AcmeSCAuthorizationService } from '../../../../core/services/acme-sc-authorization.service';
import { ILoginEntity } from '../../../../core/entities/acme-sc-login.entity';

@Component({
    selector: 'acme-sc-user-popup',
    templateUrl: './acme-sc-user-popup.component.html',
    styleUrls: ['./acme-sc-user-popup.component.scss']
})
export class AcmeSCUserPopupComponent {
    loginEntity: ILoginEntity;

    @Output() closed = new EventEmitter();
    @Output() logOut = new EventEmitter();
    
    constructor(private acmeSCAuthorizationService: AcmeSCAuthorizationService) {
        this.loginEntity = this.acmeSCAuthorizationService.getSession();
    }

    close() {
        this.closed.emit();
    }

    userLogOut() {
        this.logOut.emit();
    }
}