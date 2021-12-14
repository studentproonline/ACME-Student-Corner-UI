import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCRoomReportCardService {

    constructor(private httpService: AcmeSCHttpService) {

    }

    // get room details
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get assesments
    getAssesments(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesments/?roomId=' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get user assesment evaluation
    getUserAssesmentReport(userId: string, roomId: string, group: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assesmentEvaluations/report?userId=' + userId + '&roomId=' + roomId + '&group=' + group, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get room Role
    getUserRoomRole(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/role/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // create report card
    createReportCard(token: any, reportCardData: any) {
        const headers = new HttpHeaders({ Authorization: token });
        return this.httpService.post('/reportCards/', headers, reportCardData).pipe(catchError(this.handleErrorObservable));
    }

    // get report card
    getReportCard(roomId: string, userEmail: string, assesmentGroup: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/reportCards/?roomId=' + roomId + '&userEmail=' + userEmail + '&assesmentGroup=' + assesmentGroup, headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) {
        return throwError(error);
    }
}