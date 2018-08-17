import { Injectable, Inject  } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { concat } from 'rxjs/operator/concat';
import { RestApiService } from '../shared/services/restAPI.service';
import { UtilitiesService } from './../shared/services/utilities.service';
import 'rxjs/add/operator/map';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';

@Injectable()
export class FiltersService {

  defaultFilters: any = [
    {
      'title': 'Status',
      'type': 'status',
      'active': false,
      'categories': [
        {
          'title': 'Covered',
          'selected': 'All'
        },
        {
          'title': 'Network Collection',
          'selected': 'All'
        }
      ],
      'options': [
        'All',
        'Yes',
        'No'
      ]
    },
    {
      'title': 'Contract',
      'slug': 'contract',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'levels_name': [
        'Contract Type',
        'Contract Number',
        'Service SO'
      ],
      'rest_param': [
        'contractType',
        'contractNo',
        'servicePO'
      ],
      'searchStr': '',
      'API_call': [false, false, false],
      'searchable': [true, true, true],
      'restSearchFlag' : [true, true, true],
      'disabled': [],
      'selected': [],
      'levels': [],
      'excluded': []
    },
    {
      'title': 'Product',
      'slug': 'product',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'levels_name': [
        'Architecture',
        'Sub-Architecture',
        'Product Family',
        'Product ID',
        'Product Type',
        'Product SO'
      ],
      'rest_param': [
        'architecture',
        'subArch',
        'productFamily',
        'productId',
        'productType',
        'productPO'

      ],
      'API_call': [false, false, false, false, false, false],
      'searchable': [false, false, true, true, false, true],
      'restSearchFlag' :  [false, false, true, true, false, true],
      'searchStr': '',
      'disabled': [],
      'selected': [],
      'isParent': [false, true, true, true, false, false],
      'levels': [],
      'excluded': []
    },
    {
      'title': 'Install Site',
      'slug': 'installSite',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'levels_name': [
        'Customer Registry GU Name',
        'Customer Registry Party Name',
        'Customer Registry Party ID',
        'Install Site Name',
        'Install Site ID',
        'Install Site Address 1',
        'Install Site City',
        'Install Site State',
        'Install Site Country'
      ],
      'API_call': [false, false, false, false, false, false, false, false, false],
      'searchable': [true, true, true, true, true, true, true, true, true],
      'restSearchFlag' :  [true, true, true, true, true, true, true, true, true],
      'searchStr': '',
      'search_api': [],
      'disabled': [],
      'selected': [],
      'levels': [],
      'rest_param': [
        'guName',
        'partyName',
        'partyId',
        'name',
        'id',
        'address',
        'city',
        'state',
        'country'
      ],
      'excluded': []
    },
    {
      'title': 'Partner',
      'slug': 'partner',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'levels_name': [
        'Product Bill-to Partner Name',
        'Service Bill-to Partner Name'
      ],
      'API_call': [false, false],
      'rest_param': [
        'productBillTo',
        'serviceBillTo'
      ],
      'searchable': [true, true],
      'restSearchFlag' :  [true, true],
      'searchStr': '',
      'disabled': [],
      'selected': [],
      'levels': [],
      'excluded': []
    },
    {
      'title': 'Qualification/Disqualification',
      'slug': 'qualification',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'API_call': [true, false, false],
      'levels_name': [
        'Qualification Status',
        'Reason Codes',
        'Sub Reason Codes'
      ],
      'rest_param': [
        'qualStatus',
        'qualReason',
        'qualSubReason'
      ],
      'searchable': [false, false, false],
      'restSearchFlag' :  [false, false, false],
      'searchStr': '',
      'disabled': [],
      'selected': [],
      'levels': [
        [
          {
            'id': 'Pending',
            'name': 'Pending'
          },
          {
            'id': 'Qualified',
            'name': 'Qualified'
          },
          {
            'id': 'Disqualified',
            'name': 'Disqualified'
          }
        ],
      ],
      'excluded': []
    },
    {
      'title': 'Year',
      'slug': 'year',
      'active': false,
      'progressive': false,
      'type': 'dropdown',
      'levels_name': [
        'Covered Line End Date FY-FQ',
        'LDOS FY',
        'Shipped FY'
      ],
      'rest_param': [
        'coveredLineDate',
        'ldosYear',
        'shippedYear'
      ],
      'API_call': [false, false, false],
      'searchable': [true, true, true],
      'restSearchFlag' : [false, false, false],
      'searchStr': '',
      'disabled': [],
      'selected': [],
      'levels': [],
      'excluded': []
    },
    {
      'title': 'Dataset',
      'slug': 'dataset',
      'active': false,
      'progressive': false,
      'type': 'dataset',
      'categories': [
        {
          'title': 'Covered IB Shipment FY Range',
          'default_value': [1997, 2018],
          'selected_value': [1997, 2018],
          'error': false
        },
        {
          'title': 'Uncovered IB Shipment FY Range',
          'default_value': [2012, 2018],
          'selected_value': [2012, 2018],
          'error': false
        }
      ],
      'searchable': [false, false],
      'disabled': [],
      'selected': [],
      'levels': [],
      'excluded': []
    }
  ];

  filters: any[];
  appliedFilters: any[];
  showFilters = false;
  qualFilters: Object = {};
  filtersUnsaved = false;
  dataset: Object = {};

  constructor(private http: Http,
    private apiDispatcherServ: ApiDispacherService,
    private restApi: RestApiService,
    private utilitiesService: UtilitiesService
  ) {
    this.filters = JSON.parse(JSON.stringify(this.defaultFilters));
    this.appliedFilters = JSON.parse(JSON.stringify(this.defaultFilters));
    this.qualFilters = {};
    this.dataset = {};
  }


  getDefaultFilters() {
    return this.defaultFilters;
  }

  getFilters() {
    return this.filters;
  }

  getAppliedFilters() {
    return this.appliedFilters;
  }

  // To set default values for dataset
  getDefaultAppliedFilters(qualFilters, dataset) {
    this.defaultFilters.forEach(function (a) {
      if (a.type === 'dataset') {
        a.categories.forEach(function (b) {
        if (b.title === 'Covered IB Shipment FY Range') {
          if (dataset['coveredStartDate'] === undefined) {
            dataset['coveredStartDate'] = b.default_value[0];
          }
          if (dataset['coveredEndDate'] === undefined) {
            dataset['coveredEndDate'] = b.default_value[1];
          }
        } else if (b.title === 'Uncovered IB Shipment FY Range') {
          if (dataset['uncoveredStartDate'] === undefined) {
            dataset['uncoveredStartDate'] = b.default_value[0];
          }

          if (dataset['uncoveredEndDate'] === undefined) {
            dataset['uncoveredEndDate'] = b.default_value[1];
          }
        }
        });
        qualFilters['dataset'] = JSON.stringify(dataset);
      }
    });
  }

  getFilterJson() {
    const filterJson = [];
    filterJson.push(this.qualFilters);
    filterJson.push(this.getFilters());
    return filterJson;
  }

  applyFilters(filters) {
    filters.forEach(function (a) {
      if (a.type === 'dataset') {
        a.categories.forEach(function (b) {
          if (!((b.selected_value[0] !== b.default_value[0] || b.selected_value[1] !== b.default_value[1]) && b.selected_value[1] >= b.selected_value[0] && b.selected_value[0] > 0 && b.selected_value[1] > 0)) {
            b.selected_value[0] = b.default_value[0];
            b.selected_value[1] = b.default_value[1];
          }
        });
      }
    });

    this.appliedFilters = JSON.parse(JSON.stringify(filters));
    // this.filtersUnsaved = true;
  }

  getQualFilterstoRest() {
    if (Object.keys(this.qualFilters).length === 0 && this.qualFilters.constructor === Object) {
      this.getDefaultAppliedFilters(this.qualFilters, this.dataset);
    }
    if (this.qualFilters['dataset'].coveredEndDate !== undefined) {
      this.qualFilters['dataset'] = JSON.stringify(this.qualFilters['dataset']);
    }
    return this.qualFilters;
  }

  getFiltersData(selectedFilter, index) {
    const payload = this.getFilterParams(selectedFilter, index);
    return this.apiDispatcherServ.doFilterApiCall(this.restApi.getApiPath(selectedFilter.slug) + '/' + payload.filterType, 'POST', payload);
  }

  getFilterParams(selectedFilter, index) {
    const payload = {
      'customerName': this.utilitiesService.getCustomerName(),
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView(),
      'filterType': '',
      'searchStr': null
    };
    if (selectedFilter.slug === 'year' || selectedFilter.slug === 'contract' || selectedFilter.slug === 'qualification' ||  selectedFilter.slug === 'product' || selectedFilter.slug === 'installSite') {
          payload.filterType = selectedFilter.rest_param[index];
          payload.searchStr = selectedFilter.searchStr;
          for (let i = 1 ; i <= index; i++ ) {
            const setFilterParam = selectedFilter.rest_param[index - i];
            if (selectedFilter.selected[index - i]) {
              if (setFilterParam && !selectedFilter.selected[index - i].isEmpty) {
                payload[setFilterParam] = [];
                payload[setFilterParam] = JSON.stringify(selectedFilter.selected[index - i]);
              }
            }
          }
        } else if (selectedFilter.slug === 'partner') {
          payload.filterType = selectedFilter.rest_param[index];
          payload.searchStr = selectedFilter.searchStr;
        }
    return payload;

  }

  getFiltersState() {
    return this.showFilters;
  }

  toggleFiltersState(value) {
    const newVal = value === '' ? !this.showFilters : value;
    this.showFilters = newVal;
  }

  getFiltersCount(f) {
    const filters = f ? f : this.appliedFilters;
    let count = 0;
    filters.forEach(function (a) {
      if (a.type === 'status') {
        a.categories.forEach(function (b) {
          if (b.selected !== 'All') {
            count += 1;
          }
        });
      } else if (a.type === 'dropdown') {
        a.selected.forEach(function (b) {
          if (b && b.length) {
            count += 1;
          }
        });
      } else if (a.type === 'slider') {
        a.categories.forEach(function (b) {
          if (b.selected && b.selected.length) {
            count += 1;
          }
        });
      } else if (a.type === 'dataset') {
        a.categories.forEach(function (b) {
          if (b.selected_value !== undefined && b.selected_value.length === 2 && b.default_value !== undefined && b.default_value.length === 2) {
            if ((b.selected_value[0] !== b.default_value[0] || b.selected_value[1] !== b.default_value[1]) && b.selected_value[1] >= b.selected_value[0] && b.selected_value[0] > 0 && b.selected_value[1] > 0) {
              count += 1;
            }
          }
        });
      }
    });
    return count;
  }
}
