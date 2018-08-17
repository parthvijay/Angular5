import { Component, OnInit } from '@angular/core';
import { CreatePipelineService } from '../create-pipeline.service';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-create-pipeline-success',
  templateUrl: './create-pipeline-success.component.html',
  styleUrls: ['./create-pipeline-success.component.css']
})
export class CreatePipelineSuccessComponent implements OnInit {
  backURL: string;
  tab: string;
  subTab: string;
  refId: string;
  backUrlText: string;
  backUrl: string;

  constructor(
    public createPipelineService: CreatePipelineService,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    private routerObj: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.tab = params['tab'];
      this.subTab = params['subTab'];
      this.refId = params['refId'];
    });
    this.backUrlAndText();
  }

  // get text for going back
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

  // edit pipeline
  navigateToSFDC(env) {
    if (env === 's') {
      window.open('https://ciscosales--qtr.cs71.my.salesforce.com/', '_blank');
    }
    if (env === 'p') {
      window.open('https://ciscosales.my.salesforce.com/', '_blank');
    }
  }

}
