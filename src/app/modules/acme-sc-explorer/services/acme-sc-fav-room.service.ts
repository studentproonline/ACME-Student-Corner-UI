import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { IFavRoomModel } from '../models/acme-sc-fav-room.model';

@Injectable()
export class AcmeFavRoomService {
    
    constructor(private httpService: AcmeSCHttpService) {

    }
    // create Fav room
    createFavRoom(favRoom: IFavRoomModel,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/favrooms/', headers, favRoom).pipe(catchError(this.handleErrorObservable));
    }

    // get rooms
    getFavRooms(token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/favrooms/', headers).pipe(catchError(this.handleErrorObservable));
    }

    deleteRoom(favRoom: IFavRoomModel,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/favrooms/'+ favRoom.roomId, headers).pipe(catchError(this.handleErrorObservable));
    }
    
    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}