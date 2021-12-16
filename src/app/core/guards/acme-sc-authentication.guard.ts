import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import {  AcmeSCAuthguradServiceService } from './acme-sc-authentication.guard.service';

@Injectable({
    providedIn: 'root'
})
export class AcmeSCAuthenticationGuard implements CanActivate {
    constructor(private acmeSCAuthguradServiceService: AcmeSCAuthguradServiceService, private router: Router) {

    }
    canActivate(): boolean {
        if (!this.acmeSCAuthguradServiceService.gettoken() || !this.acmeSCAuthguradServiceService.getRoomDetailsAndUserRole()) {  

            this.router.navigateByUrl("/login");  
        }  
        return this.acmeSCAuthguradServiceService.gettoken();  
    }
}