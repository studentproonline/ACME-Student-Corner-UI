import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AcmeSCAuthorizationService } from '../services/acme-sc-authorization.service';

@Injectable({
  providedIn: 'root'
})
export class AcmeSCAuthguradServiceService {
  constructor(private router: Router, private acmeSCAuthorizationService: AcmeSCAuthorizationService) {
  }
  gettoken() {
    const isSessionActive = this.acmeSCAuthorizationService.isSessionActive;
    if (isSessionActive === false) {
      this.router.navigateByUrl("/login");
    }
    return true;
  }
}
