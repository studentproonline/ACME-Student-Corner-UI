import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCRoomAssignmentService {
    constructor(private httpService: AcmeSCHttpService) {

    }

    // get assignments
    getAssignments(pageNumber: Number, roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assignments/?roomId=' + roomId + '&pageNumber=' + pageNumber, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get assignment
    getAssignment(assignmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assignments/' + assignmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    //create assignment
    createAssignment(body: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/assignments/', headers, body).pipe(catchError(this.handleErrorObservable));
    }

    //update assignment
    updateAssignment(assignmentId: string, body: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.put('/assignments/' + assignmentId, headers, body).pipe(catchError(this.handleErrorObservable));
    }

    //delete assignment
    deleteAssignment(assignmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/assignments/' + assignmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get room Role
    getUserRoomRole(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/role/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // get user assignment evaluation
    getUserAssignment(userId: string, assignmentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/assignmentEvaluations/?userId=' + userId + '&assignmentId=' + assignmentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // create user assignment evaluation
    createUserAssignment(body: any, token: any) {
        const headers = new HttpHeaders({ Authorization: token });
        return this.httpService.post('/assignmentEvaluations/', headers, body).pipe(catchError(this.handleErrorObservable));
    }

    // update user assignment
    updateUserAssignment(assignmentEvaluationId: string, body: any, token: any) {
        const headers = new HttpHeaders({Authorization: token });
        return this.httpService.put('/assignmentEvaluations/'+assignmentEvaluationId, headers, body).pipe(catchError(this.handleErrorObservable));
    }

    // update user evaluation assignment
    updateUserEvaluationAssignment(assignmentEvaluationId: string, body: any, token: any) {
        const headers = new HttpHeaders({ Authorization: token });
        return this.httpService.put('/assignmentEvaluations/evaluate/'+assignmentEvaluationId, headers, body).pipe(catchError(this.handleErrorObservable));
    }

    // get room details
    getRoomById(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/rooms/' + roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) {
        return throwError(error);
    }
}