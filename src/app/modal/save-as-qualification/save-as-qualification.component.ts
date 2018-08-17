import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

import { LineLevelService } from '../../line-level/line-level.service';

@Component({
  selector: 'app-save-as-qualification',
  templateUrl: './save-as-qualification.component.html',
  styleUrls: ['./save-as-qualification.component.css']
})
export class SaveAsQualificationComponent implements OnInit {

  lineLevelTabsList: any;
  newQualificationName: any;
  qualSelected = '';
  saveCreate = 'Create';
  selectedQ: any;

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private route: ActivatedRoute,
    public linelevelService: LineLevelService) { }

  ngOnInit() {
    // console.log(this.lineLevelTabsList);
  }

  // select qualification
  selectQualification(q) {
    this.qualSelected = q.qualificationName;
    this.selectedQ = q;
    this.newQualificationName = '';
    this.saveCreate = 'Update';
  }

  // close Save as Qualification modal
  closeSaveAs() {
    if (this.newQualificationName) {
      this.activeModal.close({
        qualification: 'create',
        newQualificationName: this.newQualificationName,
        customerId: ''
      });
    } else if (this.qualSelected) {
      this.activeModal.close({
        qualification: 'update',
        newQualificationName: this.qualSelected,
        qObj: this.selectedQ,
        customerId: ''
      });
    }
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

}
