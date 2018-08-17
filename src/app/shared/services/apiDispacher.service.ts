import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { RestApiService } from './restAPI.service';
import { concat } from 'rxjs/operator/concat';
import 'rxjs/add/operator/map';
import { UtilitiesService } from './utilities.service';
import { LoaderService } from './../loader/loader.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class ApiDispacherService {
    options: any;
    optionsDown: any;
    sfdcOptions: any;
    proxyUser: any;
    constructor(
        private http: Http,
        private restApi: RestApiService,
        private utilitiesService: UtilitiesService,
        public loaderService: LoaderService,
        private cookieService: CookieService
    ) {
        const myHeaders = new Headers();
        this.proxyUser = window.localStorage.getItem('proxy');
        if (this.proxyUser !== null) {
            myHeaders.append('fromPartyID', this.proxyUser);
            this.options = new RequestOptions({ headers: myHeaders, withCredentials: true });
        } else {
            this.options = new RequestOptions({ withCredentials: true });
        }
     }

    // all api call got through this function
    doAPICall(apiPath, type, payload) {
        if (type === 'GET') {
            this.loaderService.show();
            return this.http.get(this.restApi.getApiPath(apiPath), this.options)
              .map(res => res.json(),
              this.loaderService.hide()
            );
        }
        if (type === 'POST') {
            this.loaderService.show();
            return this.http.post(this.restApi.getApiPath(apiPath), payload, this.options)
            .map(res => res.json());
        }
    }

    // for downloading excel file for lookup feature
    doDownloadAPICall(apiPath, type, payload) {
        if (type === 'POST') {
            this.optionsDown = new RequestOptions({responseType: ResponseContentType.Blob, withCredentials: true });
            return this.http.post(this.restApi.getApiPath(apiPath), payload, this.optionsDown)
            .map(res => res.json());
        }
    }

    // for manage locations
    goToRegistry(apiPath, type, payload) {
        return this.http.post(apiPath, payload, this.options)
            .map(res => res.json());
    }

    // filter calls in line level view
    doFilterApiCall (apiPath, type, payload) {
        if (type === 'GET') {
            this.loaderService.show();
            return this.http.get(apiPath, this.options)
                .map(res => res.json());
        }
        if (type === 'POST') {
            this.loaderService.show();
            return this.http.post(apiPath, payload, this.options)
                .map(res => res.json());
        }
    }

    // all api call got through this function
    summaryViewCalls(apiPath, type, payload) {
        this.loaderService.show();
        return this.http.post(this.restApi.getApiPath(apiPath) + type, payload, this.options)
        .map(res => res.json());
    }
}
