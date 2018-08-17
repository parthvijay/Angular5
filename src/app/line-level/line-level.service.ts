import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../shared/services/utilities.service';
import { FiltersService } from '../filters/filters.service';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';
import { LookupService } from '../modal/lookup/lookup.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

// Operators
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LineLevelService {
  isAMView = false;
  selectedAssetViewOptions: IMultiSelectOption[];
  assetsList: any[];
  selectedAssetView = ['All'];
  assetViewList: any;
  activeAsset = 'All';
  columnDefs: any;

  constructor(
    private http: Http,
    private filtersService: FiltersService,
    private apiDispatcherServ: ApiDispacherService,
    private utilitiesService: UtilitiesService,
    private lookupService: LookupService
  ) {
    this.getAssetsListDetails();
  }

  // get linecount
  getlineCount(custName) {
    const payload = {
      'globalCustomerView' : this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'customerName': custName,
      'filters': this.filtersService.getQualFilterstoRest(),
      'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
      'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
      'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
      'hasInstanceId': this.lookupService.hasColumn('instanceId'),
      'hasProduct': this.lookupService.hasColumn('productID'),
      'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
      'hasContractNo': this.lookupService.hasColumn('contractNumber')
    };
    return this.apiDispatcherServ.doAPICall('line-count', 'POST', payload);
  }

  // get table data
  getLineLevelData(custName, apiSign, offset, name) {
    const globalView = this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N';
    let payload = {};
    if (apiSign === 'line-detail') {
      payload = {
        'customerName': custName,
        'globalCustomerView': globalView,
        'offset': offset,
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
        'qualHashId': custName,
        'offset': offset,
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

  // get qualification tabs data
  getLineLevelTabs(custName) {
    const payload = {
      'customerName': custName,
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N'
    };
    return this.apiDispatcherServ.doAPICall('line-level-tab', 'POST', payload);
  }

  // Config column APIs...
  saveTemplate(viewName, columnArray, columnHeaderList, action) {
    const payload = {
      'viewId': viewName.id,
      'order': JSON.stringify(columnArray),
      'headers': JSON.stringify(columnHeaderList),
      'action': action,
      'isDefault': 'N',
      'viewName': viewName.name
    };
    return this.apiDispatcherServ.doAPICall('save-template', 'POST', payload);
  }

  getTemplateHeaders(viewName) {
    const payload = {
      'viewId': viewName
    };
    return this.apiDispatcherServ.doAPICall('template-headers', 'POST', payload);
  }

  getColumnDefinition() {
    return this.http.get('assets/data/configure-columns.json')
      .map(res => res.json());
  }

  // Saving Qualification APIs...
  saveQualification(payload, apiType) {
    return this.apiDispatcherServ.doAPICall(apiType, 'POST', payload);
  }

  // Delete Qualification
  deleteQualification(payload) {
    return this.apiDispatcherServ.doAPICall('delete-qualification', 'POST', payload);
  }

  // Rename Qualification
  renameQualification(payload) {
    return this.apiDispatcherServ.doAPICall('rename-qualification', 'POST', payload);
  }

  // Qualify and Disqualify lines in bulk or individual
  qualifyOrDisQualify(payload, apiType) {
    return this.apiDispatcherServ.doAPICall(apiType, 'POST', payload);
  }

  // checking if qualification is ready for approval or not
  getQualificationApproval(qualId) {
    const payload = {
      'qualId': qualId
    };
    return this.apiDispatcherServ.doAPICall('approve-qualification', 'POST', payload);
  }

  // Approve disapprove Qualification APIs...
  approveDisapproveQual(payload, apiType) {
    return this.apiDispatcherServ.doAPICall(apiType, 'POST', payload);
  }

  // UnDo lines in bulk or individual
  unDo(payload, apiType) {
    return this.apiDispatcherServ.doAPICall(apiType, 'POST', payload);
  }

  requestReport (q, lineCount, cN) {
    const payload = {
      'globalView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'qualificationId': q !== undefined ? q : null,
      'lineCount': lineCount,
      'customerName': cN,
      'filters': this.filtersService.getQualFilterstoRest()
    };
    return this.apiDispatcherServ.doAPICall('request-lineLevel-report', 'POST', payload);
  }

  // check for AM View
  getView() {
    this.isAMView = !this.isAMView;
    this.utilitiesService.setTableHeight();
  }

  createDummyError() {
    return this.http.get('assets/data/dummy.json')
      .map(res => res.json());
  }

  // US181404
  getAssetsList() {
    return this.http.get('assets/data/line-level/assets-categories.json')
      .map(res => res.json());
  }

  // US181404
  getAssetsListDetails() {
    this.getAssetsList()
      .subscribe((data: any) => {
        this.assetsList = data;
        this.selectedAssetViewOptions = data;
      });
  }

  // get asset view line count
  getAssetLineCount(cName: string, assetType: string) {
    const payload = {
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'customerName': cName,
      'type': assetType,
      'filters': this.filtersService.getQualFilterstoRest()
    };
    return this.apiDispatcherServ.doAPICall('asset-lineCount', 'POST', payload);
  }

  // get asset view table data
  getAssetsViewData(payload) {
    let assetName = this.utilitiesService.lowerCaseText(this.selectedAssetView[0]).replace(' ', '-');
    if (assetName === 'product-so') {
      assetName = 'productSO';
    }
    if (assetName === 'service-so') {
      assetName = 'serviceSO';
    }
    return this.apiDispatcherServ.summaryViewCalls('asset-summary-view', assetName, payload);
  }

  // to populate headers of different asset view
  getAssetsColumnDefinition() {
    const assetName = this.utilitiesService.lowerCaseText(this.selectedAssetView[0]).replace(' ', '-');
    this.activeAsset = this.selectedAssetView[0];
    const fileName = assetName;
    return this.http.get('assets/data/configure-' + fileName + '-columns.json')
      .map(res => res.json());
  }

  searchArrayObject(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  getAssetSearchItems() {
    return this.http.get('assets/data/line-level/assets.json')
      .map(res => res.json());
  }

  // for getting list of Contract, Product SO, Service SO numbers
  getCPSList(api, assetName, payload) {
    return this.apiDispatcherServ.summaryViewCalls(api, assetName, payload);
  }

  // Retaining template configured columns while moving to Asset type.
  setColumnDefs(data) {
    this.columnDefs = data;
  }
  getColumnDefs() {
    return this.columnDefs;
  }

}
