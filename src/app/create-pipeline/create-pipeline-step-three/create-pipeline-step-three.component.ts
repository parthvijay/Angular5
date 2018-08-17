import { Component, OnInit } from '@angular/core';
import { CreatePipelineService } from '../create-pipeline.service';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-create-pipeline-step-three',
  templateUrl: './create-pipeline-step-three.component.html',
  styleUrls: ['./create-pipeline-step-three.component.css']
})
export class CreatePipelineStepThreeComponent implements OnInit {
  objectKeys = Object.keys;
  tab: string;
  subTab: string;
  refId: string;
  stepTwoUrl: string;
  backUrlText: string;
  backUrl: string;
  createPipelineUrl: string;
  showErrorMsg = false;
  errorMsg: string;
  isValid = true;

  constructor(
    public createPipelineService: CreatePipelineService,
    public utilitiesService: UtilitiesService,
    public loaderService: LoaderService,
    private routerObj: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.tab = params['tab'];
      this.subTab = params['subTab'];
      this.refId = params['refId'];
    });
    this.createPipelineUrl = '/opportunities/createPipeline/';
    this.stepTwoUrl = '/create-pipeline/two/' + this.tab + '/' + this.subTab + '/' + this.refId;
    this.backUrlAndText();
  }

  // setting back url on the basis of Tab
  backUrlAndText() {
    if (this.tab === 'qualification') {
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

  isValidForm() {
    return this.isValid;
  }

  createPipeline() {
    this.isValid = !this.isValid;
    if (this.isValid) {
      return;
    }
    if (this.tab === 'qualification') {
      this.createPipelineUrl += 'qualification';
    } else {
      this.createPipelineUrl = '/opportunities/createPipeline/' + this.subTab + this.tab;
    }
    this.createPipelineService.createPipeline(this.createPipelineUrl, this.tab)
    .subscribe(res => {
      this.loaderService.hide();
      if (res.errorCode === 'ERR-598' || res.errorCode === 'ERR-597' || res.errorCode === 'ERR-596' || res.errorCode === 'ERR-595' || res.errorCode === 'ERR-400') {
        this.showErrorMsg = true;
        this.errorMsg = 'Error in Creating Opportunity!! Please try again.';
      } else {
        window.localStorage.removeItem('totalVal');
        this.createPipelineService.successObj = res;
        this.createPipelineService.clearAllStepValues();
        const successUrl = '/create-pipeline/success/' + this.tab + '/' + this.subTab + '/' + this.refId;
        this.routerObj.navigate([successUrl]);
      }
    },
    error => {
      this.loaderService.hide();
      this.showErrorMsg = true;
      this.errorMsg = 'Error in Creating Opportunity!! Please try again.';
    });
  }
}
