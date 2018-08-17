import { UtilitiesService } from './../../shared/services/utilities.service';
import { Injectable, OnInit } from '@angular/core';
import { ApiDispacherService } from '../../shared/services/apiDispacher.service';
import { Http, Response, Headers } from '@angular/http';
import { FiltersService } from '../../filters/filters.service';

@Injectable()
export class LookupService {
  excelData: any;
  tableData: any;
  fileName: string;
  lookupBy: string;
  unmatchedData = {
    serialNumber: [],
    instanceId: [],
    productID: [],
    installSiteId: [],
    contractNumber: []
  };
  matchedData = [];
  unidentifiedPercent = 0;
  colRadio: any;
  colCheckbox = [];
  lookupWith: string;
  qualId: string;

  constructor(
    private http: Http,
    private utilitiesService: UtilitiesService,
    private apiDispatcherServ: ApiDispacherService,
    private filtersService: FiltersService
  ) { }

  uploadFile() {
    let qId;
    if (this.colRadio === 'serialNumber') {
      this.lookupBy = 'Serial Number';
    } else {
      this.lookupBy = 'Instance Id';
    }
    if (this.utilitiesService.getQualification()) {
      qId = this.utilitiesService.getQualification().qualificationHashId;
    }
    const payload = {
      'file': this.excelData,
      'customerName': this.utilitiesService.custName,
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'lookupBy': this.lookupBy,
      'qualId': qId ? qId : null,
      'matchType': this.lookupWith ? this.lookupWith : '',
      'hasSerialNo': this.hasColumn('serialNumber'),
      'hasInstanceId': this.hasColumn('instanceId'),
      'hasProduct': this.hasColumn('productID'),
      'hasInstallSite': this.hasColumn('installSiteId'),
      'hasContractNo': this.hasColumn('contractNumber'),
      'filters': this.filtersService.getQualFilterstoRest()
    };
    return this.apiDispatcherServ.doAPICall('upload-file', 'POST', payload);
  }

  downloadList() {
    let qId;
    if (this.utilitiesService.getQualification()) {
      qId = this.utilitiesService.getQualification().qualificationHashId;
    }
    const payload = {
      'lookupBy': this.lookupBy,
      // 'headers': this.excelData[0],
      'customerName': this.utilitiesService.custName,
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'fileName': this.fileName,
      'qualId': qId ? qId : null
    };

    return this.apiDispatcherServ.doDownloadAPICall('download-list', 'POST', payload);
  }

  hasColumn (cName) {
    let isPresent = 'N';
    switch (this.colCheckbox.indexOf(cName)) {
      case 0:
        isPresent = 'Y';
        break;
      case 1:
        isPresent = 'Y';
        break;
      case 2:
        isPresent = 'Y';
        break;
      case 3:
        isPresent = 'Y';
        break;
      case 4:
        isPresent = 'Y';
        break;
    }
    return isPresent;
  }

  matchData() {
    this.unmatchedData = {
      serialNumber: [],
      instanceId: [],
      productID: [],
      installSiteId: [],
      contractNumber: []
    };
    this.matchedData = [];
    let unidentifiedRows = 0;
    const totalRows = this.excelData.length - 1;
    const thisInstance = this;
    this.excelData.forEach(function (element, index) {
      if (index === 0) {
        return true;
      }
      const serialNumber = element[0];
      const instanceId = element[1];
      const productID = element[2];
      const installSiteId = element[3];
      const contractNumber = element[4];
      const primaryKeyVal = thisInstance.colRadio === 'serialNumber' ? serialNumber : instanceId;

      const ifPrimaryKeyMatch = thisInstance.utilitiesService.findKeyValue(thisInstance.tableData, thisInstance.colRadio, primaryKeyVal);
      // console.log(ifPrimaryKeyMatch);
      if (ifPrimaryKeyMatch === -1) {
        unidentifiedRows++;
        return;
      }
      const row = thisInstance.tableData[ifPrimaryKeyMatch];
      // console.log(row);
      // console.log(row);

      thisInstance.matchedData.push(primaryKeyVal);

      if (thisInstance.colCheckbox.indexOf('serialNumber') > -1 && row.serialNumber !== serialNumber && thisInstance.colRadio !== 'serialNumber') {
        thisInstance.unmatchedData.serialNumber.push({
          'primaryKey': thisInstance.colRadio,
          'primaryVal': primaryKeyVal,
          'value': row.serialNumber
        });
      }
      if (thisInstance.colCheckbox.indexOf('instanceId') > -1 && row.instanceId !== instanceId && thisInstance.colRadio !== 'instanceId') {
        thisInstance.unmatchedData.instanceId.push({
          'primaryKey': thisInstance.colRadio,
          'primaryVal': primaryKeyVal,
          'value': row.instanceId
        });
      }
      if (thisInstance.colCheckbox.indexOf('productID') > -1 && row.productID !== productID) {
        thisInstance.unmatchedData.productID.push({
          'primaryKey': thisInstance.colRadio,
          'primaryVal': primaryKeyVal,
          'value': row.productID
        });
      }
      if (thisInstance.colCheckbox.indexOf('installSiteId') > -1 && row.installSiteId !== installSiteId) {
        thisInstance.unmatchedData.installSiteId.push({
          'primaryKey': thisInstance.colRadio,
          'primaryVal': primaryKeyVal,
          'value': row.installSiteId
        });
      }
      if (thisInstance.colCheckbox.indexOf('contractNumber') > -1 && row.contractNumber !== contractNumber) {
        thisInstance.unmatchedData.contractNumber.push({
          'primaryKey': thisInstance.colRadio,
          'primaryVal': primaryKeyVal,
          'value': row.contractNumber
        });
      }
    });
    // this.unidentifiedPercent = unidentifiedRows / totalRows * 100;
    // console.log(thisInstance.unmatchedData);
  }

  clearLookup() {
    let qualId;
    if (this.utilitiesService.getQualification()) {
      qualId = this.utilitiesService.getQualification().qualificationHashId;
    }
    const payload = {
      'globalView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'qualificationId': qualId  ? qualId : null,
      'customerName': this.utilitiesService.custName
    };
    return this.apiDispatcherServ.doAPICall('clear-lookup', 'POST', payload);
  }

}
