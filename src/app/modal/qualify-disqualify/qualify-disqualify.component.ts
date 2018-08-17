import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { QualifyDisqualifyService } from './qualify-disqualify.service';

@Component({
  selector: 'app-qualify-disqualify',
  templateUrl: './qualify-disqualify.component.html',
  styleUrls: ['./qualify-disqualify.component.css']
})
export class QualifyDisqualifyComponent implements OnInit {

  @Input() stage;
  @Input() currentRow;
  closeResult: String;
  selectedReasonCode: any[];
  selectedSubReasonCode: any[];
  selectedReasonCodeDis: any[];
  dealId: any;
  dealIdDis: any[] = ['264318'];
  isPendingModal: boolean;
  soNumber: any;
  message: any;
  messageDis: any;
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  selectId = 'SO Number';
  enableQualify = false;
  qualDealId: string;

  selectedReasonCodeOptions: IMultiSelectOption[];
  disqualifySubReasonCodeOptions: IMultiSelectOption[];
  selectedReasonCodeDisOptions: IMultiSelectOption[];
  // dealIdOptions: IMultiSelectOption[];
  // dealIdDisOptions: IMultiSelectOption[];
  qualifyDealId = false;
  defaultDealIds = ['121932', '221312', '357354', '423213'];
  modalTitle: any;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal,
    private qualifyDisqualifyService: QualifyDisqualifyService) { }

  ngOnInit() {
    this.isPendingModal = this.currentRow.id !== '-1';
    if (this.isPendingModal) {
      if (this.stage === 'pending') {
        this.modalTitle = 'Qualify / Disqualify Asset(s)';
        this.stage = 'qualify';
      } else if (this.stage === 'qualify' || this.stage === 'Qualified') {
        this.selectedReasonCode = [this.currentRow.data.reasonCode];
        this.dealId = [this.currentRow.data.dealId];
        this.message = this.currentRow.data.message;
      } else if (this.stage === 'disqualify' || this.stage === 'Disqualified') {
        this.selectedReasonCodeDis = [this.currentRow.data.reasonCode];
        this.selectedSubReasonCode = [this.currentRow.data.subReasonCode];
        this.soNumber = this.currentRow.data.soNumber;
        this.dealIdDis = [this.currentRow.data.dealId];
        this.messageDis = this.currentRow.data.message;
      }
    }
    if (this.stage === 'qualify' || this.stage === 'Qualified') {
      this.modalTitle = 'Qualify Asset(s)';
    } else {
      this.modalTitle = 'Disqualify Asset(s)';
    }

    this.getQualifyReasonCodes();
    this.getDisqualifyReasonCodes();
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true
    };
    this.myTexts = {
      defaultTitle: ''
    };
  }

  closeQualify() {
    if (!this.isQualifyFormValid()) {
      return;
    }
    this.activeModal.close({
      qualification: 'qualify',
      selectedReasonCode: this.selectedReasonCode[0],
      qualReasonAttribute: 'Deal ID',
      qualReasonAttributeValue: this.qualDealId,
      message: this.message,
      currentRowId: this.currentRow.id
    });
  }

  isQualifyFormValid() {
    if (this.selectedReasonCode && this.selectedReasonCode.length && (this.qualDealId && this.selectedReasonCode.indexOf('Existing Active Opportunity in Sales Force') > -1 || this.selectedReasonCode.indexOf('Ready to Convert to Pipeline (Manual)') > -1)) {
      return true;
    }
    return false;
  }

  closeDisqualify() {
    if (!this.isFormValid()) {
      return;
    }
    this.activeModal.close({
      qualification: 'disqualify',
      selectedReasonCode: this.selectedReasonCodeDis[0],
      selectedSubReasonCode: this.selectedSubReasonCode[0],
      qualReasonAttribute: this.getReasonReference(),
      qualReasonAttributeValue: this.getAttributeValue(),
      message: this.getDisqualifiedDescription(),
      currentRowId: this.currentRow.id
    });
  }

  getReasonReference() {
    if (this.selectedSubReasonCode.indexOf('Product RMA\'ed') > -1) {
      return 'Serial Number';
    } else if (this.selectedSubReasonCode.indexOf('Device is lost to Competitor') > -1) {
      return 'Competitor\'s Name';
    } else {
      return this.selectId;
    }
  }

  getAttributeValue() {
    if (this.selectedSubReasonCode.indexOf('Product RMA\'ed') > -1 || this.selectedSubReasonCode.indexOf('Device is lost to Competitor') > -1) {
      return this.messageDis;
    } else {
      return this.soNumber;
    }
  }

  getDisqualifiedDescription() {
    if (this.selectedSubReasonCode.indexOf('Product RMA\'ed') > -1 || this.selectedSubReasonCode.indexOf('Device is lost to Competitor') > -1) {
      return '';
    } else {
      return this.messageDis;
    }
  }

  // search objects in array
  searchArrayObject(nameKey, myArray) {
    for (let i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  // get qualify reason codes list
  getQualifyReasonCodes() {
    this.qualifyDisqualifyService.getQualifyReasonCodes()
      .subscribe(data => {
        this.selectedReasonCodeOptions = data;
      });
  }

  // get disqualify reason codes list
  getDisqualifyReasonCodes() {
    this.qualifyDisqualifyService.getDisqualifyReasonCodes()
      .subscribe(data => {
        this.selectedReasonCodeDisOptions = data;
      });
  }

  // qualify reason code value changed
  qualReasonCodeChange(r) {
    if (r.length > 0) {
      const qualifyList = this.selectedReasonCodeOptions;
      const qualReasonObj = this.searchArrayObject(r[0], qualifyList);
    }
  }

  // DE160977
  showDealID() {
    if (this.selectedReasonCode && this.selectedReasonCode.length && (this.selectedReasonCode.indexOf('Existing Active Opportunity in Sales Force') > -1)) {
      return true;
    }
    return false;
  }

  // disqualify code value changed
  disqualCodeChange(r, codeType) {
    this.selectedSubReasonCode = [];
    if (r.length > 0) {
      const disqualifyList = this.selectedReasonCodeDisOptions;
      const disqualReasonObj = this.searchArrayObject(r[0], disqualifyList);
      this.disqualifySubReasonCodeOptions = disqualReasonObj.subReasonCode;
    }
  }

  disqualSubCodeChange(r, codeType) {

  }

  showDisqualifySubReason() {
    if (this.selectedReasonCodeDis && this.selectedReasonCodeDis.length) {
      return true;
    }
    return false;
  }

  showNote() {
    if (this.selectedSubReasonCode && this.selectedSubReasonCode.length && (this.selectedSubReasonCode.indexOf('Device is lost to Competitor') > -1 || this.selectedSubReasonCode.indexOf('Product RMA\'ed') > -1)) {
      return true;
    }
    return false;
  }

  showSONumber() {
    if (this.selectedSubReasonCode && this.selectedSubReasonCode.length && (this.selectedSubReasonCode.indexOf('Refreshed') > -1 || this.selectedSubReasonCode.indexOf('Migrated to SWSS') > -1 || this.selectedSubReasonCode.indexOf('Already Renewed under a different Service') > -1)) {
      return true;
    }
    return false;
  }

  showEnterId() {
    if (this.selectedSubReasonCode && this.selectedSubReasonCode.length && (this.selectedSubReasonCode.indexOf('Migrated to SWSS') > -1 || this.selectedSubReasonCode.indexOf('Refreshed') > -1 || this.selectedSubReasonCode.indexOf('Already Renewed under a different Service') > -1 || this.selectedSubReasonCode.indexOf('Duplicate: Different Instance') > -1 || this.selectedSubReasonCode.indexOf('Duplicate: Customer upgraded to another version') > -1 || this.selectedSubReasonCode.indexOf('Duplicate: Data Error') > -1)) {
      return true;
    }
    return false;
  }

  isFormValid() {
    if ((this.showNote() && this.messageDis) || (this.showSONumber() && this.soNumber) || (this.showEnterId() && this.soNumber) || (this.selectedSubReasonCode && this.selectedSubReasonCode.length && this.selectedSubReasonCode.indexOf('Downsizing') > -1)) {
      return true;
    }
    return false;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200)
      .distinctUntilChanged()
      .map(term => term === '' ? []
        : this.defaultDealIds.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
}
