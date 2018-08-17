import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';

@Injectable()
export class IntermediateSummaryService {
  qualData: any;

  constructor(
    private http: Http,
    private utilitiesService: UtilitiesService,
    private apiDispatcherServ: ApiDispacherService
  ) { }

  // get data
  getIntermediateSummaryData(customerId: string) {
    const globalView = this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N';
    const payload = {
      'customerName': customerId,
      'globalCustomerView': globalView
    };
    return this.apiDispatcherServ.doAPICall('qual-summary', 'POST', payload);
  }

  // list of AM
  listAM(payload) {
    return this.apiDispatcherServ.doAPICall('list-AM', 'POST', payload);
  }

  // notify AM
  notifyAM(payload) {
    return this.apiDispatcherServ.doAPICall('notify-AM', 'POST', payload);
  }

  setQualification(qual) {
    this.qualData = qual;
  }

  getQualification() {
    return this.qualData;
  }

  getAppliedFilters() {
    return this.http.get('assets/data/intermediate-summary/applied-filters.json')
      .map(res => res.json());
  }
}
