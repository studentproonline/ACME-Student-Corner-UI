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
    uploadDocument(token: any, fileData: any) {
        const headers = new HttpHeaders({ Authorization: token });
        return this.httpService.post('/libraryfiles/', headers, fileData).pipe(catchError(this.handleErrorObservable));
    }

    // get library contents
    getLibrarycontents(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/libraryfiles/?roomId='+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get library content
    getLibrarycontent(contentId: string, roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/libraryfiles/'+contentId +'?roomId='+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get library content
    deleteLibrarycontent(contentId: string, roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/libraryfiles/'+contentId +'?roomId='+ roomId, headers).pipe(catchError(this.handleErrorObservable));
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