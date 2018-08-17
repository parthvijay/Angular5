import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { ApiDispacherService } from '../../shared/services/apiDispacher.service';

@Injectable()
export class CreatePipelineStepTwoService {

  constructor(private http: Http, private apiDispatcherServ: ApiDispacherService) {
  }

  getTechIbData(payload) {
    return this.apiDispatcherServ.doAPICall('technology-Ib', 'POST', payload);
  }

  getTechServices() {
    return this.apiDispatcherServ.doAPICall('product-services', 'GET', undefined);
  }

}
