import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { ILoginEntity } from '../entities/acme-sc-login.entity'

@Injectable()
export class AcmeScCookiesService {
    constructor(private cookieService: CookieService ) {
        
    }
    setCookies(user: ILoginEntity) {
        this.cookieService.set( 'ACME_SC_User_Token', user.token ,null,null,null,true,'None');
        this.cookieService.set( 'ACME_SC_User_FirstName', user.firstName,null,null,null,true,'None' );
        this.cookieService.set( 'ACME_SC_User_LastName', user.lastName,null,null,null,true,'None' );
        this.cookieService.set( 'ACME_SC_User_Email', user.email ,null,null,null,true,'None');
    }

    getCookiesObject() {
        const cookie: any = {};
        cookie.token = this.cookieService.get('ACME_SC_User_Token');
        cookie.firstName = this.cookieService.get('ACME_SC_User_FirstName');
        cookie.lastName = this.cookieService.get('ACME_SC_User_LastName');
        cookie.email = this.cookieService.get('ACME_SC_User_Email');
        return cookie;
    }

    deleteCookies() {
        this.cookieService.delete('ACME_SC_User_Token', '/');
        this.cookieService.delete('ACME_SC_User_FirstName', '/');
        this.cookieService.delete('ACME_SC_User_LastName', '/');
        this.cookieService.delete('ACME_SC_User_Email', '/');
        this.cookieService.deleteAll();
    }
}