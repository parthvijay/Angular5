import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config';

@Component({
  selector: 'app-delete-qualification',
  templateUrl: './delete-qualification.component.html',
  styleUrls: ['./delete-qualification.component.css']
})
export class DeleteQualificationComponent implements OnInit {

  deleteQual: any;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, @Inject(APP_CONFIG) public config: AppConfig) { }

  ngOnInit() {
  }

  // delete qualification
  deleteQualification() {
    this.activeModal.close(this.deleteQual);
  }

}
