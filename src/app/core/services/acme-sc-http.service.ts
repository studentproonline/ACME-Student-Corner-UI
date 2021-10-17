import { apiConfig } from '../../config/config';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';

@Injectable()
export class AcmeSCHttpService {
    private apiUrl: string;

    constructor(private httpClient: HttpClient) {
        this.apiUrl = apiConfig.url;
    }
    // post method
    post(relativeUrl: string, headers: HttpHeaders, body: any): Observable<Response> {
        const options = {
            headers
        };
        return this.httpClient.post(this.apiUrl + relativeUrl, body, options).
            pipe(map(this.extractData),
                catchError(this.handleErrorObservable)
            );
    }
    // put method
    put(relativeUrl: string, headers: HttpHeaders, body: any): Observable<Response> {
        const options = {
            headers
        };
        return this.httpClient.put(this.apiUrl + relativeUrl, body, options).
            pipe(map(this.extractData),
                catchError(this.handleErrorObservable)
            );
    }

    // Delete method
    delete(relativeUrl: string, headers: HttpHeaders): Observable<Response> {
        const options = {
            headers
        };
        return this.httpClient.delete(this.apiUrl + relativeUrl, options).
            pipe(map(this.extractData),
                catchError(this.handleErrorObservable)
            );
    }

    // get method
    get(relativeUrl: string, headers: HttpHeaders): Observable<Response> {
        const options = {
            headers
        };
        return this.httpClient.get(this.apiUrl + relativeUrl, options).
            pipe(map(this.extractData),
                catchError(this.handleErrorObservable)
            );
    }

    private extractData(res: Response) {
        // let body = res.json();
        // return body || {};
        return res;
    }
    private handleErrorObservable(error: Response | any) { return throwError(error); }
}