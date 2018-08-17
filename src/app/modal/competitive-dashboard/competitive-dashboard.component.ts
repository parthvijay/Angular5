import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-competitive-dashboard',
  templateUrl: './competitive-dashboard.component.html',
  styleUrls: ['./competitive-dashboard.component.css']
})
export class CompetitiveDashboardComponent implements OnInit {
  @Input() redirectLink;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal) { }

  ngOnInit() {
    console.log(this.redirectLink);
  }

  redirectPage() {
    this.activeModal.close();
    const win = window.open(this.redirectLink, '_blank');
    win.focus();
  }

}
