import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCRoomAssesmentService {
    constructor(private httpService: AcmeSCHttpService) {

    }

    // upload assesment
    uploadAssesment(token: any, assesmentData: any) {
        const headers = new HttpHeaders({ Authorization: token });
        return this.httpService.post('/assesments/', headers, assesmentData).pipe(catchError(this.handleErrorObservable));
    }

     // get assesments
    getAssesments(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesments/?roomId=' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get assesment
    getAssesment(assesmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesments/' + assesmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    //update assignment
    updateAssesment(assesmentId: string, body: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.put('/assesments/' + assesmentId, headers, body).pipe(catchError(this.handleErrorObservable));
    }

    //update assignment
    deleteAssesment(assesmentId: string,token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/assesments/' + assesmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get user assesment evaluation
    getUserAssesment(userId: string, assesmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesmentEvaluations/?userId=' + userId + '&assesmentId=' + assesmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get room Role
    getUserRoomRole(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/role/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get room details
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    //update assignment
    getAssesmentFile(assesmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesments/file/' + assesmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // create user assesment evaluation
    createUserAssignment(body: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/assesmentEvaluations/', headers, body).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) {
        return throwError(error);
    }
}