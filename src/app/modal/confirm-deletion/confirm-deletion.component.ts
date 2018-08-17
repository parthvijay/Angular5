import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config';

@Component({
  selector: 'app-confirm-deletion',
  templateUrl: './confirm-deletion.component.html',
  styleUrls: ['./confirm-deletion.component.css']
})
export class ConfirmDeletionComponent implements OnInit {

  deleteTemp: any;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, @Inject(APP_CONFIG) public config: AppConfig) { }

  ngOnInit() {
  }

  // delete template
  confirmDeletion() {
    this.activeModal.close({
      views: this.deleteTemp
    });
  }
}
