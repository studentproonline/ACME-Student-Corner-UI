import { Injectable } from '@angular/core';

import { ILoginEntity } from '../entities/acme-sc-login.entity';

@Injectable()
export class AcmeSCAuthorizationService {
   
    isSessionActive = false;
    private activeSession: ILoginEntity;

    setSession(login: ILoginEntity) {
        this.activeSession = login;
        this.isSessionActive = true;
    }
    getSession() {
        return this.activeSession;
    }

    getAccessToken() {
        return this.activeSession ? this.activeSession.token : null;
    }

    deleteSession() {
        this.activeSession = undefined;
        this.isSessionActive = false;
    }
}