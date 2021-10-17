import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { IUser } from '../Models/acme-sc-user.model';

@Injectable()
export class AcmeSCAccountService {
    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // create Account
    createAccount(user: IUser) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpService.post('/users/', headers, user).pipe(catchError(this.handleErrorObservable));
    }

    // Activate account
    activateUserAccount(userId) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpService.get('/accounts/' + userId, headers)
            .pipe(catchError(this.handleErrorObservable));
    }

    // re- generate activation link
    regenarateActivationLink(emailId: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        const email = { email: emailId };
        return this.httpService.post('/accounts', headers, email).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) { return throwError(error); }
}