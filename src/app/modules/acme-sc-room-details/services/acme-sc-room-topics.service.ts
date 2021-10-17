import { Injectable } from '@angular/core';
import { AcmeSCHttpService } from '../../../core/services/acme-sc-http.service';
import { HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeRoomTopicsService {
    // constructor
    constructor(private httpService: AcmeSCHttpService) {
    }

    // get topics
    getRoomTopics(roomId: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/topics/'+ roomId, headers).pipe(catchError(this.handleErrorObservable));
    }

    // create Topic
    createRoomTopic(topic: any, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.post('/topics/', headers, topic).pipe(catchError(this.handleErrorObservable));
    }

    //update Topic
    updateRoomTopic(topicId: string, topicStatus: string, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        const status ={'status': topicStatus}
        return this.httpService.put('/topics/'+topicId, headers,status ).pipe(catchError(this.handleErrorObservable));
    }

    //get comments count
    getTopicCommentsCount(topicId: String, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/comments/count?topicId=' + topicId, headers).pipe(catchError(this.handleErrorObservable));
    }

    //get votes count
    getTopicVotesCount(topicId: String, token: any) {
        const headers = new HttpHeaders({ 'Content-Type': 'application/json', Authorization: token });
        return this.httpService.get('/votes/count?topicId=' + topicId, headers).pipe(catchError(this.handleErrorObservable));
    }
    
    // handle error
    private handleErrorObservable(error: Response | any){ 
        return throwError(error);
    }
}