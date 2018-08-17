import { UtilitiesService } from './../../shared/services/utilities.service';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { PieChartComponent } from './chart/pie-chart/pie-chart.component';
import { CreatePipelineDetailsService } from './create-pipeline-details.service';
import { CreatePipelineService } from '../create-pipeline.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CreatePipelineContractsComponent } from '../modal/create-pipeline-contracts/create-pipeline-contracts.component';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-create-pipeline-details',
  templateUrl: './create-pipeline-details.component.html',
  styleUrls: ['./create-pipeline-details.component.css']
})
export class CreatePipelineDetailsComponent implements OnInit {
  qualDetails: any;
  global: string;
  selectedGUName: string;
  areas: any[];
  public customerName: string;
  chartData: any;
  active: Array<any>;
  areaDetails: any;
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  selectedGUSite: any[];
  guSiteDetailsObj = {
    product_list: '',
    total_contracts: '',
    attach_list: '',
    contracts_selected: '',
    renew_net: '',
    lineItems: ''
  };
  selectedGUSiteOptions: IMultiSelectOption[];
  savId: string;
  showErrorMsg = false;
  hasProxy = false;
  errorMsg: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    private routerObj: Router,
    public createPipelineDetailsService: CreatePipelineDetailsService,
    public createPipelineService: CreatePipelineService,
    private utilitiesService: UtilitiesService,
    public loaderService: LoaderService,
    private modalVar: NgbModal) {
      const proxy = window.localStorage.getItem('proxy');
      const parthAdmin = JSON.parse(window.localStorage.getItem('proxy-admin'));
      if (proxy !== null) {
        if (parthAdmin.userId === 'dsadovni' || parthAdmin.userId === 'vijatrip' || parthAdmin.userId === 'pavijayv') {
          this.hasProxy = false;
        } else {
          this.hasProxy = true;
        }
      }
    }

  ngOnInit() {
    this.qualDetails = this.utilitiesService.getPipelineDetails();
    this.global = this.utilitiesService.getGlobalCustomerView();
    this.getCreatePipelineDetails();
    // this.getChartData();
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true
    };
    this.myTexts = {
      defaultTitle: ''
    };
    this.selectedGUSite = ['99999'];
  }

  // get values of details screen and SavId (Both have same payload)
  getCreatePipelineDetails() {
    const metaData = {
      'lineItems': 0,
      'totalOpportunity': 0,
      'inPipeline': 0,
      'availableForPipeline': 0,
      'totalContracts': 0,
      'contractsSelected': 0
    };
    const payload = {
      qualId: this.qualDetails.qualficationId,
      globalCustomerView: this.global,
      customerName: this.utilitiesService.getCustomerName()
    };
    // for getting SavId for this customer...
    this.createPipelineDetailsService.getSavIds(payload)
    .subscribe((res: any) => {
      this.loaderService.hide();
      this.savId = res.data.savId;
      this.createPipelineService.setSavId(res.data.savId);
    });
    // for getting values of details screen...
    this.createPipelineDetailsService.getCreatePipelineDetails(payload)
      .subscribe((res: any) => {
        this.loaderService.hide();
        this.customerName = res.data[0].name;
        this.selectedGUSiteOptions = res.data[0].areas;
      });
  }

  // qualify reason code value changed
  guSiteChange(r) {
    if (r.length > 0) {
      this.createPipelineService.setGUId(r[0]);
      const guSiteList = this.selectedGUSiteOptions;
      const guSiteNameObj = this.createPipelineService.searchArrayObject(r[0], guSiteList);
      this.selectedGUName = guSiteNameObj.name;
      this.guSiteDetailsObj = guSiteNameObj.details;
      this.createPipelineService.guSiteDetails = guSiteNameObj.details;
    }
  }

  updateActive(active: Array<any>): void {
    this.active = active.slice();
  }

  // for opening List of All Contracts...
  openContractsModal() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'create-pipeline-contracts-modal';
    const modalRef = this.modalVar.open(CreatePipelineContractsComponent, ngbModalOptionsLocal);
    // modalRef.componentInstance.guName = this.selectedGUName;
    modalRef.componentInstance.guName = this.selectedGUSite[0];
  }

  // This function has three steps:
  // 1. generate refId before creating pipeline,
  // 2. call Accounts SFDC Api to get account details for step one
  // 3. if user has forcasting position then take user to step one else throw error
  goToStepOne() {
    // payload for generating refId
    const refIdPayload = {
      qualId: this.qualDetails.qualficationId
    };
    this.createPipelineDetailsService.generateRefId(refIdPayload)
    .subscribe((res: any) => {
      this.loaderService.hide();
      this.createPipelineService.setRefId(res.data.refId);

      // making call to get pipeline-accounts
      const accountPayload = {
        'savId': this.savId,
        'opptyOwnerFlag': 'Y',
        'sourceSystemId': 'CE',
        'guId': this.selectedGUSite[0]
      };
      this.createPipelineDetailsService.getPipelineAccounts(accountPayload)
      .subscribe((acc: any) => {
        this.loaderService.hide();
        if (acc.errorCode === 'ERR-599') {
          this.showErrorMsg = true;
          this.errorMsg = acc.errorDescription;
        } else if (acc.errorCode === 'ERR-597') {
          this.showErrorMsg = true;
          this.errorMsg = acc.errorDescription;
        } else if (acc.data.length === 0) {
            this.showErrorMsg = true;
            this.errorMsg = 'No Data Available';
        } else {
          for (let i = 0; i < acc.data.length; i++) {
            const terr = acc.data[i].addressLine1 +  ' ' + acc.data[i].addressLine2 + ',' + acc.data[i].city + ','
                        + acc.data[i].state + ',' + acc.data[i].country + '-' + acc.data[i].zipCode;
            acc.data[i].terrirory = terr;
          }
          const stepOne = '/create-pipeline/one/qualification/subTab/' + this.createPipelineService.getRefId();
          this.routerObj.navigate([stepOne]);
          this.createPipelineService.setOpportunityAccounts(acc);
        }
      }, error => {
        this.loaderService.hide();
        this.showErrorMsg = true;
        this.errorMsg = 'Some Error Occured!! Please try again after sometime.';
      }); // end of account call
    }); // end of generate RefId call
  }
}
