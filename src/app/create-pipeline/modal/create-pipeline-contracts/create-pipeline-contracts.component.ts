import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { LoaderService } from '../../../shared/loader/loader.service';
import { UtilitiesService } from './../../../shared/services/utilities.service';
import { CreatePipelineDetailsService } from '../../create-pipeline-details/create-pipeline-details.service';

@Component({
  selector: 'app-create-pipeline-contracts',
  templateUrl: './create-pipeline-contracts.component.html',
  styleUrls: ['./create-pipeline-contracts.component.css']
})
export class CreatePipelineContractsComponent implements OnInit {
  guName: string;
  contracts = [];
  qualDetails: any;

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private http: Http,
    private utilitiesService: UtilitiesService,
    public loaderService: LoaderService,
    public createPipelineDetailsService: CreatePipelineDetailsService,
  ) { }

  ngOnInit() {
    this.qualDetails = this.utilitiesService.getPipelineDetails();
    this.getContracts();
  }

  getContracts() {
    const payload = {
      'qualId' : this.qualDetails.qualficationId,
      'globalCustomerView' : this.utilitiesService.getGlobalCustomerView(),
      'customerName' : this.utilitiesService.getCustomerName(),
      'guid' : this.guName === '99999' ? null : this.guName
    };
    this.createPipelineDetailsService.getContracts(payload)
    .subscribe(res => {
      this.loaderService.hide();
      this.contracts = res.data;
    }, error => {
      this.loaderService.hide();
    });
  }

}
