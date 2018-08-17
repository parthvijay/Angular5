import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';
import { APP_CONFIG, AppConfig } from './../app-config';

@Injectable()
export class CreatePipelineService {
  oppName: any;
  savId: string;
  refId: string;
  guId: string;
  account = {
    accountId: ''
  };
  opp_name: string;
  accountName: string;
  accountOwnerName: string;
  description = '';
  forecastStatus: string;
  optyInstallBase: string;
  serviceSource: string;
  selectedDate = {
    year: '',
    month: '',
    day: ''
  };
  oppOwner = {
    name: '',
    sfdcId: '',
    cecId: '',
    forecastingPos: '',
    territory: ''
  };
  stepOneAccount: any;
  newOpurtunity = { selectedTechnologies: {}, selectedServices: {} };
  serviceTechPayload = {
    selectedTechnologies: [],
    selectedServices: []
  };
  ExpectedProductValue: string;
  ExpectedServiceValue: string;
  selectedStage = 'Prospect';
  installBase = [];
  disableInstallBase = false;
  validAccountSelected = false;
  validOpportunitySelected = false;
  isForecastSelected = true;
  successObj: any;
  guSiteDetails = { product_list: '0', attach_list: '0', renew_net: '0' };
  opportunity: any;
  forecastStatusList = [];

  constructor(private http: Http,
    private utilitiesService: UtilitiesService,
    private apiDispatcherServ: ApiDispacherService,
    @Inject(APP_CONFIG) private config: AppConfig
  ) {
    const qualName = this.utilitiesService.getPipelineDetails().qualificationName;
    this.opp_name = qualName ? qualName : '';
    const env = this.config.env;
    const apiDomain = this.config.apiDomain;
    this.ExpectedProductValue = '0';
    this.ExpectedServiceValue = '0';
  }

  // setting savId from qualification
  setSavId(id) {
    this.savId = id;
  }

  // getting savId for qualification
  getSavId() {
    return this.savId;
  }

  // setting refId from qualification
  setRefId(id) {
    this.refId = id;
  }

  // getting refId for qualification
  getRefId() {
    return this.refId;
  }

  // setting refId from qualification
  setGUId(guId) {
    this.guId = guId;
  }

  // getting refId for qualification
  getGUId() {
    return this.guId;
  }

  // *************************** STEP ONE METHODS  ******************************

  // getCERefId(apiUrl) {
  //   return this.apiDispatcherServ.doFilterApiCall(apiUrl, 'GET', undefined);
  // }

  getOpportunityOptions() {
    return this.http.get('assets/data/create-pipeline/step-one/opportunity_stage.json')
      .map(res => res.json());
  }
  getInstallBaseOptions() {
    return this.http.get('assets/data/create-pipeline/step-two/install-base.json')
      .map(res => res.json());
  }
  getForecastStatusOptions() {
    return this.http.get('assets/data/create-pipeline/step-one/forecast_status.json')
      .map(res => res.json());
  }

  // set accounts api deatis of ALL Accounts
  setOpportunityAccounts(acc) {
    this.stepOneAccount = acc;
  }

  getOpportunityAccounts() {
    return this.stepOneAccount.data;
  }

  // set Opportunity Name
  setOpportunityName(name) {
    this.opp_name = name;
  }

  // set Selected Account Name
  setAccountName(accName) {
    this.accountName = accName;
  }

  searchArrayObject(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].id === nameKey) {
        return myArray[i];
      }
    }
  }

  isStepOneValid() {
    if (this.opp_name && Object.keys(this.selectedDate).length && this.validAccountSelected && this.validOpportunitySelected && this.isForecastSelected && this.oppOwner.name) {
      return true;
    }
    return false;
  }

  getAllocationValue(c, d) {
    const plainNumber = c.toString().replace(/[^\d|\-+|\.+]/g, '');
    const n = parseInt(plainNumber, 10) * (0.01 * d);
    return this.utilitiesService.formatValue(n);
  }

  // *************************** STEP THREE METHODS  ******************************

  // to generate service and product payload
  getServiceTechPayload(opp) {
    // Tech Payload
    this.serviceTechPayload.selectedTechnologies = [];
    Object.keys(opp.selectedTechnologies).forEach(tech => {
      if (this.newOpurtunity.selectedTechnologies.hasOwnProperty(tech)) {
        const productObj = {
          'id': this.newOpurtunity.selectedTechnologies[tech].id,
          'technology': tech,
          'productMixPercent': this.newOpurtunity.selectedTechnologies[tech].value,
        };
        this.serviceTechPayload.selectedTechnologies.push(productObj);
      }
    });

    // Service Payload
    this.serviceTechPayload.selectedServices = [];
    Object.keys(opp.selectedServices).forEach(ser => {
      if (this.newOpurtunity.selectedServices.hasOwnProperty(ser)) {
        const serviceObj = {
          'id': this.newOpurtunity.selectedServices[ser].id,
          'serviceProgram': ser,
          'serviceCategory': this.newOpurtunity.selectedServices[ser].serviceCategorySelected,
          'serviceLevel': this.newOpurtunity.selectedServices[ser].serviceLevelSelected,
          'serviceMixPercent': this.newOpurtunity.selectedServices[ser].value
        };
        this.serviceTechPayload.selectedServices.push(serviceObj);
      }
    });
  }

  // value mapping for install base and serviceSource
  getMappingForServiceSource() {
    if (this.installBase[0] === 'Renew') {
      this.optyInstallBase = 'Service Renew';
      this.serviceSource = 'Renewal';
    } else if (this.installBase[0] === 'Refresh') {
      this.optyInstallBase = 'Cisco Refresh - Digital Ready';
      this.serviceSource = 'New';
    } else if (this.installBase[0] === 'Attach') {
      this.optyInstallBase = 'Service Attach';
      this.serviceSource = 'New';
    } else if (this.installBase[0] === 'drs') {
      this.optyInstallBase = 'Cisco Refresh - Digital Ready';
      this.serviceSource = 'New';
    }
  }

  // create pipeline final call
  createPipeline (apiUrl, tab) {
    let hanaDetails;
    this.getServiceTechPayload(this.newOpurtunity);
    this.getMappingForServiceSource();
    if (tab === 'qualification') {
      hanaDetails = {
        'customerName': this.utilitiesService.getCustomerName(),
        'qualName': this.utilitiesService.getPipelineDetails().qualificationName,
        'optyName': this.opp_name,
        'ibType': this.installBase[0],
        'qualId': this.utilitiesService.getPipelineDetails().qualficationId,
        'globalCustomerView': this.utilitiesService.getGlobalCustomerView()
      };
    }
    if (this.selectedStage === 'Prospect') {
      this.forecastStatus = 'Not Forecastable';
    }
    const optyProductAmount = this.ExpectedProductValue.replace(/,\s?/g, '');
    const optyServiceAmount = this.ExpectedServiceValue.replace(/,\s?/g, '');
    const payload = {
      'forecastCloseDate': this.selectedDate.year + '-' + this.selectedDate.month + '-' + this.selectedDate.day,
      'partnerRequired': 'false',
      'sourceRefId': this.refId,
      'forecastStatus': this.forecastStatus,
      'ownerId': this.oppOwner.sfdcId,
      'optyProductAmount': parseInt(optyProductAmount, 10),
      'optyName': this.opp_name,
      'products': this.serviceTechPayload.selectedTechnologies,
      'salesAgent': this.oppOwner.cecId,
      'optyInstallBase': this.optyInstallBase,
      'serviceSource': this.serviceSource,
      'description': this.description,
      'sourceSystemId': 'CE',
      'services': this.serviceTechPayload.selectedServices,
      'optyStatus': 'Active',
      'requestor': this.utilitiesService.getUserInformation().user.userId,
      'accountId': this.account.accountId,
      'optyServiceAmount': parseInt(optyServiceAmount, 10),
      'forecastPosition': this.oppOwner.forecastingPos,
      'optyStage': this.selectedStage,
      'hanaDetails': hanaDetails ? hanaDetails : null,
    };
    apiUrl = this.config.apiDomain[this.config.env] + apiUrl;
    return this.apiDispatcherServ.doFilterApiCall(apiUrl, 'POST', payload);
  }

  getRefIdDetails(refId) {
    const apiUrl = this.config.apiDomain[this.config.env] + '/pipeline/refFilters/' + refId;
    return this.apiDispatcherServ.doFilterApiCall(apiUrl, 'GET', undefined);
  }

  clearAllStepValues() {
    this.ExpectedProductValue = '0';
    this.ExpectedServiceValue = '0';
    this.account = {
      accountId: ''
    };
    this.accountName = '';
    this.accountOwnerName = '';
    this.description = '';
    this.forecastStatus = '';
    this.guId = '';
    this.guSiteDetails = { product_list: '0', attach_list: '0', renew_net: '0' };
    this.installBase = [];
    this.isForecastSelected = true;
    this.newOpurtunity = { selectedTechnologies: {}, selectedServices: {} };
    this.oppOwner = {
      name: '',
      sfdcId: '',
      cecId: '',
      forecastingPos: '',
      territory: ''
    };
    this.opp_name = '';
    this.optyInstallBase = '';
    this.refId = '';
    this.savId = '';
    this.selectedDate = {
      year: '',
      month: '',
      day: ''
    };
    this.selectedStage = 'Prospect';
    this.serviceSource = '';
    this.serviceTechPayload = {
      selectedTechnologies: [],
      selectedServices: []
    };
  }
}
