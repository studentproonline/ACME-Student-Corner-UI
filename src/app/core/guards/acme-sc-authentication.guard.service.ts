import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../services/acme-sc-authorization.service';
import { AcmeScCookiesService } from '../services/acme-sc-cookies.service';

import { ILoginEntity } from '../entities/acme-sc-login.entity';

@Injectable({
  providedIn: 'root'
})
export class AcmeSCAuthguradServiceService {
  constructor(private router: Router, private acmeSCAuthorizationService: AcmeSCAuthorizationService,
    private acmeScCookiesService: AcmeScCookiesService) {
  }
  gettoken() {
    const cookies = this.acmeScCookiesService.getCookiesObject();
    if (!cookies || cookies.email === 'undefined' || cookies.firstName === 'undefined'
      || cookies.lastName === 'undefined' || cookies.token === 'undefined' ||
      cookies.email.trim() === '' || cookies.firstName.trim() === ''
      || cookies.lastName.trim() === '' || cookies.token.trim() === '') {

      this.router.navigateByUrl("/login");
    }
    const loginEntity: ILoginEntity = {
      id: '',
      email: cookies.email,
      firstName: cookies.firstName,
      lastName: cookies.lastName,
      token: cookies.token
    }
    this.acmeSCAuthorizationService.setSession(loginEntity);
    return true;
  }
}
