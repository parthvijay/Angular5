import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-line-count',
  templateUrl: './line-count.component.html',
  styleUrls: ['./line-count.component.css']
})
export class LineCountComponent implements OnInit {

  @Input() customerID;

  constructor(public activeModal: NgbActiveModal, public modalVar: NgbModal, public router: Router) { }

  ngOnInit() {
  }

  allTab() {
    this.router.navigate(['/line-level/' + this.customerID]);
    this.activeModal.close();
  }

}
