import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rename-qualification',
  templateUrl: './rename-qualification.component.html',
  styleUrls: ['./rename-qualification.component.css']
})
export class RenameQualificationComponent implements OnInit {

  renameQual: any;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal) { }

  ngOnInit() {
  }

  // rename qualification
  renameQualification() {
    if (this.renameQual) {
      this.activeModal.close({
        renamedQualification: this.renameQual
      });
    }
  }

}
