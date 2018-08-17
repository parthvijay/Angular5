import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { ApiDispacherService } from '../../shared/services/apiDispacher.service';

@Injectable()
export class ApproveDisapproveService {
  constructor(private http: Http,
    public apiDispatcherServ: ApiDispacherService,
    private utilitiesService: UtilitiesService) { }

  // qualify reason codes
  getQualifyReasonCodes() {
    return this.http.get('assets/data/am-view/qualify-reason-code.json')
      .map(res => res.json());
  }

  // disqualify reason codes
  getDisapproveReasonCodes() {
    return this.http.get('assets/data/am-view/disapprove-reason-code.json')
      .map(res => res.json());
  }

  getAMSummary(payload) {
    return this.apiDispatcherServ.doAPICall('am-summary' + name, 'POST', payload);
  }

}
