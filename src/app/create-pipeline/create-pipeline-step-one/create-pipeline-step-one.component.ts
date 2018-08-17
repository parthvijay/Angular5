import { Component, OnInit, ViewChild } from '@angular/core';
// import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
// import { FormControlName } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { CreatePipelineService } from '../create-pipeline.service';
import { timeout } from 'q';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { LoaderService } from '../../shared/loader/loader.service';
import { CreatePipelineDetailsService } from '../create-pipeline-details/create-pipeline-details.service';
import { MainHeaderService } from '../../main-header/main-header.service';
import { debounceTime, distinctUntilChanged, filter, map, merge } from 'rxjs/operators';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-pipeline-step-one',
  templateUrl: './create-pipeline-step-one.component.html',
  styleUrls: ['./create-pipeline-step-one.component.css']
})

export class CreatePipelineStepOneComponent implements OnInit {
  tab: string;
  subTab: string;
  refId: string;
  backUrlText: string;
  backUrl: string;
  oppAccountData: any[];
  opportunityName: string;
  oppOwnerList: any[];
  nameOpp = 'New Opportunity';
  showOwnerList = false;
  stepTwoUrl: string;
  accountOwnerName: string;
  description: string;
  // account: any[];
  // selectedDate: any[];
  // mySettings: IMultiSelectSettings;
  // myTexts: IMultiSelectTexts;
  isSelectedStage = false;
  opportunityOptions: IMultiSelectOption[];
  opportunityTexts: IMultiSelectTexts = { defaultTitle: 'Select' };
  mySettings: IMultiSelectSettings = { selectionLimit: 1, autoUnselect: true, closeOnSelect: true };
  myTexts: IMultiSelectTexts = { defaultTitle: '' };
  // opportunity = [];
  forecastStatusOptions: IMultiSelectOption[];
  forecastStatusTexts: IMultiSelectTexts = { defaultTitle: 'Select' };
  userInfo: any;
  loggedInUsername: string;
  enableOppStage = false;

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(public createPipelineService: CreatePipelineService,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private routerObj: Router,
    public loaderService: LoaderService,
    public createPipelineDetailsService: CreatePipelineDetailsService,
  ) {
    // this.opportunityName = this.utilitiesService.getPipelineDetails().qualificationName;
    this.opportunityName = this.createPipelineService.opp_name;
    this.description = this.createPipelineService.description;
  }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.tab = params['tab'];
      this.subTab = params['subTab'];
      this.refId = params['refId'];
    });
    this.stepTwoUrl = '/create-pipeline/two/' + this.tab + '/' + this.subTab + '/' + this.refId;
    this.getOpportunityOptions();
    this.getForecastStatusOptions();
    this.backUrlAndText();
    this.userInfo = this.utilitiesService.getUserInformation();
    if (this.userInfo) {
      this.loggedInUsername = this.userInfo.user.userId;
    }
    if (this.tab === 'qualification') {
      this.getOpportunityAccount();
    } else {
      const accountDetails = JSON.parse(sessionStorage.getItem('accountDetails'));
      this.createPipelineService.setOpportunityName(accountDetails[0].state);
      this.opportunityName = this.createPipelineService.opp_name;
      this.createPipelineService.setRefId(this.refId);
      // this.createPipelineService.installBase[0] = this.tab;
      const savId = window.localStorage.getItem('savId');
      const guId = window.localStorage.getItem('guId');
      window.localStorage.removeItem('savId');
      window.localStorage.removeItem('guId');
      const accountPayload = {
        'savId': savId,
        'opptyOwnerFlag': 'Y',
        'sourceSystemId': 'CE',
        'guId': guId
      };
      if (savId !== null) {
        this.createPipelineDetailsService.getPipelineAccounts(accountPayload)
        .subscribe((acc: any) => {
          this.loaderService.hide();
          for (let i = 0; i < acc.data.length; i++) {
            const terr = acc.data[i].addressLine1 +  ' ' + acc.data[i].addressLine2 + ',' + acc.data[i].city + ','
                        + acc.data[i].state + ',' + acc.data[i].country + '-' + acc.data[i].zipCode;
            acc.data[i].terrirory = terr;
          }
          this.createPipelineService.setOpportunityAccounts(acc);
          this.getOpportunityAccount();
        }, error => {
          this.loaderService.hide();
        }); // end of account call
      }
    }
  }

  // get text for going back
  backUrlAndText() {
    if (this.tab === 'qualification') {
      this.createPipelineService.setOpportunityName(this.opportunityName);
      this.backUrlText = 'Back to Qualification';
    } else {
      let text = '';
      if (this.tab === 'refresh') {
        text = 'Refresh';
      } else if (this.tab === 'renew') {
        text = 'Renew';
      } else if (this.tab === 'attach') {
        text = 'Attach';
      }
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

  // get Opportunity Account dropdown data
  getOpportunityAccount() {
    this.oppAccountData = this.createPipelineService.getOpportunityAccounts();
  }

  // After selecting account setting respective Owner values and flags
  onAccountChange($event) {
    if ($event.opptyOwnerList !== undefined) {
      this.oppOwnerList = [];
      this.oppOwnerList = $event.opptyOwnerList;
      for (let i = 0; i < this.oppOwnerList.length; i++) {
        this.oppOwnerList[i].name = this.oppOwnerList[i].firstName + ' ' + this.oppOwnerList[i].lastName;
        if (this.oppOwnerList[i].accountOwnerFlag === 'Y') {
          this.oppOwnerList[i].isAccountOwner = true;
          this.accountOwnerName = this.oppOwnerList[i].firstName + ' ' + this.oppOwnerList[i].lastName;
          this.createPipelineService.accountOwnerName = this.accountOwnerName;
        } else {
          this.oppOwnerList[i].isAccountOwner = false;
        }
      }
    }
    this.createPipelineService.setAccountName($event.accountName);
    this.createPipelineService.validAccountSelected = false;
  }

  getOpportunityOptions() {
    this.createPipelineService.getOpportunityOptions()
      .subscribe((data: any) => {
        this.opportunityOptions = data;
      });
  }

  getForecastStatusOptions() {
    this.createPipelineService.getForecastStatusOptions()
      .subscribe((data: any) => {
        this.forecastStatusOptions = data;
      });
  }

  onAccountSelect() {
    setTimeout(function (t) {
      t.createPipelineService.validAccountSelected = true;
    }, 0, this);
  }

  showOppOwnerList() {
    this.showOwnerList = !this.showOwnerList;
  }

  // Setting Opportunity Owner
  selectedOppOwner(a) {
    if (this.loggedInUsername === a.cecId) {
      this.enableOppStage = true;
      this.createPipelineService.opportunity = [];
      this.isSelectedStage = false;
    } else {
      this.enableOppStage = false;
      this.createPipelineService.opportunity = ['Prospect'];
      this.createPipelineService.validOpportunitySelected = true;
      this.isSelectedStage = false;
    }
    this.createPipelineService.oppOwner = a;
  }

  // Setting description and new name of opportunity
  setDescription() {
    this.createPipelineService.description = this.description;
    this.createPipelineService.setOpportunityName(this.opportunityName);
  }

  // Setting opportunity Stage
  opportunityChange() {
    this.createPipelineService.opportunity[0] ? this.createPipelineService.validOpportunitySelected = true : this.createPipelineService.validOpportunitySelected = false;
    if (this.createPipelineService.opportunity[0] === 'Qualification') {
      this.isSelectedStage = true;
      this.createPipelineService.isForecastSelected = false;
      this.createPipelineService.forecastStatusList = this.createPipelineService.forecastStatusList;
      if (!this.createPipelineService.forecastStatusList) {
        this.createPipelineService.forecastStatusList = [];
      }
    } else {
      this.isSelectedStage = false;
      this.createPipelineService.isForecastSelected = true;
      this.createPipelineService.forecastStatusList = [];
    }
    this.createPipelineService.selectedStage = this.createPipelineService.opportunity[0];
  }

  forecastChange() {
    this.createPipelineService.forecastStatusList[0] ? this.createPipelineService.isForecastSelected = true : this.createPipelineService.isForecastSelected = false;
  }

  search = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    merge(this.focus$),
    map(term => (term === '' ? this.createPipelineService.getOpportunityAccounts()
    : this.createPipelineService.getOpportunityAccounts().filter(v => v.accountName.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
  ))

  formatter = (x: { accountName: string }) => x.accountName;

}
