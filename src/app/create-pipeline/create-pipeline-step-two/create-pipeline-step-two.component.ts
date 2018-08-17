import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { CreatePipelineService } from '../create-pipeline.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreatePipelineServiceAllComponent } from '../modal/create-pipeline-service-all/create-pipeline-service-all.component';
import { CreatePipelineTechnologyAllComponent } from '../modal/create-pipeline-technology-all/create-pipeline-technology-all.component';
import { CreatePipelineTechnologyIbComponent } from '../modal/create-pipeline-technology-ib/create-pipeline-technology-ib.component';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { CreatePipelineStepTwoService } from './create-pipeline-step-two.service';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-create-pipeline-step-two',
  templateUrl: './create-pipeline-step-two.component.html',
  styleUrls: ['./create-pipeline-step-two.component.css']
})

export class CreatePipelineStepTwoComponent implements OnInit {
  tab: string;
  subTab: string;
  refId: string;
  backUrlText: string;
  backUrl: string;
  stepOneUrl: string;
  stepThreeUrl: string;
  selectedDate: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  technologies = {};
  services = {};
  techList = [];
  serviceList = [];
  searchTech: any;
  searchServ: any;
  objectKeys = Object.keys;
  close: any;
  noRecord: any;
  checkAllBoxes: any;
  serviceSelected: any;
  closeService: any;
  noRecordService: any;
  searchService: any;
  baseTypeOptions: IMultiSelectOption[];
  mySettings: IMultiSelectSettings = { selectionLimit: 1, autoUnselect: true, closeOnSelect: true };
  basetypeTexts: IMultiSelectTexts = { defaultTitle: 'Select' };
  searchTechTypeahead = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => this.techList.filter(v => v.businessProdFamily.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  searchServTypeahead = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .map(term => this.serviceList.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))

  formatter = (x: { businessProdFamily: string }) => x.businessProdFamily;
  formatterServ = (x: { name: string }) => x.name;

  constructor(
    public createPipelineService: CreatePipelineService,
    public modalVar: NgbModal,
    public utilitiesService: UtilitiesService,
    public loaderService: LoaderService,
    private routerObj: Router,
    public createPipelineStepTwoService: CreatePipelineStepTwoService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getInstallBaseOptions();
    this.route.params.subscribe((params: ParamMap) => {
      this.tab = params['tab'];
      this.subTab = params['subTab'];
      this.refId = params['refId'];
    });
    this.stepOneUrl = '/create-pipeline/one/' + this.tab + '/' + this.subTab + '/' + this.refId;
    this.stepThreeUrl = '/create-pipeline/three/' + this.tab + '/' + this.subTab + '/' + this.refId;
    this.backUrlAndText();
    this.getTechServices();
    this.autopopulateValues();
  }

  backUrlAndText() {
    if (this.tab === 'qualification') {
      this.backUrlText = 'Back to Qualification';
      this.backUrl = '/intermediate-summary/' + this.utilitiesService.custName + '/' + this.utilitiesService.globalCustView;
    } else {
      let text = '';
      if (this.tab === 'refresh') {
        text = 'Refresh';
      } else if (this.tab === 'renew') {
        text = 'Renew';
      } else if (this.tab === 'attach') {
        text = 'Attach';
      }
      this.createPipelineService.installBase = [text];
      this.backUrlText = 'Back to ' + text;
    }
  }

  returnUrl() {
    if (this.tab === 'qualification') {
      this.backUrl = '/intermediate-summary/' + this.utilitiesService.custName + '/' + this.utilitiesService.globalCustView;
      this.routerObj.navigate([this.backUrl]);
    } else {
      window.localStorage.setItem('refId', this.refId);
      this.backUrl = window.location.origin + '/#/sales/analysis/' + this.tab + '/' + this.subTab;
      window.open(this.backUrl, '_self');
    }
  }

  getTechServices() {
    this.createPipelineStepTwoService.getTechServices()
      .subscribe(result => {
        this.loaderService.hide();
        const data = result.data;
        const tech = data.technology;
        const technologies = {};
        const serv = data.service;
        const services = {};

        tech.forEach(function (t) {
          const options = [];
          technologies[t.name] = {};
          technologies[t.name].value = 0;
          technologies[t.name].id = t.id;
          t.productFamily.forEach(function (u) {
            options.push({ 'key': u });
          });
          technologies[t.name].options = options;
        });
        this.technologies = technologies;

        serv.serviceList.forEach(function (t) {
          services[t.name] = {};
          services[t.name].value = 0;
          services[t.name].id = t.id;
          services[t.name].serviceLevel = [];
          t.serviceLevel.forEach(function (f, i) {
            services[t.name].serviceLevel.push({
              'id': i,
              'name': f
            });
          });
          services[t.name].serviceCategory = [];
          serv.serviceCategories.forEach(function (f, i) {
            services[t.name].serviceCategory.push({
              'id': i,
              'name': f
            });
          });
        });
        this.services = services;

        const prodFamily = [];

        for (const key in technologies) {
          if (technologies.hasOwnProperty(key)) {
            prodFamily.push({ 'name': key, 'productFamily': false, 'businessProdFamily': key });

            technologies[key].options.forEach(v => {
              prodFamily.push({ 'name': key, 'productFamily': v.key, 'businessProdFamily': key + ': ' + v.key });
            });
          }
        }

        this.techList = prodFamily;

        for (const key2 in services) {
          if (services.hasOwnProperty(key2)) {
            this.serviceList.push({ 'name': key2 });
          }
        }
      });
  }

  isDeleteEnabled(a) {
    let selected = false;
    for (const key in a) {
      if (a[key].boxes) {
        selected = true;
      }
    }
    return selected;
  }

  deleteTechnology() {
    for (const key in this.createPipelineService.newOpurtunity.selectedTechnologies) {
      if (this.createPipelineService.newOpurtunity.selectedTechnologies[key].boxes) {
        delete this.createPipelineService.newOpurtunity.selectedTechnologies[key];
        this.technologies[key].selected = false;
        this.technologies[key].options = this.technologies[key].options.filter
          (function (object) {
            object.selected = false;
            return object;
          });
      }
    }
    this.checkAllBoxes = false;
  }

  deleteService() {
    for (const key in this.createPipelineService.newOpurtunity.selectedServices) {
      if (this.createPipelineService.newOpurtunity.selectedServices[key].boxes) {
        delete this.createPipelineService.newOpurtunity.selectedServices[key];
      }
    }
    this.serviceSelected = false;
  }

  onTechSelect($event) {
    this.close = true;
    this.noRecord = false;
    const selected = $event.item;
    const c = JSON.parse(JSON.stringify(this.technologies));
    for (const key in c) {
      if (key === selected.name) {
        if (!selected.productFamily) {
          c[key].selected = true;
          c[key]['options'].forEach(option => {
            option.selected = true;
          });
          const abc = {
            id: '',
            technology: '',
            productMixPercent: ''
          };
          this.createPipelineService.newOpurtunity.selectedTechnologies[key] = c[key];
        } else {
          if (!this.createPipelineService.newOpurtunity.selectedTechnologies[key]) {
            this.createPipelineService.newOpurtunity.selectedTechnologies[key] = c[key];
            this.createPipelineService.newOpurtunity.selectedTechnologies[key].options = [];
          }

          const f = this.utilitiesService.findKeyValue(this.createPipelineService.newOpurtunity.selectedTechnologies[key].options, 'key', selected.productFamily);
          if (f === -1) {
            this.createPipelineService.newOpurtunity.selectedTechnologies[key].options.push({ 'key': selected.productFamily, 'selected': true });
            c[key]['options'].forEach(option => {
              if (option.key === selected.productFamily) {
                option.selected = true;
              }
            });
          }
        }
      }
    }

    if (Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length === 1) {
      for (const key in this.createPipelineService.newOpurtunity.selectedTechnologies) {
        if (this.createPipelineService.newOpurtunity.selectedTechnologies.hasOwnProperty(key)) {
          this.createPipelineService.newOpurtunity.selectedTechnologies[key].value = 100;
        }
      }
    }

    this.searchTech = '';
  }

  onServiceSelect($event) {
    this.closeService = true;
    this.noRecordService = false;
    const selected = $event.item;
    const c = JSON.parse(JSON.stringify(this.services));
    for (const key in c) {
      if (key === selected.name && !this.createPipelineService.newOpurtunity.selectedServices[key]) {
        this.createPipelineService.newOpurtunity.selectedServices[key] = c[key];
        this.createPipelineService.newOpurtunity.selectedServices[key].selected = true;
        this.createPipelineService.newOpurtunity.selectedServices[key].serviceLevelSelected = '';
        this.createPipelineService.newOpurtunity.selectedServices[key].serviceCategorySelected = '';
      }
    }

    if (Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length === 1) {
      for (const key in this.createPipelineService.newOpurtunity.selectedServices) {
        if (this.createPipelineService.newOpurtunity.selectedServices.hasOwnProperty(key)) {
          this.createPipelineService.newOpurtunity.selectedServices[key].value = 100;
        }
      }
    }

    // console.log(this.createPipelineService.newOpurtunity.selectedServices);

    this.searchService = '';

  }

  // open Show All Technologies modal
  openShowAllTechModal() {
    const modalRef = this.modalVar.open(CreatePipelineTechnologyAllComponent, this.ngbModalOptions);
    modalRef.componentInstance.technologies = JSON.parse(JSON.stringify(this.technologies));
    modalRef.componentInstance.selectedTechnologies = JSON.parse(JSON.stringify(this.createPipelineService.newOpurtunity.selectedTechnologies));
    modalRef.result.then((result) => {
      this.createPipelineService.newOpurtunity.selectedTechnologies = result.selectedTech;
      const resultLength = Object.keys(result).length;
      if (resultLength === 0) {
        this.close = false;
        this.noRecord = true;
      } else {
        this.close = true;
        this.noRecord = false;
      }

      let i = 0;
      for (const key in this.createPipelineService.newOpurtunity.selectedTechnologies) {
        if (this.createPipelineService.newOpurtunity.selectedTechnologies.hasOwnProperty(key)) {
          this.createPipelineService.newOpurtunity.selectedTechnologies[key].value = 100;
          if (!(this.createPipelineService.newOpurtunity.selectedTechnologies[key].value >= 1 && this.createPipelineService.newOpurtunity.selectedTechnologies[key].value <= 99)) {
            this.createPipelineService.newOpurtunity.selectedTechnologies[key].value = i === 0 ? 100 : 0;
          }
          i++;
        }
      }
    }, (reason) => {
    });
  }

  // set payload to get Technologies by IB
  setPayloadByTab(tab) {
    let payload = {};
    if (tab === 'qualification') {
      payload = {
        qualId: this.utilitiesService.getPipelineDetails().qualficationId,
        globalCustomerView: this.utilitiesService.getGlobalCustomerView(),
        customerName: this.utilitiesService.custName,
        guName: this.createPipelineService.guId,
        ibType: this.createPipelineService.installBase
      };
    } else {
      // payload = {
      //   qualId: null,
      //   globalCustomerView: 'N',
      //   customerName: this.createPipelineService.opp_name,
      //   guName: this.createPipelineService.guId,
      //   ibType: this.createPipelineService.installBase
      // };
    }
    return payload;
  }

  // open Show All Technologies IB modal
  openShowAllTechIbModal() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'create-pipeline-technology-ib-modal';
    const modalRef = this.modalVar.open(CreatePipelineTechnologyIbComponent, ngbModalOptionsLocal);
    modalRef.componentInstance.payload = this.setPayloadByTab(this.tab);
    modalRef.result.then((result) => {
    }, (reason) => {
    });
  }

  // open Show All Service modal
  openShowAllServiceModal() {
    const modalRef = this.modalVar.open(CreatePipelineServiceAllComponent, this.ngbModalOptions);
    modalRef.componentInstance.services = JSON.parse(JSON.stringify(this.services));
    modalRef.componentInstance.selectedServices = JSON.parse(JSON.stringify(this.createPipelineService.newOpurtunity.selectedServices));
    modalRef.result.then((data) => {
      const result = data.selectedServ;
      this.createPipelineService.newOpurtunity.selectedServices = result;
      const resultLength = Object.keys(result).length;

      if (resultLength === 0) {
        this.closeService = false;
        this.noRecordService = true;
      } else {
        this.closeService = true;
        this.noRecordService = false;
      }
      let i = 0;
      for (const key in this.createPipelineService.newOpurtunity.selectedServices) {
        if (this.createPipelineService.newOpurtunity.selectedServices.hasOwnProperty(key)) {
          this.createPipelineService.newOpurtunity.selectedServices[key].value = 100;
          this.createPipelineService.newOpurtunity.selectedServices[key].serviceLevelSelected = '';
          this.createPipelineService.newOpurtunity.selectedServices[key].serviceCategorySelected = '';
          if (!(this.createPipelineService.newOpurtunity.selectedServices[key].value >= 1 && this.createPipelineService.newOpurtunity.selectedServices[key].value <= 99)) {
            this.createPipelineService.newOpurtunity.selectedServices[key].value = i === 0 ? 100 : 0;
          }
          i++;
        }
      }
    }, (reason) => {
    });
  }

  validateExp(event, d, auto) {
    let plainNumber;
    if (auto) {
      plainNumber = d;
    } else {
      plainNumber = this.createPipelineService[d];
    }
    plainNumber = plainNumber.toString().replace(/[^\d|\-+|\.+]/g, '');
    if (plainNumber.length > 15) {
      plainNumber = plainNumber.substring(0, 15);
    }
    if (!plainNumber) {
      plainNumber = '0';
    }
    plainNumber = this.utilitiesService.formatNumber(plainNumber);
    if (auto) {
      return plainNumber;
    } else {
      this.createPipelineService[d] = plainNumber;
      event.target.value = plainNumber;
    }
  }

  isTechValid() {
    if (!this.createPipelineService.ExpectedProductValue || parseInt(this.createPipelineService.ExpectedProductValue, 10) < 0) {
      return true;
    }
    const total_1 = this.utilitiesService.sumByKey(this.createPipelineService.newOpurtunity.selectedTechnologies, 'value');
    if ((total_1 && total_1 === 100) || !Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length) {
      return true;
    }
    return false;
  }

  isServValid() {
    if (!this.createPipelineService.ExpectedServiceValue || parseInt(this.createPipelineService.ExpectedServiceValue, 10) < 0) {
      return true;
    }

    const total_1 = this.utilitiesService.sumByKey(this.createPipelineService.newOpurtunity.selectedServices, 'value');
    if ((total_1 && total_1 === 100) || !Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length) {
      return true;
    }
    return false;
  }

  checkAll(b, k) {
    for (const key in k) {
      if (k.hasOwnProperty(key)) {
        k[key].boxes = b;
      }
    }
  }

  checkParent(a, allFlag) {
    let s = false;
    let checked = 0;

    for (const key in a) {
      if (a.hasOwnProperty(key)) {
        if (a[key].boxes) {
          checked++;
        }
      }
    }

    if (Object.keys(a).length === checked) {
      s = true;
    } else {
      s = false;
    }

    if (allFlag === 'technology') {
      this.checkAllBoxes = s;
    } else if (allFlag === 'service') {
      this.serviceSelected = s;
    }
  }

  isServDropdownValid() {
    let valid = true;
    for (const key in this.createPipelineService.newOpurtunity.selectedServices) {
      if (!this.createPipelineService.newOpurtunity.selectedServices[key].serviceLevelSelected || !this.createPipelineService.newOpurtunity.selectedServices[key].serviceCategorySelected) {
        valid = false;
      }
    }
    return valid;
  }

  isTechRowsValid() {
    if ((!this.createPipelineService.ExpectedProductValue || parseInt(this.createPipelineService.ExpectedProductValue, 10) <= 0)
    || (Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length)) {
      return true;
    }
    return false;
  }

  isServRowsValid() {
    if ((!this.createPipelineService.ExpectedServiceValue || parseInt(this.createPipelineService.ExpectedServiceValue, 10) <= 0)
   || (Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length)) {
      return true;
    }
    return false;
  }

  isTechAllocationValid() {
    if ((!this.createPipelineService.ExpectedProductValue || parseInt(this.createPipelineService.ExpectedProductValue, 10) < 0) && Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length) {
      return false;
    }
    return true;
  }

  isServAllocationValid() {
    if ((!this.createPipelineService.ExpectedServiceValue || parseInt(this.createPipelineService.ExpectedServiceValue, 10) < 0) && Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length) {
      return false;
    }
    return true;
  }

  isValuesValid() {
    if ((!this.createPipelineService.ExpectedProductValue || parseInt(this.createPipelineService.ExpectedProductValue, 10) >= 0) && (!this.createPipelineService.ExpectedServiceValue || parseInt(this.createPipelineService.ExpectedServiceValue, 10) >= 0) && (parseInt(this.createPipelineService.ExpectedProductValue, 10) > 0 || parseInt(this.createPipelineService.ExpectedServiceValue, 10) > 0)) {
      return true;
    }
    return false;
  }

  isStepTwoValid() {
    if (this.createPipelineService.installBase && !(!this.isTechValid() || !this.isTechRowsValid() || !this.isServValid() || !this.isServRowsValid() || !this.isValuesValid() || !this.isTechAllocationValid() || !this.isServAllocationValid() || !this.isServDropdownValid())) {
      if (parseInt(this.createPipelineService.ExpectedProductValue, 10) >= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length < 0) {
        return false;
      } else if (parseInt(this.createPipelineService.ExpectedServiceValue, 10) >= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length < 0) {
        return false;
      } else if (parseInt(this.createPipelineService.ExpectedProductValue, 10) <= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length <= 0 && parseInt(this.createPipelineService.ExpectedServiceValue, 10) <= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length <= 0) {
        return false;
      } else if (parseInt(this.createPipelineService.ExpectedProductValue, 10) > 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length > 0 && parseInt(this.createPipelineService.ExpectedServiceValue, 10) <= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length > 0) {
        return false;
      } else if (parseInt(this.createPipelineService.ExpectedProductValue, 10) <= 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedTechnologies).length > 0 && parseInt(this.createPipelineService.ExpectedServiceValue, 10) > 0 && Object.keys(this.createPipelineService.newOpurtunity.selectedServices).length > 0) {
        return false;
      }
      return true;
    }
  }

  autopopulateValues() {
    const installBase = this.createPipelineService.installBase;
    const netValue = window.localStorage.getItem('totalVal');
    if (installBase[0] === 'Renew' || installBase[0] === 'renew') {
      if (netValue !== null) {
        this.createPipelineService.guSiteDetails.renew_net = netValue;
      }
      this.createPipelineService.ExpectedServiceValue = this.validateExp(false, this.createPipelineService.guSiteDetails.renew_net, true);
      if (this.createPipelineService.ExpectedProductValue !== '0') {
        this.createPipelineService.ExpectedProductValue = this.createPipelineService.ExpectedProductValue;
      } else {
        this.createPipelineService.ExpectedProductValue = '0';
      }
    } else if (installBase[0] === 'Attach' || installBase[0] === 'attach') {
      if (netValue !== null) {
        this.createPipelineService.guSiteDetails.attach_list = netValue;
      }
      this.createPipelineService.ExpectedServiceValue = this.validateExp(false, this.createPipelineService.guSiteDetails.attach_list, true);
      if (this.createPipelineService.ExpectedProductValue !== '0') {
        this.createPipelineService.ExpectedProductValue = this.createPipelineService.ExpectedProductValue;
      } else {
        this.createPipelineService.ExpectedProductValue = '0';
      }
    } else if (installBase[0] === 'Refresh' || installBase[0] === 'refresh') {
      if (this.createPipelineService.ExpectedServiceValue !== '0') {
        this.createPipelineService.ExpectedServiceValue = this.createPipelineService.ExpectedServiceValue;
      } else {
        this.createPipelineService.ExpectedServiceValue = '0';
      }
      if (netValue !== null) {
        this.createPipelineService.guSiteDetails.product_list = netValue;
      }
      this.createPipelineService.ExpectedProductValue = this.validateExp(false, this.createPipelineService.guSiteDetails.product_list, true);
    }
  }

  getInstallBaseOptions() {
    this.createPipelineService.getInstallBaseOptions()
      .subscribe((data: any) => {
        this.baseTypeOptions = data;
      });
  }
}
