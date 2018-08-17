import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { ApproveDisapproveComponent } from '../approve-disapprove/approve-disapprove.component';

@Component({
  selector: 'app-confirm-disapproval',
  templateUrl: './confirm-disapproval.component.html',
  styleUrls: ['./confirm-disapproval.component.css']
})
export class ConfirmDisapprovalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal) { }

  ngOnInit() {
  }

  disapprove(stage) {
    this.activeModal.close({
      qualification: 'disapprove'
    });
  }

}
