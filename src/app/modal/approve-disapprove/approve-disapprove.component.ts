import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApproveDisapproveService } from './approve-disapprove.service';
import { UtilitiesService } from './../../shared/services/utilities.service';
import { LoaderService } from '../../shared/loader/loader.service';
import { LookupService } from '../../modal/lookup/lookup.service';
import { FiltersService } from '../../filters/filters.service';

@Component({
  selector: 'app-approve-disapprove',
  templateUrl: './approve-disapprove.component.html',
  styleUrls: ['./approve-disapprove.component.css']
})

export class ApproveDisapproveComponent implements OnInit {

  @Input() stage;
  @Input() currentRow;
 // @Input() qualName;
  closeResult: String;
  isPendingModal: boolean;
  message: any;
  messageDis: any;
  approvalDone = false;
  qualName: any;
  error: any;
  qHashId: string;
  cName: string;
  summary = {
    'qualStatus': '',
    'qualLines': 0,
    'qualAmount': 0,
    'disqualStatus': '',
    'disqualLines': 0,
    'disqualAmount': 0.0
  };
  qSummary: any;

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private approvedisapproveService: ApproveDisapproveService,
    private utilityService: UtilitiesService,
    private lookupService: LookupService,
    private filtersService: FiltersService,
    private loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.loaderService.show();
    const payload = {
      'qualHashId': this.qSummary.qualHashId,
      'customerName': this.qSummary.customerName,
      'queryType': this.qSummary.queryType,
      'qualLines': this.qSummary.qualLines,
      'globalCustomerView': this.utilityService.getGlobalCustomerView() ? this.utilityService.getGlobalCustomerView() : 'N',
      'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
      'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
      'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
      'hasInstanceId': this.lookupService.hasColumn('instanceId'),
      'hasProduct': this.lookupService.hasColumn('productID'),
      'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
      'hasContractNo': this.lookupService.hasColumn('contractNumber'),
      'filters' : this.filtersService.getQualFilterstoRest()
    };

    this.approvedisapproveService.getAMSummary(payload)
      .subscribe(data => {
        this.loaderService.hide();
        this.summary = data.summary;
      },
      error => this.error = error
      );
  }

  isFormValid() {
    if (this.messageDis) {
      return true;
    }
    return false;
  }

  commitApprove() {
    this.qualName = this.utilityService.getQualification();
    this.approvalDone = true;
  }

  closeApprove() {
    this.activeModal.close({
      qualification: 'approve',
      amDecision: 'Approved'
    });
  }

  closeDisapprove() {
    if (!this.isFormValid()) {
      return;
    }
    if (this.messageDis.length) {
      this.activeModal.close({
        qualification: 'disapprove',
        message: this.messageDis,
        amDecision: 'Disapproved',
        currentRowId: this.currentRow.id
      });
    }
  }

  // get quick summary list
  // getQuickSummaryList() {
  //   this.approvedisapproveService.getQuickSummaryList()
  //     .subscribe(data => {
  //       this.quickSummaryData = data;
  //     });
  // }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
