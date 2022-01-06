import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../services/acme-sc-authorization.service';
import { AcmeScCookiesService } from '../services/acme-sc-cookies.service';

import { ILoginEntity } from '../entities/acme-sc-login.entity';

//translation
import { TranslateService } from '@ngx-translate/core';

// Theming service
import { AcmeSCThemingService } from '../../modules/shared/services/acme-sc-theming.service';

@Injectable({
  providedIn: 'root'
})
export class AcmeSCAuthguradServiceService {
  constructor(private router: Router, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
    private acmeScCookiesService: AcmeScCookiesService,
    private translateService: TranslateService,
    private acmeSCThemingService: AcmeSCThemingService) {
  }
  gettoken() {
    const cookies = this.acmeScCookiesService.getCookiesObject();
    if (!cookies || cookies.email === 'undefined' || cookies.firstName === 'undefined'
      || cookies.lastName === 'undefined' || cookies.token === 'undefined' ||
      cookies.email.trim() === '' || cookies.firstName.trim() === ''
      || cookies.lastName.trim() === '' || cookies.token.trim() === ''
      || cookies.id.trim() === '') {

      this.router.navigateByUrl("/login");
    }
    const loginEntity: ILoginEntity = {
      id: cookies.id,
      email: cookies.email,
      firstName: cookies.firstName,
      lastName: cookies.lastName,
      token: cookies.token
    }
    this.acmeSCAuthorizationService.setSession(loginEntity);
    return true;
  }

  getRoomDetailsAndUserRole() {
    if(this.router.routerState.snapshot.url === '/login' || 
       this.router.routerState.snapshot.url.indexOf('/home')>=0) {
      return true;
    }
    let roomDetails = JSON.parse(sessionStorage.getItem('RoomDetails'));
    let roomUserRole = JSON.parse(sessionStorage.getItem('UserRoomRole'));
    let language = sessionStorage.getItem('language');
    if(!roomDetails || !roomUserRole) {
      this.router.navigateByUrl("/login");
    }
    this.acmeSCAuthorizationService.setRoomDetails(roomDetails);
    this.acmeSCAuthorizationService.setUserRoomRole(roomUserRole);

    const theme = localStorage.getItem('Theme');
    if(!theme) {
        this.acmeSCThemingService.setTheme('dark-theme');
        localStorage.setItem('Theme', 'dark-theme');
    } else {
        this.acmeSCThemingService.setTheme(theme);
    }

    if(language) {
      this.translateService.setDefaultLang(language);
    } 
    return true;
  }
}
