import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { IRoomUserEntity } from '../../shared/entities/acme-sc-room-user.entity';

@Injectable()
export class AcmeRoomDetailsService {
    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }
    
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/'+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }


    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}