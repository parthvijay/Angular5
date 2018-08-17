import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IntermediateSummaryService } from '../../intermediate-summary/intermediate-summary.service';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-notify-to-am',
  templateUrl: './notify-to-am.component.html',
  styleUrls: ['./notify-to-am.component.css']
})
export class NotifyToAmComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private http: Http,
    public intermediateSummaryService: IntermediateSummaryService,
    public loaderService: LoaderService
  ) { }

  amList = [];
  selectedAm = [];
  selectionLimit = 50;
  qualId: string;
  view: string;

  ngOnInit() {
    this.getAMList();
  }

  // get list of AM
  getAMList() {
    const payload = {
      'qualId': this.qualId,
      'globalCustomerView': this.view
    };
    this.intermediateSummaryService.listAM(payload)
    .subscribe(data => {
      this.loaderService.hide();
      this.amList = data.userDetails;
    });
  }

  selectAM(am, index) {
    if (am.checked) {
      this.selectedAm.push(am);
    } else {
      this.selectedAm = this.selectedAm.filter(function (obj) {
        return obj.email !== am.email;
      });
    }
  }

  isNotifyDisabled() {
    return !this.selectedAm.length || this.selectedAm.length > this.selectionLimit;
  }

  // notifyAM
  notifyAm() {
    this.activeModal.close({
      selectedAm: this.selectedAm
    });
  }

}
