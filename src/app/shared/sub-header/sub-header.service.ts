import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { httpFactory } from '@angular/http/src/http_module';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../services/utilities.service';
import { FiltersService } from './../../filters/filters.service';
import { ApiDispacherService } from '../services/apiDispacher.service';
import { LookupService } from '../../modal/lookup/lookup.service';

@Injectable()
export class SubHeaderService {
  constructor(private http: Http,
    public apiDispatcherServ: ApiDispacherService,
    private utilitiesService: UtilitiesService,
    private filtersService: FiltersService,
    private lookupService: LookupService
  ) {
  }

  // get Intermediate sub header data
  getQualHeader(custId) {
    const globalView = this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N';
    const payload = {
      'customerName': custId,
      'globalCustomerView': globalView
    };
    return this.apiDispatcherServ.doAPICall('qual-header', 'POST', payload);
  }

  // get Line Level sub header data
  getLineLevelSubHeader(customerName, apiSign, name) {
    const globalView = this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N';
    let payload = {};
    if (apiSign === 'line-level-header') {
      payload = {
        'customerName': customerName,
        'globalCustomerView': globalView,
        'filters': this.filtersService.getQualFilterstoRest(),
        'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
        'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
        'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
        'hasInstanceId': this.lookupService.hasColumn('instanceId'),
        'hasProduct': this.lookupService.hasColumn('productID'),
        'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
        'hasContractNo': this.lookupService.hasColumn('contractNumber')
      };
    } else {
      payload = {
        'customerName': name,
        'qualHashId': customerName,
        'globalCustomerView': globalView,
        'filters': this.filtersService.getQualFilterstoRest(),
        'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
        'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
        'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
        'hasInstanceId': this.lookupService.hasColumn('instanceId'),
        'hasProduct': this.lookupService.hasColumn('productID'),
        'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
        'hasContractNo': this.lookupService.hasColumn('contractNumber')
      };
    }
    return this.apiDispatcherServ.doAPICall(apiSign, 'POST', payload);
  }

  getCustomerGUID(customerName) {
    const payload = {
      'customerName': customerName
    };
    return this.apiDispatcherServ.doAPICall('customer-guid', 'POST', payload);
  }

  sendCRApprovalEmail(payload) {
    return this.apiDispatcherServ.doAPICall('cr-justification', 'POST', payload);
  }

  checkManageAccess(payload) {
    return this.apiDispatcherServ.goToRegistry('https://hmt.cisco.com/croneview/services/checkUserAccess', 'POST', payload);
  }

  punchOutToCR(payload) {
    return this.apiDispatcherServ.goToRegistry('https://hmt.cisco.com/croneview/services/getCustomerDetails', 'POST', payload);
  }
}
