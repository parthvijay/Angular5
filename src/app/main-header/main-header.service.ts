import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { expand } from 'rxjs/operator/expand';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';
import { LoaderService } from '../shared/loader/loader.service';

@Injectable()

export class MainHeaderService {
    options: any;
    constructor(
        private http: Http,
        public utilitiesService: UtilitiesService,
        public apiDispatcherServ: ApiDispacherService,
        public loaderService: LoaderService
    ) {
        this.options = this.utilitiesService.getOptions();
    }

    getUserDetails() {
        return this.apiDispatcherServ.doAPICall('user', 'GET', '');
    }

    getFavoriteBookamrks() {
        return this.apiDispatcherServ.doAPICall('bookmark', 'GET', '');
    }

    getAppDetails() {
        return this.http.get('assets/data/main-header/appList.json')
            .map(res => res.json());
    }

}
