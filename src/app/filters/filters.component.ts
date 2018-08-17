import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { FiltersService } from './filters.service';
import { FormControl } from '@angular/forms';
import { error } from 'selenium-webdriver';
import { Observable } from 'rxjs/Observable';
import { LineLevelService } from './../line-level/line-level.service';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { UtilitiesService } from './../shared/services/utilities.service';
import { LoaderService } from './../shared/loader/loader.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.css']
})
export class FiltersComponent implements OnInit {
  defaultFilters: any[];
  filters: any[];
  optionsModel: number[];
  myOptions: IMultiSelectOption[];
  mySettings: IMultiSelectSettings;
  mySettings_search: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  selectedFilters: number;
  customerID: any;
  ctName: string;
  category: string;
  typeOfCall: string;
  fromClear: boolean;
  isDatasetValid = true;
  @Output() onFiltersApply = new EventEmitter();

  constructor(private filtersService: FiltersService,
    private lineLevelService: LineLevelService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    public loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.myOptions = [
      { id: 'Option 1', name: 'Option 1' },
      { id: 'Option 2', name: 'Option 2' },
    ];

    this.mySettings = {
      showCheckAll: true,
      showUncheckAll: true,
      ignoreLabels: true
    };

    this.mySettings_search = {
      enableSearch: true,
      showCheckAll: true,
      showUncheckAll: true,
      ignoreLabels: true
    };

    this.myTexts = {
      checkAll: 'Select all',
      uncheckAll: 'Deselect All',
      checked: 'selected',
      checkedPlural: 'selected',
      searchPlaceholder: 'Search...',
      searchEmptyResult: 'No Search Results',
      searchNoRenderText: 'Type in search box to see results...',
      defaultTitle: 'Select',
      allSelected: 'All selected',
    };

    this.defaultFilters = this.filtersService.getDefaultFilters();
    this.filters = this.filtersService.getFilters();
    this.updateSelectedFiltersCount();
    this.utilitiesService.addRemoveFiltersShadow();

    this.route.params.subscribe((params: ParamMap) => {
      this.customerID = params['customerID'];
      this.customerID = decodeURIComponent(this.customerID);
      this.category = params['qualificationID'];
      this.category = (typeof this.category === 'undefined' || this.category === 'All') ? '' : this.category;
      if (this.category === '') {
        this.typeOfCall = 'line-detail';
      } else {
        this.typeOfCall = 'qual-line-details';
      }
    });
  }

  hideFilters() {
    this.filtersService.toggleFiltersState(false);
  }

  onChange(selected, c, index) {
    this.filtersService.qualFilters[c.rest_param[index]] = JSON.stringify(selected);
    // UX code for data set error
    const thisInstance = this;
    thisInstance.isDatasetValid = true;
    if (c.categories !== undefined) {
      c.categories.forEach(element => {
        element.error = false;
        if (element.selected_value[0] > element.selected_value[1]) {
          element.error = true;
          thisInstance.isDatasetValid = false;
        }
      });
    } // end of UX code
    this.updateSelectedFiltersCount();
    if (c.slug === 'contract' || c.slug === 'qualification' || c.slug === 'product' || c.slug === 'installSite') {
      for (let i = index + 1; i <= c.selected.length; i++) {
        c.API_call[i] = false;
      }
      this.removeOnDeselection(c, index);
    }
  }

  onDateChange(n, c) {
    const thisInstance = this;
      c.error = false;
      if (c.selected_value[0] > c.selected_value[1]) {
        c.error = true;
      }
      if (this.filters[7].categories[0].error === true || this.filters[7].categories[1].error === true) {
        this.isDatasetValid = false;
      } else {
        this.isDatasetValid = true;
      }
    this.updateSelectedFiltersCount();
  }

  removeOnDeselection(deselectedFilter, index) {
    for (let i = index; i <= deselectedFilter.selected.length; i++) {
      if ((deselectedFilter.slug === 'contract' || deselectedFilter.slug === 'qualification' || deselectedFilter.slug === 'product' || deselectedFilter.slug === 'installSite') && deselectedFilter.selected[i]) {
        if (deselectedFilter.selected[i].length === 0) {
          if (i === 0) {
            deselectedFilter.selected = [];
            return;
          } else if (i === 1 && deselectedFilter.selected[i].length === 0) {
            deselectedFilter.selected[i + 1] = [];
            return;
          }
        }
      }
    }

  }

  isDropdownVisible(c, i) {
    let show = true;
    if (c.progressive && i > 0 && (!c.selected[i - 1] || !c.selected[i - 1].length)) {
      show = false;
    }
    return show;
  }

  populateSelectedFilter(c, index, selected: String) {
    if (!c.API_call[index]) {
      this.filtersService.getFiltersData(c, index).subscribe((data: any) => {
        this.loaderService.hide();
        c.levels[index] = [];
        c.searchStr = '';
        if (c.slug === 'product') {
          this.populateProductFilters(data, c, index);
        } else {
          for (const value of data.filters) {
            c.levels[index].push({ 'id': value, 'name': value });
          }
        }
      },
      (err => {
        this.loaderService.hide();
      })
    );
      c.API_call[index] = true;
    }
  }

  populateProductFilters(data, c, index) {
    if (data.filters) {
      for (const value of data.filters) {
        c.levels[index].push({ 'id': value, 'name': value });
      }
    } else if (data.qualFilters) {
      let filterValue = [];
      filterValue = Object.entries(data.qualFilters);
      let id = 1;
      for (const filerListValue of filterValue) {
        c.levels[index].push({ 'id': id, 'isLabel': true, name: filerListValue[0] });
        for (const val of filerListValue[1]) {
          c.levels[index].push({ 'id': val, 'parentId': id, name: val });
          id++;
        }
      }
    }
  }

  selectStatus(n, o) {
    let statusFilter;
    if (n.title === 'Covered') {
      statusFilter = 'coverage';
    } else if (n.title === 'Network Collection') {
      statusFilter = 'networkCollection';
    }
    this.filtersService.qualFilters[statusFilter] = o;
    n.selected = o;
    this.updateSelectedFiltersCount();
  }

  // only for dateset filter to set user set values
  setDataset(n, type) {
    let to;
    let from;
    if (n.title === 'Covered IB Shipment FY Range') {
      from = 'coveredStartDate';
      to = 'coveredEndDate';
    } else if (n.title === 'Uncovered IB Shipment FY Range') {
      from = 'uncoveredStartDate';
      to = 'uncoveredEndDate';
    }

    if (n.selected_value[0] <= n.selected_value[1]) {
      if (type === 'to') {
        this.filtersService.dataset[to] = n.selected_value[1];
      }
      if (type === 'from') {
        this.filtersService.dataset[from] = n.selected_value[0];
      }
    } else {
       this.filtersService.dataset[to] = n.default_value[1];
       this.filtersService.dataset[from] = n.default_value[0];
    }

    this.filtersService.qualFilters['dataset'] = this.filtersService.dataset;
    this.updateSelectedFiltersCount();
  }

  updateSelectedFiltersCount() {
    this.selectedFilters = this.filtersService.getFiltersCount(this.filters);
  }

  applyFilters() {
    this.filtersService.applyFilters(this.filters);
    this.onFiltersApply.emit({
      customer: this.category === '' ? this.customerID : this.category,
      callType: this.typeOfCall,
      offSet: 0,
      callQualTab: false
    });
    this.hideFilters();
  }

  clearFilters() {
    this.fromClear = true;
    this.filters = JSON.parse(JSON.stringify(this.defaultFilters));
    this.filtersService.filters = this.filters;
    this.filtersService.qualFilters = {};
    this.filtersService.dataset = {};
    this.updateSelectedFiltersCount();
    this.applyFilters();
    this.filtersService.filtersUnsaved = false;
  }

  sliderOnFinish(e, n) {
    n.selected = [e.from_value, e.to_value];
  }

  myMethod (searchStr, selectedFilter, index) {
    if (selectedFilter.restSearchFlag[index]) {
      selectedFilter.API_call[index] = false;
      selectedFilter.searchStr = searchStr;
      this.populateSelectedFilter(selectedFilter, index, selectedFilter.levels_name[index]);
    }
  }

  resetDataset(categories) {
    this.isDatasetValid = true;
    categories.forEach(element => {
      element.selected_value[0] = element.default_value[0];
      element.selected_value[1] = element.default_value[1];
      element.error = false;
    });
    this.filtersService.dataset = {};
    this.filtersService.qualFilters['dataset'] = {};
    this.updateSelectedFiltersCount();
  }

  disableInput() {
    return false;
  }

}
