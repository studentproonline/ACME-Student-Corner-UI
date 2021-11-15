import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCAchievementsService {

    constructor( private httpService: AcmeSCHttpService ) {

    }

    // get achievements
    getAchievements(token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/achievements/', headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}