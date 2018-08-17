import { ViewAppliedFiltersComponent } from './../../modal/view-applied-filters/view-applied-filters.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FiltersService } from './../filters.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filters-actions',
  templateUrl: './filters-actions.component.html',
  styleUrls: ['./filters-actions.component.css']
})
export class FiltersActionsComponent implements OnInit {

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false,
    windowClass: 'applied-filters-modal'
  };

  constructor(public filtersService: FiltersService, private modalVar: NgbModal, ) { }

  ngOnInit() {
  }

  openViewAppliedFiltersModal() {
    const modalRef = this.modalVar.open(ViewAppliedFiltersComponent, this.ngbModalOptions);
  }

}
