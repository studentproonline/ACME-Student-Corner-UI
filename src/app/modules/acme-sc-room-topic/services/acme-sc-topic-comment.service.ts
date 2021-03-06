import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeTopicCommentService {
    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // create comment
    createTopicComment(comment: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/comments/', headers, comment).pipe(catchError(this.handleErrorObservable));
    }

    // get comments
    getTopicComments(pageNumber: Number, topicId: String, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/comments/?topicId=' + topicId+'&pageNumber='+pageNumber, headers).pipe(catchError(this.handleErrorObservable));
    }

    //get comments count
    getTopicCommentsCount(topicId: String, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/comments/count?topicId=' + topicId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // delete comment
    deleteTopicComment(commentId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.delete('/comments/' + commentId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // handle error
    private handleErrorObservable(error: Response | any) {
        return throwError(error);
    }
}
