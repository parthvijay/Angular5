import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-request-access',
  templateUrl: './request-access.component.html',
  styleUrls: ['./request-access.component.css']
})
export class RequestAccessComponent implements OnInit {
  justificationText: string;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal) { }

  ngOnInit() {
  }

  isRequestFormValid() {
    if (this.justificationText) {
      return true;
    }
    return false;
  }

  closeRequestAccess() {
    if (!this.isRequestFormValid()) {
      return;
    }
    this.activeModal.close({
      requestAccessStatus: 'requested',
      text: this.justificationText
    });
  }

}
