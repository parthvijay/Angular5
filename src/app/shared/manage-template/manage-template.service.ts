import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../services/utilities.service';
import { ApiDispacherService } from '../services/apiDispacher.service';

@Injectable()
export class ManageTemplateService {
  templateChanged = false;

  constructor(private http: Http,
    private utilitiesService: UtilitiesService,
    public apiDispatcherServ: ApiDispacherService
  ) { }

  getTemplates() {
    return this.apiDispatcherServ.doAPICall('get-template', 'GET', '');
  }

  deleteTemplate(vn) {
    const payload = {
      'viewName': vn.viewName,
      'viewId': vn.viewId,
      'order': null,
      'headers': null,
      'action': 'DELETE',
      'isDefault': 'N'
    };
    return this.apiDispatcherServ.doAPICall('save-template', 'POST', payload);
  }

}
