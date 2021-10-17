import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ILoginModel } from '../Models/acme-sc-login.model';

@Injectable()
export class AcmeSCLoginService {

    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // login
    login(loginDetails: ILoginModel) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpService.post('/login/', headers, loginDetails).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) { return throwError(error); }
}