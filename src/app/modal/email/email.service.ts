import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { ApiDispacherService } from '../../shared/services/apiDispacher.service';

@Injectable()
export class EmailService {
    constructor(private http: Http,
        public apiDispatcherServ: ApiDispacherService,
        private utilitiesService: UtilitiesService) { }

    sendEmailFromSummary(payload) {
        return this.apiDispatcherServ.doAPICall('share-summary', 'POST', payload);
    }

    sendEmailFromQualification(payload) {
        return this.apiDispatcherServ.doAPICall('share-qualification', 'POST', payload);
    }
}
