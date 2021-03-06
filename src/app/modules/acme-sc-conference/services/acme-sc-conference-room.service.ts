import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCConferenceRoomLibraryService {

    constructor( private httpService: AcmeSCHttpService ) {

    }

    // get room details
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/'+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get token for video conferencing
    getVideoConferenceAccessToken(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/agora/token?roomId='+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // start video conference session
    startVideoConference(roomId: string, minutes: string, mode: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/agora/start?roomId='+ roomId + '&minutes=' + minutes + '&mode='+ mode, headers).pipe(catchError(this.handleErrorObservable));
    }

    // delete video conference session
    stopVideoConference(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/agora/stop?roomId='+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}