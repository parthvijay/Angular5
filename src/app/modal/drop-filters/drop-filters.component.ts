import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FiltersService } from '../../filters/filters.service';

@Component({
  selector: 'app-drop-filters',
  templateUrl: './drop-filters.component.html',
  styleUrls: ['./drop-filters.component.css']
})
export class DropFiltersComponent implements OnInit {

  defaultFilters: any[];
  filters: any[];
  selectedFilters: number;

  constructor(public activeModal: NgbActiveModal, public filtersService: FiltersService) { }

  ngOnInit() {
  }

  removeFilters() {
    this.filtersService.filters = JSON.parse(JSON.stringify(this.filtersService.defaultFilters));
    this.filtersService.applyFilters(this.filtersService.filters);
    this.filtersService.filtersUnsaved = false;
    this.filtersService.qualFilters = {};
    this.activeModal.close({
      isCancel: 'Ok'
    });
  }

  cancelRemoveFilters() {
    this.activeModal.close({
      isCancel: 'Cancel'
    });
  }
}
