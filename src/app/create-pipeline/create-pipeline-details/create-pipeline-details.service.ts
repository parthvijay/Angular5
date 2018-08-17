import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiDispacherService } from '../../shared/services/apiDispacher.service';

@Injectable()
export class CreatePipelineDetailsService {
  constructor(
    private http: Http,
    private apiDispatcherServ: ApiDispacherService
  ) {}

  getCreatePipelineDetails(payload) {
    return this.apiDispatcherServ.doAPICall('pipeline-details', 'POST', payload);
  }

  getContracts(payload) {
    return this.apiDispatcherServ.doAPICall('contract-list', 'POST', payload);
  }

  getSavIds(payload) {
    return this.apiDispatcherServ.doAPICall('get-savId', 'POST', payload);
  }

  generateRefId(payload) {
    return this.apiDispatcherServ.doAPICall('generate-refId', 'POST', payload);
  }

  getPipelineAccounts(payload) {
    return this.apiDispatcherServ.doAPICall('pipeline-accounts', 'POST', payload);
  }
}
