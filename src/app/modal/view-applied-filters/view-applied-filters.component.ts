import { FiltersService } from './../../filters/filters.service';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-view-applied-filters',
  templateUrl: './view-applied-filters.component.html',
  styleUrls: ['./view-applied-filters.component.css']
})
export class ViewAppliedFiltersComponent implements OnInit {

  appliedFilters: any[];
  @Input() filters;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, public filtersService: FiltersService) { }

  ngOnInit() {
    if (typeof this.filters === 'undefined') {
      this.appliedFilters = this.filtersService.getAppliedFilters();
    } else {
      this.appliedFilters = this.filters;
    }
  }

  closeModal() {
    this.activeModal.close({
    });
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
