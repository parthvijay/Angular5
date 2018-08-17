import { LookupService } from './../modal/lookup/lookup.service';
import { CopyLinkService } from './../shared/copy-link/copy-link.service';
import { UnidentifiedDataComponent } from './../modal/lookup/unidentified-data/unidentified-data.component';
import { Component, OnInit, ViewEncapsulation, Input, ViewChild } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import * as moment from 'moment';
import * as $ from 'jquery';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { NgbTypeahead } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';

import { HeaderGroupComponent } from '../shared/ag-grid/header-group-component/header-group.component';
import { DateComponent } from '../shared/ag-grid/date-component/date.component';
import { HeaderComponent } from '../shared/ag-grid/header-component/header.component';
import { LookupComponent } from '../modal/lookup/lookup.component';
import { QualifyDisqualifyComponent } from '../modal/qualify-disqualify/qualify-disqualify.component';
import { SaveAsQualificationComponent } from '../modal/save-as-qualification/save-as-qualification.component';
import { ViewAppliedFiltersComponent } from '../modal/view-applied-filters/view-applied-filters.component';
import { SubHeaderComponent } from '../shared/sub-header/sub-header.component';
import { DeleteQualificationComponent } from '../modal/delete-qualification/delete-qualification.component';
import { RenameQualificationComponent } from '../modal/rename-qualification/rename-qualification.component';
import { ApproveDisapproveComponent } from '../modal/approve-disapprove/approve-disapprove.component';
import { ConfirmDisapprovalComponent } from '../modal/confirm-disapproval/confirm-disapproval.component';
import { RequestReportComponent } from '../modal/request-report/request-report.component';
import { LineCountComponent } from '../modal/line-count/line-count.component';

import { HeaderService } from '../shared/services/header.service';
import { DisqualifyPopupDropdownService } from './disqualify-popup-dropdown.service';
import { LineLevelService } from './line-level.service';
import { FiltersService } from '../filters/filters.service';

import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../app-config';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ManageTemplateService } from '../shared/manage-template/manage-template.service';
import { router } from '../app.router';
import { setTimeout } from 'timers';
import { AgGridService } from '../shared/ag-grid/ag-grid.service';
import { ErrorService } from './../error/error.service';
import { LoaderService } from './../shared/loader/loader.service';
import { UndoQualificationComponent } from '../modal/undo-qualification/undo-qualification.component';
import { DropFiltersComponent } from '../modal/drop-filters/drop-filters.component';
import { RollBackComponent } from '../modal/roll-back/roll-back.component';

@Component({
  selector: 'app-line-level',
  templateUrl: './line-level.component.html',
  styleUrls: ['./line-level.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class LineLevelComponent implements OnInit {

  private gridApi;
  private gridColumnApi;
  private gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  private columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  public HeaderGroupComponent = HeaderGroupComponent;
  selectedGame: Object = {};
  closeResult: string;
  lineLevelData = [];
  getAllSelectedRows: any[];
  rowsData: any[];
  viewdata: string;
  dropdownsize = 50;
  selectedRowsCount = 0;
  selectedRows: any[];
  showToolPanel = false;
  customerID: string;
  qualificationID: string;
  assetType: string;
  assetID: string;
  saveAs = false;
  category: any;
  custId: any;
  qualId: any;
  qualDisqualValues: any[];
  lineLevelTabs: any;
  getQualId: any;
  error: any;
  pageName = 'line-level';
  totalQualification = 0;
  editTab = false;
  openEditList: any;
  customerName = this.utilitiesService.getCustomerName();
  writebackDone = false;
  unmatchedData = this.lookupService.unmatchedData;
  matchedData = [];
  unidentifiedPercent = this.lookupService.unidentifiedPercent;
  matchFilter = '';
  lookupComplete = false;
  columnHeaderList: any[];
  pageUrl = this.routerObj.url;
  viewSummary: any;
  ifAllRowsSelected = false;
  showApproval = false;
  isQualReady = false;
  offSet = 0;
  offSetLimit = 5000;
  showReport = false;
  offSetUpdate = this.offSetLimit;
  activeTemp: string;
  disableLoadMore = true;
  isColUpdated = false;
  hideBothOptions = false;
  disableDownload = false;
  reportAlert = false;
  disableReport = false;
  lookupdata = false;
  userInfo: any;
  userId: string;
  activeQual = false;
  tempQualId: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  isAccountMngr = {
    approveQual: false
  };
  metadata = [
    {
      'title': 'IB Opportunity ($)',
      'value': ''
    },
    {
      'title': 'Total Sites',
      'value': ''
    },
    {
      'title': 'Line Count',
      'value': ''
    },
    {
      'title': 'Network Collection (%)',
      'value': ''
    }
  ];
  is2MErr = false;
  globalType: string;
  assetOffset = 0;
  assetOffsetLimit = 5000;
  private icons;
  showList = false;
  contractList: any[];
  gridHeaderHeight: any;
  contractListItems = ['12345678', '13456789', '14567890', '15678901'];
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  model: any;
  assetSearchItems = [];
  searchText: string;
  isSummaryView = false;
  disableUndo = true;
  getSelectedAsset = [];

  @ViewChild('instance') instance: NgbTypeahead;
  focus$ = new Subject<string>();
  click$ = new Subject<string>();

  constructor(public headerService: HeaderService,
    private disqualifyPopupDropdownService: DisqualifyPopupDropdownService,
    private modalVar: NgbModal,
    public linelevelService: LineLevelService,
    private route: ActivatedRoute,
    private routerObj: Router,
    public filtersService: FiltersService,
    @Inject(APP_CONFIG) public config: AppConfig,
    private utilitiesService: UtilitiesService,
    public copyLinkService: CopyLinkService,
    public lookupService: LookupService,
    public manageTemplateService: ManageTemplateService,
    public agGridService: AgGridService,
    public errorService: ErrorService,
    public loaderService: LoaderService
  ) {
    const thisInstance = this;
    // passed an empty gridOptions in, so as to grab the api out
    this.gridOptions = <GridOptions>{};
    // this.createColumnDefs();
    this.showGrid = true;
    this.gridOptions.dateComponentFramework = DateComponent;
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.suppressRowClickSelection = true;
    this.gridOptions.enableColResize = true;
    this.gridOptions.pagination = true;
    this.gridOptions.paginationPageSize = 50;
    this.gridOptions.debug = false;
    // this.gridOptions.suppressLoadingOverlay = true;
    this.gridOptions.toolPanelSuppressRowGroups = true;
    this.gridOptions.headerHeight = 23;
    // this.gridOptions.enableSorting = true;
    this.gridOptions.sortingOrder = ['asc', 'desc'];
    this.gridOptions.suppressHorizontalScroll = false;
    this.gridOptions.localeText = {
      pivotMode: 'Configure Columns',
      next: '<span>Next <span class="pageRight"></span></span>',
      last: '<span class="icon-right-arrow-extreme"> >> </span>',
      first: '<span class="icon-left-arrow-extreme"> << </span>',
      previous: '<span> <span class="pageLeft"></span> Previous</span>'
    };
    this.gridOptions.suppressDragLeaveHidesColumns = true; // disable column removal after dragging out of table
    this.gridOptions.isExternalFilterPresent = function () {
      return thisInstance.isExternalFilterPresent(thisInstance);
    };
    this.gridOptions.doesExternalFilterPass = function (node) {
      return thisInstance.doesExternalFilterPass(node, thisInstance);
    };
    this.activeTemp = this.utilitiesService.getActiveTemp();
    this.gridOptions.toolPanelSuppressSideButtons = true;
    this.gridOptions.toolPanelSuppressColumnFilter = true;
    this.gridOptions.toolPanelSuppressColumnSelectAll = true;
    this.gridOptions.toolPanelSuppressColumnExpandAll = true;
  }

  @ViewChild('updateTemp') template;
  @ViewChild('getHeader') updateHeader;

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.customerID = params['customerID'];
      if (params['global'] === 'Y') {
        this.utilitiesService.setGlobalCustomerView('Y');
      }
      this.globalType = params['global'];
      this.customerID = decodeURIComponent(this.customerID);
      this.category = params['qualificationID'];
      this.category = (typeof this.category === 'undefined' || this.category === 'All') ? '' : this.category;
      this.assetType = params['assetType'];
      this.assetID = params['assetID'];
      this.offSet = 0;
      this.offSetLimit = 5000;
      this.activeTemp = this.utilitiesService.getActiveTemp();
      this.createColumnDefs();
      if (this.assetType === undefined) {
        if (this.category === '') {
          this.filtersService.qualFilters = {};
        }
      } else {
        // for setting type of asset on UI
        this.linelevelService.selectedAssetView[0] = this.assetType;
        this.getCPSLineItems();
      }

      this.getTableData();
      this.setGridHeight();
      // this.getAssetSearchItems();
      this.utilitiesService.bindHeaderMouseOver();
      if ((this.assetID || (this.linelevelService.selectedAssetView[0] !== 'All') && (this.category === ''))) {
        this.isSummaryView = true;
      } else {
        this.isSummaryView = false;
      }
    });
    // this.createColumnDefs();
    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true
    };
    this.myTexts = {
      defaultTitle: ''
    };
  }

  setGridHeight() {
    if (this.linelevelService.selectedAssetView.length && this.linelevelService.selectedAssetView[0] !== 'All' && !this.category && !this.assetID) {
      this.gridHeaderHeight = 46;
    } else {
      this.gridHeaderHeight = 23;
    }
  }

  getAssetSearchItems() {
    if (this.assetID) {
      this.linelevelService.getAssetSearchItems()
        .subscribe(data => {
          this.assetSearchItems = data;
        });
    }
  }

  // get list of all contract, product and service SO numbers for search
  getCPSLineItems() {
    let filterType = '';
    let api = 'contract';
    if (this.assetType === 'Contract') {
      filterType = '/contractNo';
      this.filtersService.qualFilters['contractNo'] = JSON.stringify([this.assetID]);
    } else if (this.assetType === 'Product SO') {
      filterType = '/productPO';
      api = 'product';
      this.filtersService.qualFilters['productPO'] = JSON.stringify([this.assetID]);
    } else if (this.assetType === 'Service SO') {
      filterType = '/servicePO';
      this.filtersService.qualFilters['servicePO'] = JSON.stringify([this.assetID]);
    }
    const payload = {
      'customerName': this.customerID,
      'globalCustomerView': this.globalType,
      'filterType': filterType,
      'searchStr': null
    };
    this.linelevelService.getCPSList(api, filterType, payload)
      .subscribe(data => {
        this.assetSearchItems = data.filters;
      });
  }

  // getting data for asset view
  getAssetsViewTableData() {
    let type: string = this.linelevelService.selectedAssetView[0];
    if (type === 'Contract') {
      type = 'contract';
    } else if (type === 'Product SO') {
      type = 'productSO';
    } else if (type === 'Service SO') {
      type = 'serviceSO';
    }
    this.linelevelService.getAssetLineCount(this.customerID, type)
      .subscribe(lc => {
        if (lc.count < 2000000) {
          this.disableLoadMore = (lc.count > this.assetOffsetLimit) ? false : true;
          this.updateHeader.getLineLevelHeaders();
          const payload = {
            'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
            'offset': this.assetOffset,
            'customerName': this.customerID,
            'filters': this.filtersService.getQualFilterstoRest()
          };
          this.linelevelService.getAssetsViewData(payload)
            .subscribe(data => {
              this.lineLevelData = data.summaryViewType;
              this.gridOptions.api.setRowData(this.lineLevelData);
              this.getLineLevelTabs();
              if (this.lineLevelData.length >= 5000) {
                setTimeout(() => {
                  const openElement = document.getElementById('openLoadPopover');
                  if (openElement) {
                    openElement.click();
                  }
                }, 1000);
                setTimeout(() => {
                  const closeElement = document.getElementById('closeLoadPopover');
                  if (closeElement) {
                    closeElement.click();
                  }
                }, 5000);
              }
            },
            error => {
              this.loaderService.hide();
              if (error.status === 404) {
                this.copyLinkService.showMessage('No Data Available!', true);
              }
            });
        }
      });
  }

  // Getting data for table and asset view
  getTableData() {
    if (this.linelevelService.selectedAssetView.length && this.linelevelService.selectedAssetView[0] !== 'All' && !this.category && !this.assetID) {
      // for asset view only
      this.getAssetsViewTableData();
    } else {
      // for regular view
      if (this.category === '') {
        this.lineLevelData = [];
        this.getLineLevelData(this.customerID, 'line-detail', this.offSet, this.customerID, false);
        // this.updateHeader.getLineLevelHeaders();
      } else {
        // this.createColumnDefs();
        this.getLineLevelData(this.category, 'qual-line-details', this.offSet, this.customerID, false);
      }
    }
  }

  // event emmited from filters
  applyFilters($event) {
    if (this.linelevelService.selectedAssetView.length && this.linelevelService.selectedAssetView[0] !== 'All' && !this.category && !this.assetID) {
      this.getAssetsViewTableData();
    } else {
      this.lineLevelData = [];
      this.getLineLevelData($event.customer, $event.callType, 0, this.customerID, true);
      this.updateHeader.getLineLevelHeaders();
    }
  }

  // get view summary after account manager approves or disapproves lines
  amDecisionAllComplete() {
    let isValid = true;
    const rCount = this.gridApi.getDisplayedRowCount();
    for (let i = 0; i < rCount; i++) {
      const rowNode = this.gridApi.getDisplayedRowAtIndex(i);
      if (rowNode.data.amDecisionStatus === undefined) {
        isValid = false;
      }
    }
    return isValid;
  }

  // get line level data from service
  getLineLevelData(s, api, offset, name, callQualTab) {
    this.writebackDone = this.utilitiesService.getWritebackDone();
    if (!this.writebackDone) {
      this.lookupComplete = false;
    }
    // show line-item if linecount is less than 2M else throw err message
    this.linelevelService.getlineCount(this.customerID)
      .subscribe(ic => {
        if (ic.count > 2000000 && this.category === '') {
          this.lineLevelData = [];
          this.gridOptions.api.setRowData(this.lineLevelData);
          this.is2MErr = true;
        } else {
          this.is2MErr = false;
          this.linelevelService.getLineLevelData(s, api, offset, name)
            .subscribe(data => {
              this.loaderService.hide();
              if ((this.lineLevelData.length === 0 && this.offSet === 0)) {
                this.lineLevelData = data.lineLevel;
              } else {
                data.lineLevel.forEach(line => {
                  this.lineLevelData.push(line);
                });
              }
              if (this.lookupdata) {
                this.lookupService.tableData = this.lineLevelData;
                this.lookupService.matchData();
                this.unmatchedData = this.lookupService.unmatchedData;
              }
              this.gridOptions.api.setRowData(this.lineLevelData);
              if (!callQualTab) {
                this.getLineLevelTabs();
              }
              setTimeout(() => {
                this.userInfo = this.utilitiesService.getUserInformation();
                this.userId = this.userInfo.user.userId;
                this.isAccountMngr.approveQual = this.userInfo.approveQual;
                document.getElementById('openLoadPopover').click();
              }, 1000);
              setTimeout(() => {
                document.getElementById('closeLoadPopover').click();
              }, 5000);
              if (this.category !== '') {
                this.viewSummary = this.amDecisionAllComplete();
              }
            },
              error => {
                this.loaderService.hide();
                if (error.status === 404) {
                  this.loaderService.hide();
                  this.copyLinkService.showMessage('No Data Available! You may want to review your filters.', true);
                }
                if (error.status === 504) {
                  this.errorService.setErrorCode(error.status);
                  this.routerObj.navigate(['/error']);
                }
              });
        }
      },
        error => {
          if (error.status === 500) {
            this.copyLinkService.showMessage('500 Server Error! Check back after sometime.', true);
            this.lineLevelData = [];
            this.gridOptions.api.setRowData(this.lineLevelData);
            this.gridOptions.api.hideOverlay();
            this.is2MErr = true;
          }
          if (error.status === 504) {
            this.errorService.setErrorCode(error.status);
            this.routerObj.navigate(['/error']);
          }
        });
  }

  // checking for request report emit function after header API
  updateReportOption(ev) {
    if (this.is2MErr) {
      this.loaderService.hide();
    }
    const lineCount = ev.headerInfo.lineCount;
    if (lineCount > 2000000) {
      this.disableLoadMore = true;
    } else {
      this.disableLoadMore = (lineCount > this.offSetLimit) ? false : true;
    }
    if (lineCount > 5000 && lineCount < 500000) {
      this.reportAlert = false;
      this.showReport = true;
    }
    if (lineCount < 5000) {
      this.showReport = false;
      this.reportAlert = false;
      this.hideBothOptions = true;
    }
    if (lineCount > 500000) {
      this.reportAlert = true;
      this.hideBothOptions = false;
    }
    if (!this.showReport && this.hideBothOptions) {
      this.disableDownload = false;
    } else {
      this.disableDownload = true;
    }
    if (this.category !== '') {
      const q = this.utilitiesService.getQualification();
      if (q !== undefined) {
        // for generating report after 24 hours
        const hours = Math.abs(moment(q.dateStarted).diff(moment(), 'hours'));
        this.disableReport = (hours < 24) ? true : false;
      } else {
        setTimeout(() => {
          if (this.lineLevelTabs !== undefined) {
            for (let i = 0; i < this.lineLevelTabs.length; i++) {
              if (this.lineLevelTabs[i].qualficationId === this.category) {
                const hours = Math.abs(moment(this.lineLevelTabs[i].dateStarted).diff(moment(), 'hours'));
                this.disableReport = (hours < 24) ? true : false;
              }
            }
          }
        }, 10000);
      }
    }
  }

  loadMore() {
    const lineCount = this.utilitiesService.getLineHeaderDetails().lineCount;
    if (lineCount > this.offSetLimit) {
      this.offSet = this.offSet + 5000;
      this.offSetLimit = this.offSetLimit + 5000;
      this.disableLoadMore = (lineCount > this.offSetLimit) ? false : true;
      this.getLineLevelData(this.customerID, 'line-detail', this.offSet, this.customerID, false);
    }
  }

  changeSelectedValue() {
    this.showList = !this.showList;
  }

  resetLookUp() {
    this.lookupComplete = false;
    this.unidentifiedPercent = 0;
    this.writebackDone = false;
    this.lookupService.colCheckbox = [];
    this.lookupService.lookupBy = '';
    this.lookupService.lookupWith = '';
    this.lookupService.fileName = '';
    this.lookupService.excelData = [];
    this.lookupService.colRadio = '';
    // this.updateLineCount();
    this.utilitiesService.setTableHeight();
    setTimeout(() => {
      this.gridOptions.api.redrawRows();
    }, 0);
    setTimeout(() => {
      this.gridOptions.api.refreshHeader();
    }, 0);
  }

  // navigate to different views
  navigateToAssetView(assetName) {
    if (assetName === 'All') {
      assetName = '';
      this.columnDefs = this.linelevelService.getColumnDefs(); // restore configured columns
    } else {
      if (this.lookupComplete) {
        this.resetLookUp();
      }
      if (this.showToolPanel) {
        this.toggleConfigureColumn();
      }
      this.createColumnDefs(); // get columns by asset type
    }
    // this.activeAsset = assetName;
    this.getTableData();
    this.setGridHeight();
  }

  assetViewChange(r) {
    if (r.length > 0) {
      this.linelevelService.selectedAssetView = r;
      this.navigateToAssetView(this.linelevelService.selectedAssetView[0]);
      this.isSummaryView = false;
      if (this.linelevelService.selectedAssetView[0] !== 'All') {
        this.isSummaryView = true;
      }
    }
  }

  //
  selectAssetNumber(val) {
    this.routerObj.navigate(['/line-level/', this.customerID, 'All', this.globalType, this.assetType, val]);
  }

  addUnmatchedClass(params, t, field) {
    if (field === 'serialNumber') {
      params.data.hasUnmatched = false;
    }
    if (t.lookupComplete && t.lookupService.colCheckbox.indexOf(field) > -1 && t.lookupService.matchedData.indexOf(params.data[t.lookupService.colRadio]) > -1) {
      if (t.unmatchedData[field] && t.unmatchedData[field].length) {
        let ifHasVal = false;
        t.unmatchedData[field].forEach(d => {
          if (d.value === params.data[field] && d.primaryVal === params.data[d.primaryKey]) {
            ifHasVal = true;
            return false;
          }
        });
        if (ifHasVal) {
          params.data.hasUnmatched = true;
          return 'unmatched-cell';
        }
      }
      return 'matched-cell';
    }
    return '';
  }

  addColStateBorder(params, t) {
    const field = params.colDef.field;
    if (!t.lookupComplete || this.lookupService.colCheckbox.indexOf(field) === -1) {
      return '';
    }
    if (t.unmatchedData[field] && t.unmatchedData[field].length) {
      return 'unmatched-header';
    }
    return '';
    // return 'matched-header';
  }

  isExternalFilterPresent(t) {
    return this.lookupComplete;
  }

  doesExternalFilterPass(node, t) {
    if (t.matchFilter === '' || (t.matchFilter === 'matched' && !node.data.hasUnmatched && t.lookupService.matchedData.indexOf(node.data[t.lookupService.colRadio]) > -1) || (t.matchFilter === 'unmatched' && node.data.hasUnmatched)) {
      return true;
    }
    return false;
  }

  externalFilterChanged(newValue) {
    this.matchFilter = newValue;
    // for sending lookup with value to hana in initcap
    if (newValue === 'matched') {
      this.lookupService.lookupWith = 'Matched';
    } else if (newValue === 'unmatched') {
      this.lookupService.lookupWith = 'Unmatched';
    } else {
      this.lookupService.lookupWith = newValue;
    }
    this.updateHeader.getLineLevelHeaders();
    this.lineLevelData = [];
    if (this.category === '') {
      this.getLineLevelData(this.customerID, 'line-detail', this.offSet, this.customerID, false);
    } else {
      this.getLineLevelData(this.category, 'qual-line-details', this.offSet, this.customerID, false);
    }
    // this.gridOptions.api.onFilterChanged();
  }

  // for showing approve or view summary option to user
  getQualificationApproval() {
    this.linelevelService.getQualificationApproval(this.category)
      .subscribe(d => {
        this.loaderService.hide();
        d.status = d.status === 'true' ? true : false;
        this.isQualReady = d.status;
        setTimeout(() => {
          if (this.isAccountMngr.approveQual && this.isQualReady) {
            this.showApproval = true;
          } else {
            this.showApproval = false;
          }
        }, 1000);
      },
        error => {
          this.loaderService.hide();
        }
      );
  }

  // get line level qualification tabs
  getLineLevelTabs() {
    this.linelevelService.getLineLevelTabs(this.customerID)
      .subscribe(data => {
        this.loaderService.hide();
        this.lineLevelTabs = data.qualDetails;
        setTimeout(() => {
          if (this.activeQual) {
            this.utilitiesService.adjustTabsHeight(this.tempQualId);
            this.activeQual = false;
          } else {
            this.utilitiesService.adjustTabsHeight(false);
          }
        }, 1000);
        this.totalQualification = data.qualDetails.length;
        if (this.category !== '') {
          this.getQualificationApproval();
          for (const activeQualificationTab of data.qualDetails) {
            if (activeQualificationTab.qualficationId === this.category) {
              this.utilitiesService.setQualification(activeQualificationTab);
              this.resetApiFilters(activeQualificationTab);
            }
          }
        }
      },
        error => {
          this.lineLevelTabs = [];
          this.loaderService.hide();
        }
      );
  }

  // click on All qualification tab
  goToAll() {
    this.writebackDone = this.utilitiesService.getWritebackDone();
    this.offSet = 0;
    this.offSetLimit = 5000;
    this.utilitiesService.setQualification(undefined);
    this.filtersService.filters = JSON.parse(JSON.stringify(this.filtersService.getDefaultFilters()));
    this.filtersService.qualFilters = {};
    this.filtersService.dataset = {};
    this.filtersService.applyFilters(this.filtersService.filters);
    const link = '/line-level/';
    this.routerObj.navigate([link, encodeURIComponent(this.customerID), 'All', this.utilitiesService.getGlobalCustomerView()]);
    this.showApproval = false;
    this.disableReport = false;
  }

  // click on qualification name
  getQualification(q) {
    this.writebackDone = this.utilitiesService.getWritebackDone();
    this.loaderService.hide();
    this.utilitiesService.setQualification(q);
    // to set applied filters in view applied
    this.resetApiFilters(q);
    const link = '/line-level/';
    this.routerObj.navigate([link, encodeURIComponent(this.customerID), q.qualificationHashId, this.utilitiesService.getGlobalCustomerView()]);
    this.showApproval = false;
    this.activeTemp = this.utilitiesService.getActiveTemp();
    // this.template.resetActiveTemplate();
    this.offSet = 0;
    this.offSetLimit = 5000;
    this.viewSummary = false;
    this.selectedRowsCount = 0;
    // for generating report after 24 hours
    const hours = moment(moment()).diff(q.dateStarted, 'hours');
    const lineCount = this.utilitiesService.getLineHeaderDetails().lineCount;
    this.showReport = (hours > 24 && lineCount > 5000) ? true : false;
    this.lineLevelData = [];
    this.linelevelService.getQualificationApproval(q.qualficationId)
      .subscribe(data => {
        this.loaderService.hide();
        data.status = data.status === 'true' ? true : false;
        this.isQualReady = data.status;
        if (this.isAccountMngr.approveQual && this.isQualReady) {
          this.showApproval = true;
        }
      },
        error => {
          this.loaderService.hide();
        }
      );
  }

  // to reset filters while applying qualification
  resetApiFilters(q) {
    this.filtersService.qualFilters = {};
    if (q.filters.length <= 2) {
      this.filtersService.qualFilters = q.filters[0];
      this.filtersService.filters = q.filters[1];
    } else {
      this.filtersService.filters = JSON.parse(JSON.stringify(this.filtersService.getDefaultFilters()));
    }
    this.filtersService.applyFilters(this.filtersService.filters);
  }

  // show/ hide feature for Configure Column
  toggleConfigureColumn() {
    this.showToolPanel = !this.showToolPanel;
  }

  GetFormattedDate() {
    const now = moment().format('D-MMM-YYYY');
    return now;
  }

  // change date format of data from json
  changeDateFormat(params) {
    if (params.value) {
      const getFormattedDate = moment(params.value);
      return getFormattedDate.format('D-MMM-YYYY');
    }
  }

  // open disqualify popup
  open(content) {
    const thisInstance = this;
    let rowsData;
    this.modalVar.open(content, this.ngbModalOptions).result.then((result) => {
      const getAllSelectedRows = thisInstance.gridOptions.api.getSelectedRows();
      if (getAllSelectedRows.length > 0) { // modify selected rows only
        rowsData = getAllSelectedRows;
      } else {
        rowsData = this.lineLevelData;
      }
      rowsData.forEach(function (k, p) {
        if (result.selectedReasonCode) {
          k.reasonCode = result.selectedReasonCode;
        }
        if (result.selectedSubReasonCode) {
          k.subReasonCode = result.selectedSubReasonCode;
        }
        if (result.selectedReasonCode && result.selectedSubReasonCode) {
          k.qualificationStatus = 'Disqualified';
          k.qualificationStartedDate = thisInstance.GetFormattedDate();
          k.qualificationStartedBy = 'George Adams';
          k.modifiedName = 'Paul Sorge';
          k.modifiedDate = thisInstance.GetFormattedDate();
        }
        // console.log(k.qualificationStatus);
        setTimeout(() => {
          thisInstance.gridOptions.api.refreshCells();
        }, 0);
      });
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // get disqualify popup dismiss reason
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // open qualify popup
  openQualifyPopup(qualifyContent) {
    const thisInstance = this;
    let rowsData;
    this.modalVar.open(qualifyContent, this.ngbModalOptions).result.then((result) => {
      const getAllSelectedRows = thisInstance.gridOptions.api.getSelectedRows();
      if (getAllSelectedRows.length > 0) { // modify selected rows only
        rowsData = getAllSelectedRows;
      } else {
        rowsData = this.lineLevelData;
      }
      rowsData.forEach(function (k, p) {
        if (result.selectedReasonCode) {
          k.reasonCode = result.selectedReasonCode;
        }
        if (result.selectedReasonCode) {
          k.qualificationStatus = 'Qualified';
          k.subReasonCode = '';
          k.qualificationStartedDate = thisInstance.GetFormattedDate();
          k.qualificationStartedBy = 'George Adams';
          k.modifiedName = 'Paul Sorge';
          k.modifiedDate = thisInstance.GetFormattedDate();
        }
        setTimeout(() => {
          thisInstance.gridOptions.api.refreshCells();
        }, 0);
      });
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getQualifyDismissReason(reason)}`;
    });
  }

  // get qualify popup dismiss reason
  private getQualifyDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private createColumnDefs() {
    if ( (this.activeTemp === 'Default Template' && this.linelevelService.selectedAssetView[0] === 'All' )
      || (this.activeTemp === 'Default Template' && this.linelevelService.selectedAssetView[0] !== 'All' && this.assetID)
      || (this.activeTemp === 'Default Template' && this.category )) {
      this.linelevelService.getColumnDefinition()
        .subscribe(data => {
          this.columnDefs = data;
          this.linelevelService.setColumnDefs(data);
          this.columnHeaderList = [];
          const localInstance = this;
          for (let i = 0; i < this.columnDefs.length; i++) {
            if (this.columnDefs[i].children) {
              for (let j = 0; j < this.columnDefs[i].children.length; j++) {
                if (this.columnDefs[i].children[j].headerName) {
                  this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'numberCellRendered') {
                  this.columnDefs[i].children[j].cellRenderer = this.numberCellRendered;
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'changeDateFormat') {
                  this.columnDefs[i].children[j].cellRenderer = this.changeDateFormat;
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'defaultQualificationStage') {
                  this.columnDefs[i].children[j].cellRenderer = this.defaultQualificationStage;
                }
                if (this.columnDefs[i].children[j].headerValueGetter === 'columnInfoRendered') {
                  this.columnDefs[i].children[j].headerValueGetter = this.columnInfoRendered;
                }
                if (this.columnDefs[i].cellClass === 'addUnmatchedClass') {
                  this.columnDefs[i].cellClass = function (params) {
                    return localInstance.addUnmatchedClass(params, localInstance, params.colDef.field);
                  };
                }
                if (this.columnDefs[i].children[j].headerClass === 'addColStateBorder') {
                  this.columnDefs[i].children[j].headerClass = function (params) {
                    return localInstance.addColStateBorder(params, localInstance);
                  };
                }
              }
            } else {
              if (this.columnDefs[i].headerName) {
                this.columnHeaderList.push(this.columnDefs[i].headerName);
              }
              if (this.columnDefs[i].cellRenderer === 'numberCellRendered') {
                this.columnDefs[i].cellRenderer = this.numberCellRendered;
              }
              if (this.columnDefs[i].cellRenderer === 'changeDateFormat') {
                this.columnDefs[i].cellRenderer = this.changeDateFormat;
              }
              if (this.columnDefs[i].cellRenderer === 'defaultQualificationStage') {
                this.columnDefs[i].cellRenderer = this.defaultQualificationStage;
              }
              if (this.columnDefs[i].headerValueGetter === 'columnInfoRendered') {
                this.columnDefs[i].headerValueGetter = this.columnInfoRendered;
              }
              if (this.columnDefs[i].cellClass === 'addUnmatchedClass') {
                this.columnDefs[i].cellClass = function (params) {
                  return localInstance.addUnmatchedClass(params, localInstance, params.colDef.field);
                };
              }
              if (this.columnDefs[i].headerClass === 'addColStateBorder') {
                this.columnDefs[i].headerClass = function (params) {
                  return localInstance.addColStateBorder(params, localInstance);
                };
              }
            }
          }
        });
    } else if ((this.assetID && this.linelevelService.selectedAssetView[0] !== 'All') || (this.activeTemp !== 'Default Template' && this.category)) {
      this.columnDefs = this.linelevelService.getColumnDefs();
    } else {
      // view assets
      this.linelevelService.getAssetsColumnDefinition()
        .subscribe(data => {
          this.columnDefs = data;
          this.columnHeaderList = [];
          const localInstance = this;
          for (let i = 0; i < this.columnDefs.length; i++) {
            if (this.columnDefs[i].children) {
              for (let j = 0; j < this.columnDefs[i].children.length; j++) {
                if (this.columnDefs[i].children[j].headerName) {
                  this.columnHeaderList.push(this.columnDefs[i].children[j].headerName);
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'numberCellRendered') {
                  this.columnDefs[i].children[j].cellRenderer = this.numberCellRendered;
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'changeDateFormat') {
                  this.columnDefs[i].children[j].cellRenderer = this.changeDateFormat;
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'percentageBars') {
                  this.columnDefs[i].children[j].headerClass = function (params) {
                    return localInstance.percentageBars(params, localInstance);
                  };
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'currencyFormat') {
                  this.columnDefs[i].children[j].headerClass = function (params) {
                    return localInstance.currencyFormat(params, localInstance);
                  };
                }
                if (this.columnDefs[i].children[j].cellRenderer === 'contractProductServiceCellRenderer') {
                  this.columnDefs[i].children[j].cellRenderer = this.contractProductServiceCellRenderer;
                }
                if (this.columnDefs[i].children[j].headerValueGetter === 'columnInfoRendered') {
                  this.columnDefs[i].children[j].headerValueGetter = this.columnInfoRendered;
                }
                if (this.columnDefs[i].cellClass === 'addUnmatchedClass') {
                  this.columnDefs[i].cellClass = function (params) {
                    return localInstance.addUnmatchedClass(params, localInstance, params.colDef.field);
                  };
                }
                if (this.columnDefs[i].children[j].headerClass === 'addColStateBorder') {
                  this.columnDefs[i].children[j].headerClass = function (params) {
                    return localInstance.addColStateBorder(params, localInstance);
                  };
                }
              }
            } else {
              if (this.columnDefs[i].headerName) {
                this.columnHeaderList.push(this.columnDefs[i].headerName);
              }
              if (this.columnDefs[i].cellRenderer === 'numberCellRendered') {
                this.columnDefs[i].cellRenderer = this.numberCellRendered;
              }
              if (this.columnDefs[i].cellRenderer === 'changeDateFormat') {
                this.columnDefs[i].cellRenderer = this.changeDateFormat;
              }
              if (this.columnDefs[i].cellRenderer === 'percentageBars') {
                this.columnDefs[i].cellRenderer = function (params) {
                  return localInstance.percentageBars(params, localInstance);
                };
              }
              if (this.columnDefs[i].cellRenderer === 'currencyFormat') {
                this.columnDefs[i].cellRenderer = function (params) {
                  return localInstance.currencyFormat(params, localInstance);
                };
              }
              if (this.columnDefs[i].cellRenderer === 'contractProductServiceCellRenderer') {
                this.columnDefs[i].cellRenderer = this.contractProductServiceCellRenderer;
              }
              if (this.columnDefs[i].headerValueGetter === 'columnInfoRendered') {
                this.columnDefs[i].headerValueGetter = this.columnInfoRendered;
              }
              if (this.columnDefs[i].cellClass === 'addUnmatchedClass') {
                this.columnDefs[i].cellClass = function (params) {
                  return localInstance.addUnmatchedClass(params, localInstance, params.colDef.field);
                };
              }
              if (this.columnDefs[i].headerClass === 'addColStateBorder') {
                this.columnDefs[i].headerClass = function (params) {
                  return localInstance.addColStateBorder(params, localInstance);
                };
              }
            }
          }
        });
    }
  }

  private calculateRowCount() {
    if (this.gridOptions.api && this.rowData) {
      const model = this.gridOptions.api.getModel();
      const totalRows = this.rowData.length;
      const processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  private onModelUpdated() {
    // console.log('onModelUpdated');
    this.calculateRowCount();
  }

  private onReady(params) {
    // console.log('onReady');
    this.calculateRowCount();
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private onCellClicked($event) {
    if ($event.colDef.field === 'qualificationStatus') {
      let state;
      if ($event.data.qualificationStatus === 'Disqualified' || $event.data.qualificationStatus === 'disqualify') {
        state = 'disqualify';
      }
      if ($event.data.qualificationStatus === 'Qualified' || $event.data.qualificationStatus === 'qualify') {
        state = 'qualify';
      }
      state = state ? state : 'pending';
      this.openQualifyDisqualifyModal(state, $event.node);
    } else if ((($event.colDef.field === 'contractNumber') || ($event.colDef.field === 'productSO') || ($event.colDef.field === 'serviceSO')) && $event.value) {
      let qType = '';
      let assetName = '';

      qType = this.category === '' ? 'All' : this.category;
      // this.filtersService.qualFilters = {};
      if ($event.colDef.field === 'contractNumber') {
        this.filtersService.qualFilters['contractNo'] = JSON.stringify([$event.value]);
        assetName = 'Contract';
      } else if ($event.colDef.field === 'productSO') {
        this.filtersService.qualFilters['productPO'] = JSON.stringify([$event.value]);
        assetName = 'Product SO';
      } else if ($event.colDef.field === 'serviceSO') {
        this.filtersService.qualFilters['servicePO'] = JSON.stringify([$event.value]);
        assetName = 'Service SO';
      }
      this.routerObj.navigate(['/line-level/' + this.customerID + '/' + qType + '/' + this.utilitiesService.getGlobalCustomerView() + '/' + assetName + '/' + $event.value]);
    }
  }

  private onCellValueChanged($event) {
    console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
  }

  private onCellDoubleClicked($event) {
    // console.log('onCellDoubleClicked: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellContextMenu($event) {
    // console.log('onCellContextMenu: ' + $event.rowIndex + ' ' + $event.colDef.field);
  }

  private onCellFocused($event) {
    // console.log('onCellFocused: (' + $event.rowIndex + ',' + $event.colIndex + ')');
  }

  private onRowSelected($event) {
    // taking out, as when we 'select all', it prints to much to the console!!
    // console.log('onRowSelected: ' + $event.node.data.name);
    this.enableUndoButton($event);
  }

  // disable and enable UnDo Button on basis of status
  enableUndoButton ($event) {
    const numOfRows = this.gridOptions.api.getSelectedRows();
    if ($event.data.qualificationStatus !== 'Pending') {
      if (numOfRows.length === 0) {
        this.disableUndo = true;
      }
      if (numOfRows.length === 1) {
        if (numOfRows[0]['qualificationStatus'] === 'Pending') {
          this.disableUndo = true;
        } else {
          this.disableUndo = false;
        }
      } else {
        for (let _i = 0; _i < numOfRows.length; _i++) {
          if (numOfRows[_i].qualificationStatus === 'Pending') {
            this.disableUndo = true;
            break;
          } else {
            this.disableUndo = false;
          }
        }
      }
    } else if ($event.data.qualificationStatus === 'Pending') {
      if (numOfRows.length === 1) {
        if (numOfRows[0]['qualificationStatus'] !== 'Pending') {
          this.disableUndo = false;
        } else {
          this.disableUndo = true;
        }
      } else if (numOfRows.length > 1) {
        for (let _j = 0; _j < numOfRows.length; _j++) {
          if (numOfRows[_j].qualificationStatus !== 'Pending') {
            this.disableUndo = false;
          } else {
            this.disableUndo = true;
            break;
          }
        }
      } else {
        this.disableUndo = true;
      }
    }
  }

  private onSelectionChanged() {
    this.selectedRows = this.gridOptions.api.getSelectedRows();
    this.selectedRowsCount = this.gridOptions.api.getSelectedRows().length;
    const totalRows = this.lineLevelData.length;
    this.ifAllRowsSelected = this.selectedRowsCount === totalRows;
  }

  private onBeforeFilterChanged() {
    // console.log('beforeFilterChanged');
  }

  private onAfterFilterChanged() {
    // console.log('afterFilterChanged');
  }

  private onFilterModified() {
    // console.log('onFilterModified');
  }

  private onBeforeSortChanged() {
    // console.log('onBeforeSortChanged');
  }

  private onAfterSortChanged() {
    // console.log('onAfterSortChanged');
  }

  private sortChanged() {
    // console.log('sortChanged');
    this.manageTemplateService.templateChanged = true;
  }

  private onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  private onRowClicked($event) {
    // console.log('onRowClicked: ' + $event.node.data.name);
  }

  private defaultCellValue(params) {
    if (params.value === '') {
      return '--';
    } else {
      return params.value;
    }
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  // View dropdown feature in pagination
  onPageSizeChanged(newPageSize) {
    this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
  }

  defaultQualificationStage(params) {
    const val = params.value;
    if (val === 'qualify' || val === 'Qualified') {
      return 'Qualified';
    }
    if (val === 'disqualify' || val === 'Disqualified') {
      return 'Disqualified';
    }
    return 'Pending';
  }

  // get column info in header
  columnInfoRendered(params) {
    let headerInfo;
    headerInfo = params.colDef.headerName;
    if (params.colDef.columnInfo) {
      headerInfo += '<div class="info-box"><span class="ico-info"><span class="ico-infoText"><span class="icon-arrow-up"><span class="path1"></span><span class="path2"></span></span>' + params.colDef.columnInfo + '</span></span></div>';
    }
    return headerInfo;
  }

  contractProductServiceCellRenderer(params) {
    const val = params.value ? params.value : '';
    const anchor = '<a href="javascript:">' + val + '</a>';
    return anchor;
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  private onColumnEvent($event) {
    // console.log('onColumnEvent: ' + $event);
  }

  private onColumnMoved($event) {
    // console.log('onColumnMoved');
    this.manageTemplateService.templateChanged = true;
  }

  private onColumnVisible($event) {
    // console.log('onColumnVisible');
    this.manageTemplateService.templateChanged = true;
    this.isColUpdated = true;
  }

  // create percentage bars on Asset View
  percentageBars(params, thisInstance) {
    if (params.data && params.data.ibOpportunityPercentage !== undefined) {
      const oppPercent = this.headerService.updateOppPercent(params);
      const flag = `
        <div class="tooltip-custom tooltip-qualified">
        <div class='progressBG'>
        <span style='width:` + oppPercent.qualPercent + `%;' class='qualified-progress'></span>
        <span style='width:` + oppPercent.disqualPercent + `%;' class='disqualified-progress'></span>
        <span style='width:` + oppPercent.pendingPercent + `%;' class='pending-progress'></span>
        </div>
      </div>
        `;
      if (oppPercent.total > 0) {
        return flag;
      }
    }
  }

  // center align cell data
  numberCellRendered(params) {
    return '<div class="text-center">' + params.value + '</div>';
  }

  getBooleanValue(cssSelector) {
    return document.querySelector(cssSelector).checked === true;
  }

  cleanHeaderValue(p) {
    return p.column.colDef.headerName;
  }

  // export table data to CSV
  exportToCsv() {
    const selectedRows = this.gridOptions.api.getSelectedRows();
    const params = {
      fileName: 'line-level',
      onlySelected: selectedRows.length > 0,
      columnSeparator: ';',
      processHeaderCallback: this.cleanHeaderValue
    };
    // DE174792
    // tslint:disable-next-line:no-shadowed-variable
    // params.processHeaderCallback = function(params) {
    //   return params.column.getColDef().headerName;
    // };

    this.gridOptions.api.exportDataAsCsv(params);
  }

  // export table data to Excel
  exportToExcel() {
    const selectedRows = this.gridOptions.api.getSelectedRows();
    const params = {
      fileName: 'line-level',
      onlySelected: selectedRows.length > 0,
      columnGroups: true,
      allColumns: true,
      processHeaderCallback: this.cleanHeaderValue
    };
    this.gridOptions.api.exportDataAsExcel(params);
    this.copyLinkService.showMessage('Your file is downloading.', false);
  }

  // request report modal
  openRequestReport() {
    if (this.reportAlert) {
      return;
    }
    if (!this.disableReport && !this.isSummaryView) {
      let modalRef;
      const lC = this.utilitiesService.getLineHeaderDetails().lineCount;
      if (lC > 500000) { // total rows exceeds 500K
        modalRef = this.modalVar.open(LineCountComponent, this.ngbModalOptions);
        modalRef.componentInstance.customerID = this.customerID + '/All/' + this.globalType;
      } else if (this.showReport) {
        // qualId, lineCount
        let qId;
        if (this.category !== '') {
          qId = this.category;
        }
        this.linelevelService.requestReport(qId, lC, this.customerID)
          .subscribe(res => {
            this.loaderService.hide();
            console.log(res);
          },
            error => {
              this.loaderService.hide();
            });
        modalRef = this.modalVar.open(RequestReportComponent, this.ngbModalOptions);
      }
      modalRef.result.then((result) => { }, (reason) => { });
    }
  }

  openLookupModal() {
    if (this.filtersService.getFiltersCount(false) > 0) {
      const ngbModalOptionsLocal = this.ngbModalOptions;
      ngbModalOptionsLocal.windowClass = 'drop-filters-modal';
      const modalRefDrop = this.modalVar.open(DropFiltersComponent, ngbModalOptionsLocal);
      modalRefDrop.result.then((result) => {
        if (result.isCancel === 'Ok') {
          this.updateHeader.getLineLevelHeaders();
          if (this.category === '') {
            this.getLineLevelData(this.customerID, 'line-detail', 0, this.customerID, false);
          } else {
            this.getLineLevelData(this.category, 'qual-line-details', 0, this.customerID, false);
          }
        }
        this.openActualLookupModal();
      }, (reason) => {
        // console.log(`Dismissed ${this.getDismissReason(reason)}`);
      });
    } else {
      this.openActualLookupModal();
    }
  }

  openActualLookupModal() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'lookup-modal';
    const modalRef = this.modalVar.open(LookupComponent, ngbModalOptionsLocal);
    // modalRef.componentInstance.tableData = this.lineLevelData;
    modalRef.result.then((result) => {
      this.lookupdata = true;
      this.lineLevelData = [];
      if (this.category === '') {
        this.getLineLevelData(this.customerID, 'line-detail', this.offSet, this.customerID, false);
      } else {
        this.getLineLevelData(this.category, 'qual-line-details', this.offSet, this.customerID, false);
      }
      this.unidentifiedPercent = this.lookupService.unidentifiedPercent;
      this.writebackDone = true;
      this.utilitiesService.setWritebackDone(true);
      this.lookupComplete = true;
      this.unmatchedData = this.lookupService.unmatchedData;
      const thisInstance = this;
      this.utilitiesService.setTableHeight();
      this.gridOptions.api.forEachNode(function (rowNode) {
        if (thisInstance.lookupService.matchedData.indexOf(rowNode.data[thisInstance.lookupService.colRadio]) > -1) {
          thisInstance.lookupService.colCheckbox.forEach(element => {
            thisInstance.addUnmatchedClass(rowNode, thisInstance, element);
          });
        }
      });
      setTimeout(() => {
        this.gridOptions.api.redrawRows();
      }, 0);
      setTimeout(() => {
        this.gridOptions.api.refreshHeader();
      }, 0);
      if (this.lookupService.unidentifiedPercent !== 0) {
        this.openUnidentifiedModal();
      }
    }, (reason) => {
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  openUnidentifiedModal() {
    const UDModalRef = this.modalVar.open(UnidentifiedDataComponent, this.ngbModalOptions);
    UDModalRef.result.then((r) => {
      this.copyLinkService.showMessage('Your list has been downloaded.', false);
    }, (reason) => {
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  // open Disapprove confirmation modal
  openDisapproveConfirmationModal(stage, node) {
    const modalRef = this.modalVar.open(ConfirmDisapprovalComponent, this.ngbModalOptions);
    modalRef.result.then((result) => {
      this.openApproveDisapproveModal(stage, node);
    }, (reason) => {
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  // open Approve Disapprove modal
  openApproveDisapproveModal(stage, node) {
    const thisInstance = this;
    const getSelectedRows = thisInstance.gridOptions.api.getSelectedRows();
    const qualDetails = this.utilitiesService.getQualification();
    const qSummary = {
      'qualHashId': this.category,
      'customerName': this.customerID,
      'queryType': this.ifAllRowsSelected ? 'bulk' : 'line',
      'qualLines': this.ifAllRowsSelected ? null : JSON.stringify(this.getQualPayload(getSelectedRows))
    };
    let modalRef;
    modalRef = this.modalVar.open(ApproveDisapproveComponent, this.ngbModalOptions);
    modalRef.componentInstance.stage = stage;
    modalRef.componentInstance.currentRow = node;
    modalRef.componentInstance.qSummary = qSummary;
    modalRef.result.then((result) => {
      let payload: Object, isBulk: string;
      const ctName = encodeURIComponent(this.customerID);
      if (!this.ifAllRowsSelected) {
        const appLineArray = this.getQualPayload(getSelectedRows);
        isBulk = 'approve-disapprove';
        payload = {
          'qualName': qualDetails.qualificationName,
          'customerName': this.customerID,
          'qualHashId': qualDetails.qualificationHashId,
          'qualLines': JSON.stringify(appLineArray),
          'status': result.qualification,
          'reason': null,
          'url': window.location.origin + '/qualifications/app/#/line-level/' + ctName + '/'
            + qualDetails.qualificationHashId + '/' + this.utilitiesService.getGlobalCustomerView(),
          'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
          'comments': result.message ? result.message : null,
          'sender': thisInstance.userInfo.user.fullName
        };
      } else {
        isBulk = 'approve-disapp-bulk';
        payload = {
          'qualName': qualDetails.qualificationName,
          'qualHashId': qualDetails.qualificationHashId,
          'status': result.qualification,
          'reason': null,
          'url': window.location.origin + '/qualifications/app/#/line-level/' + ctName + '/'
            + qualDetails.qualificationHashId + '/' + this.utilitiesService.getGlobalCustomerView(),
          'comments': result.message ? result.message : null,
          'customerName': this.customerID,
          'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
          'filters': this.filtersService.getQualFilterstoRest(),
          'sender': thisInstance.userInfo.user.fullName,
          'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
          'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
          'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
          'hasInstanceId': this.lookupService.hasColumn('instanceId'),
          'hasProduct': this.lookupService.hasColumn('productID'),
          'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
          'hasContractNo': this.lookupService.hasColumn('contractNumber')
        };
      }
      this.linelevelService.approveDisapproveQual(payload, isBulk)
        .subscribe(data => {
          this.loaderService.hide();
          this.selectedRows = [];
          this.selectedRowsCount = 0;
          this.disableUndo = true;
          this.lineLevelData = [];
          this.getLineLevelData(this.category, 'qual-line-details', this.offSet, this.customerID, false);
        },
          error => {
            this.loaderService.hide();
          });
      this.viewSummary = this.amDecisionAllComplete();
      setTimeout(() => {
        thisInstance.gridOptions.api.refreshCells();
      }, 0);
    }, (reason) => {
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  // Bulk and non bulk qualification & disqualification API call...
  bulkNoBulkQualDisQual(result, getAllSelectedRows) {
    let payload: Object, isBulk: string;
    if (!this.ifAllRowsSelected) {
      const qualLineArray = this.getQualPayload(getAllSelectedRows);
      isBulk = 'qualify-disqualify';
      payload = {
        'qualName': null,
        'customerName': this.customerID,
        'approvalQual': this.isAccountMngr.approveQual,
        'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
        'qualHashId': this.category,
        'qualLines': JSON.stringify(qualLineArray),
        'qualStatus': result.qualification,
        'qualReason': result.selectedReasonCode,
        'qualSubReason': result.selectedSubReasonCode ? result.selectedSubReasonCode : null,
        'qualAttribute': result.qualReasonAttribute ? result.qualReasonAttribute : null,
        'qualAttributeVal': result.qualReasonAttributeValue ? result.qualReasonAttributeValue : null,
        'qualComments': result.message,
      };
    } else {
      isBulk = 'bulk-qual-disqual';
      payload = {
        'qualHashId': this.category,
        'status': result.qualification,
        'reason': result.selectedReasonCode,
        'subReason': result.selectedSubReasonCode ? result.selectedSubReasonCode : null,
        'qualAttribute': result.qualReasonAttribute ? result.qualReasonAttribute : null,
        'qualAttributeVal': result.qualReasonAttributeValue ? result.qualReasonAttributeValue : null,
        'comments': result.message,
        'customerName': this.customerID,
        'approvalQual': this.isAccountMngr.approveQual,
        'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
        'filters': this.filtersService.getQualFilterstoRest(),
        'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
        'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
        'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
        'hasInstanceId': this.lookupService.hasColumn('instanceId'),
        'hasProduct': this.lookupService.hasColumn('productID'),
        'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
        'hasContractNo': this.lookupService.hasColumn('contractNumber')
      };
    }
    this.linelevelService.qualifyOrDisQualify(payload, isBulk)
      .subscribe(data => {
        this.loaderService.hide();
        if (data.status === 'Success') {
          if (this.isAccountMngr.approveQual) {
            this.writebackDone = this.utilitiesService.getWritebackDone();
          }
          if (this.category !== '') {
            this.lineLevelData = [];
            this.selectedRows = [];
            this.selectedRowsCount = 0;
            this.getTableData();
            this.writebackDone = this.utilitiesService.getWritebackDone();
          }
          if (this.lookupService.lookupBy !== undefined && this.lookupService.lookupBy.length > 1) {
            this.writebackDone = true;
            this.utilitiesService.setWritebackDone(true);
          }
        }
      },
        error => {
          this.loaderService.hide();
        });
  }

  // Disqualification function API...
  onDisqualify(result, getAllSelectedRows, thisInstance) {
    getAllSelectedRows.forEach(function (k, p) {
      k.comments = '';
      if (result.selectedReasonCode) {
        k.reasonCode = result.selectedReasonCode;
      }
      if (result.selectedSubReasonCode) {
        k.subReasonCode = result.selectedSubReasonCode;
      }
      if (result.qualReasonAttribute) {
        k.qualReasonAttribute = result.qualReasonAttribute;
        k.qualReasonAttributeValue = result.qualReasonAttributeValue;
      }
      if (result.selectedSubReasonCode === 'Downsizing') {
        k.qualReasonAttribute = '';
        k.qualReasonAttributeValue = '';
      }
      if (result.message) {
        k.comments = result.message;
      }
      if (result.selectedReasonCode && result.selectedSubReasonCode) {
        k.qualificationStatus = 'disqualify';
        k.qualificationStartedDate = thisInstance.GetFormattedDate();
        k.qualificationStartedBy = thisInstance.userInfo.user.fullName;
        k.modifiedName = thisInstance.userInfo.user.fullName;
        k.modifiedDate = thisInstance.GetFormattedDate();
      }
    });
    this.getQualDisQualPayload(result, getAllSelectedRows);
  }

  // calling Qualification API
  onQualify(result, getAllSelectedRows, thisInstance) {
    getAllSelectedRows.forEach(function (k, p) {
      k.comments = '';
      if (result.selectedReasonCode) {
        k.reasonCode = result.selectedReasonCode;
      }
      if (result.selectedReasonCode !== 'Ready to Convert to Pipeline (Manual)') {
        if (result.qualReasonAttribute) {
          k.qualReasonAttribute = result.qualReasonAttribute;
          k.qualReasonAttributeValue = result.qualReasonAttributeValue;
        }
      } else {
        k.qualReasonAttribute = '';
        k.qualReasonAttributeValue = '';
      }
      if (result.message) {
        k.comments = result.message;
      }
      if (result.selectedReasonCode) {
        k.qualificationStatus = 'qualify';
        k.subReasonCode = null;
        k.qualificationStartedDate = thisInstance.GetFormattedDate();
        k.qualificationStartedBy = thisInstance.userInfo.user.fullName;
        k.modifiedName = thisInstance.userInfo.user.fullName;
        k.modifiedDate = thisInstance.GetFormattedDate();
      }
    });
    this.getQualDisQualPayload(result, getAllSelectedRows);
  }

  // qualifyDisqualify Payload function when not in All tab...
  getQualDisQualPayload(result, getAllSelectedRows) {
    // if only on qualification tab
    if (this.category !== '') {
      this.bulkNoBulkQualDisQual(result, getAllSelectedRows);
    }
    // if on all tab and user is AM
    if (this.category === '' && this.userInfo.approveQual) {
      // call create qualification with auto
      result.qualification = 'AUTO';
      this.autoCreateQualification(result, getAllSelectedRows);
    } else if (this.category === '' && !this.userInfo.approveQual) {
      this.writebackDone = true;
      this.utilitiesService.setWritebackDone(true);
    }
  }

  // open Qualify Disqualify modal
  openQualifyDisqualifyModal(stage, node) {
    const thisInstance = this;
    const modalRef = this.modalVar.open(QualifyDisqualifyComponent, this.ngbModalOptions);
    modalRef.componentInstance.stage = stage;
    modalRef.componentInstance.currentRow = node;
    modalRef.result.then((result) => {
      let getAllSelectedRows = thisInstance.gridOptions.api.getSelectedRows();
      const currentRowId = result.currentRowId;
      if (currentRowId !== '-1') {
        const rowNode = this.gridOptions.api.getRowNode(currentRowId);
        getAllSelectedRows = [rowNode.data];
      }
      if (result.qualification === 'disqualify') {
        this.onDisqualify(result, getAllSelectedRows, thisInstance);
      } else if (result.qualification === 'qualify') {
        this.onQualify(result, getAllSelectedRows, thisInstance);
      }
      this.qualDisqualValues = getAllSelectedRows;
      thisInstance.utilitiesService.adjustTabsHeight(false);
      thisInstance.gridOptions.api.refreshCells();
    }, (reason) => { });
  }

  // create payload for qualification to qualify or disqualify...
  getQualPayload(allLines) {
    const qualLines = [];
    allLines.forEach(line => {
      const qualObj = {
        contractLineId: line.iBContractLineId,
        instanceId: line.instanceId
      };
      qualLines.push(qualObj);
    });
    return qualLines;
  }

  // create payload qualLines object while saving qualification...
  getQualLines(allLines) {
    const qualLines = [];
    allLines.forEach(line => {
      const qualObj = {
        contractLineId: line.iBContractLineId,
        instanceId: line.instanceId,
        savId: line.savID,
        partyId: line.iscrPartyId,
        qualStatus: line.qualificationStatus ? line.qualificationStatus : null,
        qualReason: line.reasonCode ? line.reasonCode : null,
        qualSubReason: line.subReasonCode ? line.subReasonCode : null,
        qualComments: line.comments ? line.comments : null,
        qualAttribute: line.qualReasonAttribute ? line.qualReasonAttribute : null,
        qualAttributeVal: line.qualReasonAttributeValue ? line.qualReasonAttributeValue : null
      };
      qualLines.push(qualObj);
    });
    return qualLines;
  }

  // for UX
  // writeRows(result) {
  //   const thisInstance = this;
  //   let getAllSelectedRows = thisInstance.gridOptions.api.getSelectedRows();
  //   const currentRowId = result.currentRowId;
  //   if (currentRowId !== '-1') {
  //     const rowNode = this.gridOptions.api.getRowNode(currentRowId);
  //     getAllSelectedRows = [rowNode.data];
  //   }
  //   if (result.qualification === 'disqualify') {
  //     getAllSelectedRows.forEach(function (k, p) {
  //       k.comments = '';
  //       if (result.selectedReasonCode) {
  //         k.reasonCode = result.selectedReasonCode;
  //       }
  //       if (result.selectedSubReasonCode) {
  //         k.subReasonCode = result.selectedSubReasonCode;
  //       }
  //       if (result.getAttribute) {
  //         k.qualReasonAttribute = result.getAttribute;
  //       }
  //       if (result.getAttributeValue) {
  //         k.qualReasonAttributeValue = result.getAttributeValue;
  //       }
  //       if (result.dealId) {
  //         k.dealId = result.dealId;
  //       }
  //       if (result.message) {
  //         k.comments = result.message;
  //       }
  //       if (result.selectedReasonCode && result.selectedSubReasonCode && result.getAttributeValue) {
  //         k.qualificationStatus = 'disqualify';
  //         k.qualificationStartedDate = thisInstance.GetFormattedDate();
  //         k.qualificationStartedBy = 'George Adams';
  //         k.modifiedName = 'Paul Sorge';
  //         k.modifiedDate = thisInstance.GetFormattedDate();
  //       }
  //     });
  //   } else if (result.qualification === 'qualify') {
  //     getAllSelectedRows.forEach(function (k, p) {
  //       k.comments = '';
  //       if (result.selectedReasonCode) {
  //         k.reasonCode = result.selectedReasonCode;
  //       }
  //       if (result.getAttributeValue) {
  //         k.qualReasonAttribute = 'Deal ID';
  //         k.qualReasonAttributeValue = result.getAttributeValue;
  //       } else {
  //         k.qualReasonAttribute = '';
  //         k.qualReasonAttributeValue = '';
  //       }
  //       if (result.dealId) {
  //         k.dealId = result.dealId;
  //       }
  //       if (result.message) {
  //         k.comments = result.message;
  //       }
  //       if (result.selectedReasonCode) {
  //         k.qualificationStatus = 'qualify';
  //         k.subReasonCode = '';
  //         k.qualificationStartedDate = thisInstance.GetFormattedDate();
  //         k.qualificationStartedBy = 'George Adams';
  //         k.modifiedName = 'Paul Sorge';
  //         k.modifiedDate = thisInstance.GetFormattedDate();
  //       }
  //     });
  //   }
  //   thisInstance.utilitiesService.adjustTabsHeight(false);
  //   setTimeout(() => {
  //     thisInstance.gridOptions.api.refreshCells();
  //   }, 0);
  // }

  // payload for asset view save qualification
  assetFilterPayload(rows) {
    const cpsValues = [];
    if (this.linelevelService.selectedAssetView[0] === 'Contract') {
      rows.forEach(row => {
        if (cpsValues.length === 0) {
          cpsValues.push(row.contractNumber);
        }
        if (cpsValues.findIndex(k => k === row.contractNumber) === -1) {
          cpsValues.push(row.contractNumber);
        }
      });
      this.filtersService.qualFilters['contractNo'] = JSON.stringify(cpsValues);
    } else if (this.linelevelService.selectedAssetView[0] === 'Product SO') {
      rows.forEach(row => {
        if (cpsValues.length === 0) {
          cpsValues.push(row.productSO);
        }
        if (cpsValues.findIndex(k => k === row.productSO) === -1) {
          cpsValues.push(row.productSO);
        }
      });
      this.filtersService.qualFilters['productPO'] = JSON.stringify(cpsValues);
    } else if (this.linelevelService.selectedAssetView[0] === 'Service SO') {
      rows.forEach(row => {
        if (cpsValues.length === 0) {
          cpsValues.push(row.serviceSO);
        }
        if (cpsValues.findIndex(k => k === row.serviceSO) === -1) {
          cpsValues.push(row.serviceSO);
        }
      });
      this.filtersService.qualFilters['servicePO'] = JSON.stringify(cpsValues);
    }
  }

  // API call for auto qual, create and move qualification API...
  autoCreateQualification(result, selectedLines) {
    const getSelectedRows = selectedLines;
    let payload: Object, isBulk: string;
    if (this.linelevelService.selectedAssetView.length && this.linelevelService.selectedAssetView[0] !== 'All' && !this.category && !this.assetID) {
      // for asset view only
      this.assetFilterPayload(getSelectedRows);
      isBulk = 'save-bulk-qual';
      payload = {
        'qualName': result.newQualificationName ? result.newQualificationName : null,
        'customerName': this.customerID,
        'approvalQual': this.isAccountMngr.approveQual,
        'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
        'action': result.qualification,
        'status': getSelectedRows[0].qualificationStatus ? getSelectedRows[0].qualificationStatus : null,
        'reason': getSelectedRows[0].reasonCode ? getSelectedRows[0].reasonCode : null,
        'subReason': getSelectedRows[0].subReasonCode ? getSelectedRows[0].subReasonCode : null,
        'comments': getSelectedRows[0].comments ? getSelectedRows[0].comments : null,
        'qualAttribute': getSelectedRows[0].qualReasonAttribute ? getSelectedRows[0].qualReasonAttribute : null,
        'qualAttributeVal': getSelectedRows[0].qualReasonAttributeValue ? getSelectedRows[0].qualReasonAttributeValue : null,
        'qualHashId': result.qObj ? result.qObj.qualificationHashId : null,
        'qualId': this.category !== '' ? this.category : null,
        'filters': this.filtersService.getQualFilterstoRest(),
        'filterJson': JSON.stringify(this.filtersService.getFilterJson()) ? JSON.stringify(this.filtersService.getFilterJson()) : null,
        'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
        'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
        'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
        'hasInstanceId': this.lookupService.hasColumn('instanceId'),
        'hasProduct': this.lookupService.hasColumn('productID'),
        'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
        'hasContractNo': this.lookupService.hasColumn('contractNumber')
      };
    } else {
      if (!this.ifAllRowsSelected) {
        isBulk = 'save-qualification';
        const qualLineArray = this.getQualLines(getSelectedRows);
        payload = {
          'qualName': result.newQualificationName ? result.newQualificationName : null,
          'customerName': this.customerID,
          'approvalQual': this.isAccountMngr.approveQual,
          'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
          'action': result.qualification,
          'qualLines': JSON.stringify(qualLineArray),
          'qualHashId': result.qObj ? result.qObj.qualificationHashId : null,
          'qualId': this.category !== '' ? this.category : null,
          'filterJson': JSON.stringify(this.filtersService.getFilterJson()) ? JSON.stringify(this.filtersService.getFilterJson()) : null
        };
      } else {
        // this is for bulk save qualification
        isBulk = 'save-bulk-qual';
        payload = {
          'qualName': result.newQualificationName ? result.newQualificationName : null,
          'customerName': this.customerID,
          'approvalQual': this.isAccountMngr.approveQual,
          'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
          'action': result.qualification,
          'status': getSelectedRows[0].qualificationStatus ? getSelectedRows[0].qualificationStatus : null,
          'reason': getSelectedRows[0].reasonCode ? getSelectedRows[0].reasonCode : null,
          'subReason': getSelectedRows[0].subReasonCode ? getSelectedRows[0].subReasonCode : null,
          'comments': getSelectedRows[0].comments ? getSelectedRows[0].comments : null,
          'qualAttribute': getSelectedRows[0].qualReasonAttribute ? getSelectedRows[0].qualReasonAttribute : null,
          'qualAttributeVal': getSelectedRows[0].qualReasonAttributeValue ? getSelectedRows[0].qualReasonAttributeValue : null,
          'qualHashId': result.qObj ? result.qObj.qualificationHashId : null,
          'qualId': this.category !== '' ? this.category : null,
          'filters': this.filtersService.getQualFilterstoRest(),
          'filterJson': JSON.stringify(this.filtersService.getFilterJson()) ? JSON.stringify(this.filtersService.getFilterJson()) : null,
          'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
          'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
          'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
          'hasInstanceId': this.lookupService.hasColumn('instanceId'),
          'hasProduct': this.lookupService.hasColumn('productID'),
          'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
          'hasContractNo': this.lookupService.hasColumn('contractNumber')
        };
      }
    }
    this.linelevelService.saveQualification(payload, isBulk)
      .subscribe(data => {
        this.loaderService.hide();
        this.selectedRows = [];
          this.selectedRowsCount = 0;
          this.disableUndo = true;
        if (data.qualId !== '-99999') {
          this.lineLevelData = [];
          this.tempQualId = data.qualId;
          this.activeQual = true;
          this.writebackDone = false;
          this.utilitiesService.setWritebackDone(false);
          this.resetLookUp();
          this.routerObj.navigate(['line-level', this.customerID, this.tempQualId, this.utilitiesService.getGlobalCustomerView()]);
        } else {
          // this.getLineLevelTabs();
          this.getTableData();
        }
      },
        error => {
          this.loaderService.hide();
        });
  }

  // save qualification modal
  openSaveQualificationModal() {
    const thisInstance = this;
    const modalRef = this.modalVar.open(SaveAsQualificationComponent, this.ngbModalOptions);
    modalRef.componentInstance.lineLevelTabsList = this.lineLevelTabs;
    modalRef.result.then((result) => {
      this.autoCreateQualification(result, this.selectedRows);
      thisInstance.filtersService.filtersUnsaved = false;
      setTimeout(() => {
        thisInstance.gridOptions.api.refreshCells();
      }, 0);
    }, (reason) => {
    });
  }

  // delete qualification tab modal
  openDeleteModal(i, q) {
    this.editTab = false;
    const modalRef = this.modalVar.open(DeleteQualificationComponent, this.ngbModalOptions);
    modalRef.componentInstance.deleteQual = q.qualificationName;
    modalRef.result.then((result) => {
      const getQual = this.utilitiesService.getQualification();
      const currentQual = (getQual === undefined) ? 'All' : getQual.qualificationName;
      const payload = {
        qualId: q.qualficationId,
        qualName: q.qualificationName
      };
      this.linelevelService.deleteQualification(payload)
        .subscribe(data => {
          this.loaderService.hide();
          this.copyLinkService.showMessage('Succesfully deleted ' + result + ' group.', false);
          // Goto all Tab, if selected tab deleted.
          if (q.qualificationName === currentQual) {
            this.goToAll();
          } else {
            this.getLineLevelTabs();
          }
        });
      // this.utilitiesService.adjustTabsHeight();
    }, (reason) => {
    });
  }

  // rename qualification modal
  openRenameModal(i, q) {
    this.editTab = false;
    const modalRef = this.modalVar.open(RenameQualificationComponent, this.ngbModalOptions);
    modalRef.componentInstance.renameQual = q.qualificationName;
    modalRef.result.then((result) => {
      const payload = {
        qualId: q.qualficationId,
        qualName: result.renamedQualification
      };
      this.linelevelService.renameQualification(payload)
        .subscribe(data => {
          this.loaderService.hide();
          this.copyLinkService.showMessage('Qualification renamed.', false);
          this.getLineLevelTabs();
        });
      // this.utilitiesService.adjustTabsHeight();
    }, (reason) => {
    });
  }

  // UnDo the operated lines...
  openUndoModal() {
    if (this.disableUndo) {
      return;
    }
    const ngbModalOptionsLocal = JSON.parse(JSON.stringify(this.ngbModalOptions));
    ngbModalOptionsLocal.windowClass = 'undoQual-modal';
    if (this.gridOptions.api.getSelectedRows().length > 10000) {
      const modalRef = this.modalVar.open(RollBackComponent, ngbModalOptionsLocal);
    } else {
      const modalRef = this.modalVar.open(UndoQualificationComponent, ngbModalOptionsLocal);
      modalRef.result.then((result) => {
        const allLines = this.gridOptions.api.getSelectedRows();
        const qualDetails = this.utilitiesService.getQualification();
        let payload: Object, isBulk: string;
        if (!this.ifAllRowsSelected) {
          const appLineArray = this.getQualPayload(allLines);
          isBulk = 'line-reset';
          payload = {
            'qualName': qualDetails ? qualDetails.qualificationName : null,
            'customerName': this.customerID,
            'globalCustomerView': this.globalType,
            'qualLines': JSON.stringify(appLineArray),
            'qualId': qualDetails ? qualDetails.qualificationHashId : null
          };
        } else {
          isBulk = 'line-bulk-reset';
          payload = {
            'qualName': qualDetails ? qualDetails.qualificationName : null,
            'customerName': this.customerID,
            'globalCustomerView': this.globalType,
            'qualId': qualDetails ? qualDetails.qualificationHashId : null,
            'filters': this.filtersService.getQualFilterstoRest(),
            'lookupBy': this.lookupService.lookupBy ? this.lookupService.lookupBy : null,
            'matchType': this.lookupService.lookupWith ? this.lookupService.lookupWith : '',
            'hasSerialNo': this.lookupService.hasColumn('serialNumber'),
            'hasInstanceId': this.lookupService.hasColumn('instanceId'),
            'hasProduct': this.lookupService.hasColumn('productID'),
            'hasInstallSite': this.lookupService.hasColumn('installSiteId'),
            'hasContractNo': this.lookupService.hasColumn('contractNumber'),
            'approvalQual': this.isAccountMngr.approveQual
          };
        }
        this.linelevelService.unDo(payload, isBulk)
        .subscribe(data => {
          this.loaderService.hide();
          if (data.status === 'Success') {
            // for hiding popup for non AM...
            if (this.category === '' && !this.userInfo.approveQual) {
              this.writebackDone = false;
              this.utilitiesService.setWritebackDone(false);
            }
            this.selectedRows = [];
            this.selectedRowsCount = 0;
            this.disableUndo = true;
            this.lineLevelData = [];
            this.getTableData();
            this.getQualificationApproval();
          }
        },
        error => {
          this.loaderService.hide();
        });
      }, (reason) => {
      });
    }
  }

  // show edit dropdown
  openEdit(i) {
    this.openEditList = i;
    this.editTab = !this.editTab;
    this.utilitiesService.positionQualEdit();
  }

  onClickedOutside(e: Event) {
    this.editTab = false;
  }

  saveAsQualActive() {
    if (this.filtersService.getFiltersCount(false) > 0) {
      return false;
    }
    return false;
  }

  // Setting column definition to update template
  getColumnArray(columnState, orignalColDefs) {
    columnState.map(cState => {
      orignalColDefs.map(oDef => {
        if (oDef.field === cState.colId) {
          oDef.hide = (cState.hide) ? true : false;
        } else if (oDef.children) {
          oDef.children.map(child => {
            if (child.field === cState.colId) {
              child.hide = (cState.hide) ? true : false;
            }
          });
        }
      });
    });
    return orignalColDefs;
  }

  // Processing right columns after left columns
  // to avoid being shown at the top in config table when rightside columns modified.
  sortTemp(columState, templateColumn) {
    const newCols = [];
    columState.map(cState => {
      templateColumn.map(cTemplate => {
        if (cTemplate.field === cState.colId) {
          newCols.push(cTemplate);
        }
        if (cTemplate.children) {
          cTemplate.children.map(child => {
            if (child.field === cState.colId) {
              if (cTemplate.isReordered !== true || cTemplate.isReordered === undefined) {
                cTemplate.isReordered = true;
                newCols.push(cTemplate);
              }
            }
          });
        }
      });
    });
    return newCols;
  }

  // drag and drop ordering of columns
  getColumnOrder(columState, templateColumn) {
    let newColumnTemplate = [];

    const lColumns = columState.filter((item, i) => {
      return (i === 0) ? false : item.pinned !== 'right';
    });
    const rColumns = columState.filter(item => item.pinned === 'right');

    const lCol = this.sortTemp(lColumns, templateColumn);
    const rCol = this.sortTemp(rColumns, templateColumn);

    newColumnTemplate = [...[templateColumn[0]], ...lCol, ...rCol];

    newColumnTemplate.filter(item => item.children)
      .map(item => {
        delete item.isReordered;
      });

    const updateChild = JSON.parse(JSON.stringify(newColumnTemplate));

    updateChild.filter(item => item.children)
      .map(item => {
        item.children = [];
      });

    // ordering of child columns
    columState.map(cState => {
      newColumnTemplate.map((curr, index) => {
        if (curr.children) {
          curr.children.map((cItem, cIndex) => {
            if (cItem.field === cState.colId) {
              updateChild[index].children.push(cItem);
            }
          });
        }
      });
    });
    return updateChild;
  }

  // Saving Template
  saveTemplate(event) {
    const columState = this.gridOptions.columnApi.getColumnState();
    const templateColumn = this.getColumnArray(columState, this.gridOptions.columnDefs);
    const sortedCol = this.getColumnOrder(columState, templateColumn);
    // if (this.isColUpdated) {
    const view = {
      name: event.activeTemplate,
      id: event.action === 'Create' ? null : event.activeTemplateId
    };
    const action = event.action;
    this.linelevelService.saveTemplate(view, sortedCol, this.columnHeaderList, action)
      .subscribe(data => {
        this.loaderService.hide();
        this.utilitiesService.setActiveTemp(view.name);
        this.template.resetActiveTemplate();
        this.isColUpdated = false;
      },
        error => {
          this.loaderService.hide();
        }
      );
    // }
  }

  // column info not retaining for new temlates created
  columnInfoRenderedForCustTemp(data) {
    data.map(item => {
      if (item.columnInfo) {
        item.headerValueGetter = this.columnInfoRendered;
      }
    });
    return data;
  }

  selectTemplate(t) {
    this.activeTemp = t.selectedTemplate.viewName ? t.selectedTemplate.viewName : 'Default Template';
    if (this.activeTemp === 'Default Template') {
      this.createColumnDefs();
    } else {
      this.linelevelService.getTemplateHeaders(t.selectedTemplate.viewId)
        .subscribe(data => {
          this.loaderService.hide();
          this.columnDefs = this.columnInfoRenderedForCustTemp(data.order);
          this.linelevelService.setColumnDefs(data.order);
        },
          error => {
            this.loaderService.hide();
          }
        );
    }
    this.gridOptions.api.redrawRows();
    this.gridOptions.api.refreshHeader();
    this.isColUpdated = false;
  }

  // US197163
  changeAssetView(selectedAsset) {
    this.linelevelService.activeAsset = selectedAsset;
    this.getSelectedAsset[0] = selectedAsset;
    if (this.getSelectedAsset.length > 0) {
      this.linelevelService.selectedAssetView = this.getSelectedAsset;
      this.navigateToAssetView(this.linelevelService.selectedAssetView[0]);
      this.isSummaryView = false;
      if (this.linelevelService.selectedAssetView[0] !== 'All') {
        this.isSummaryView = true;
      }
    }
  }

  // clearing lookup
  clearLookup() {
    this.lookupService.clearLookup()
      .subscribe(data => {
        this.loaderService.hide();
        if (data.status === 'Success') {
          // resetting all the lookup values
          this.lookupComplete = false;
          this.unidentifiedPercent = 0;
          this.writebackDone = false;
          this.lookupService.colCheckbox = [];
          this.lookupService.lookupBy = '';
          this.lookupService.lookupWith = '';
          this.lookupService.fileName = '';
          this.lookupService.excelData = [];
          this.lookupService.colRadio = '';
          this.updateLineCount();
          this.utilitiesService.setTableHeight();
          setTimeout(() => {
            this.gridOptions.api.redrawRows();
          }, 0);
          setTimeout(() => {
            this.gridOptions.api.refreshHeader();
          }, 0);
        }
      },
        error => {
          this.loaderService.hide();
        });
  }

  // calling it after clearing lookup
  updateLineCount() {
    this.updateHeader.getLineLevelHeaders();
    this.lineLevelData = [];
    if (this.category === '') {
      this.getLineLevelData(this.customerID, 'line-detail', this.offSet, this.customerID, false);
    } else {
      this.getLineLevelData(this.category, 'qual-line-details', this.offSet, this.customerID, false);
    }
  }

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(200).distinctUntilChanged()
      .merge(this.focus$)
      .merge(this.click$.filter(() => !this.instance.isPopupOpen()))
      .map(term => (term === '' ? this.contractListItems : this.contractListItems.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10))
  // .map(term => term === '' ? []
  //       : this.oppAccountData.filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10));

  clearInput() {
    this.searchText = '';
  }
}

// Utility function used to pad the date formatting.
function pad(num, totalStringSize) {
  let asString = num + '';
  while (asString.length < totalStringSize) {
    asString = '0' + asString;
  }
  return asString;
}
