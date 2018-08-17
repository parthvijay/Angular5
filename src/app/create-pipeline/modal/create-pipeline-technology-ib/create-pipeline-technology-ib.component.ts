import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CreatePipelineStepTwoService } from '../../create-pipeline-step-two/create-pipeline-step-two.service';
import { LoaderService } from '../../../shared/loader/loader.service';

@Component({
  selector: 'app-create-pipeline-technology-ib',
  templateUrl: './create-pipeline-technology-ib.component.html',
  styleUrls: ['./create-pipeline-technology-ib.component.css']
})
export class CreatePipelineTechnologyIbComponent implements OnInit {
  payload: Object;
  lineItems: any;

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private createPipelineStepTwoService: CreatePipelineStepTwoService,
    public loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.createPipelineStepTwoService.getTechIbData(this.payload)
    .subscribe((res: any) => {
      this.loaderService.hide();
      this.lineItems = res.technologyDetails;
    }, error => {
      this.loaderService.hide();
    });
  }
}
