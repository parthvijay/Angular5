import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-undo-qualification',
  templateUrl: './undo-qualification.component.html',
  styleUrls: ['./undo-qualification.component.css']
})
export class UndoQualificationComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal) { }

  ngOnInit() {
  }

  closeUndo() {
    this.activeModal.close();
  }

}
