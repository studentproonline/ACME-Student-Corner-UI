import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { ISharedRoomModel } from '../models/acme-sc-shared-room.model';
import { IRoomUserEntity } from '../entities/acme-sc-room-user.entity';

@Injectable()
export class AcmesharedRoomService {
    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // share room
    sharedRoom(sharedRoom: ISharedRoomModel,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/sharedrooms/', headers, sharedRoom).pipe(catchError(this.handleErrorObservable));
    }

    // get shared rooms
    getSharedRoom(token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/sharedrooms/', headers).pipe(catchError(this.handleErrorObservable));
    }

    //activate shared room
    activateSharedRoom(sharedLink: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpService.post('/sharedrooms/activate/', headers, sharedLink).pipe(catchError(this.handleErrorObservable));
    }

    // get room public details
    getRoomPublicDetails(roomId: string) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        let body: any ={};
        body.roomId=roomId;
        return this.httpService.post('/sharedrooms/public', headers,body).pipe(catchError(this.handleErrorObservable));
    }

    // send request to join room
    sendRequestToJoinRoom(body: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
        return this.httpService.post('/sharedrooms/request', headers,body).pipe(catchError(this.handleErrorObservable));
    }

    // approve reject request
    approveRejectRequest(body: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/sharedrooms/requestaction', headers,body).pipe(catchError(this.handleErrorObservable));
    }

    //delete shared room
    deleteSharedRoom(sharedRoom: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/sharedrooms/'+sharedRoom.roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    
    getSharedRoomUsers(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/sharedrooms/'+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    removeSharedRoomUser( roomUser: IRoomUserEntity, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/sharedrooms/removeuser/', headers, roomUser).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}
