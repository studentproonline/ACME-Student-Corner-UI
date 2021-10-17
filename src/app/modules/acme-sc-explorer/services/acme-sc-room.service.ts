import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { IRoomModel } from '../models/acme-sc-room.model';

@Injectable()
export class AcmeRoomService {

    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // create room
    createRoom(room: IRoomModel,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/rooms/', headers, room).pipe(catchError(this.handleErrorObservable));
    }

    // get rooms
    getRooms(token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/', headers).pipe(catchError(this.handleErrorObservable));
    }

    //update rooms
    updateRoom(room: IRoomModel,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.put('/rooms/'+ room._id, headers, room).pipe(catchError(this.handleErrorObservable));
    }

    
    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }

}