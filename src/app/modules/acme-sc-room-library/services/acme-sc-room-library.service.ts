import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCRoomLibraryService {

    constructor( private httpService: AcmeSCHttpService ) {

    }

    // upload document
    uploadtDocument(token: any, fileData: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'multipart/form-data', Authorization: token });
        return this.httpService.post('/achievements/', headers, fileData).pipe(catchError(this.handleErrorObservable));
    }

    // get room details
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/'+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}