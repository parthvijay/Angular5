import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../services/utilities.service';
import { ApiDispacherService } from '../services/apiDispacher.service';
import { RestApiService } from '../services/restAPI.service';

@Injectable()
export class MultipleSelectService {
    constructor(private http: Http,
        public apiDispatcherServ: ApiDispacherService,
        private utilitiesService: UtilitiesService,
        private restApi: RestApiService
    ) { }

    searchUserEmail(name) {
        return this.apiDispatcherServ.doFilterApiCall(this.restApi.getApiPath('search-user') + name, 'GET', '');
    }
}
