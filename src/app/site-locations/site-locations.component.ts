import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { HeaderGroupComponent } from '../shared/ag-grid/header-group-component/header-group.component';
import { DateComponent } from '../shared/ag-grid/date-component/date.component';
import { HeaderComponent } from '../shared/ag-grid/header-component/header.component';
import { EmailComponent } from '../modal/email/email.component';
import { CopyLinkComponent } from '../shared/copy-link/copy-link.component';
import { SubHeaderComponent } from '../shared/sub-header/sub-header.component';

import { HeaderService } from '../shared/services/header.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { SiteLocationsService } from './site-locations.service';
import { CopyLinkService } from '../shared/copy-link/copy-link.service';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { AgGridService } from '../shared/ag-grid/ag-grid.service';

@Component({
  selector: 'app-site-locations',
  templateUrl: './site-locations.component.html',
  styleUrls: ['./site-locations.component.css']
})
export class SiteLocationsComponent implements OnInit {

  enableLink: string;
  private gridOptions: GridOptions;
  public showGrid: boolean;
  public rowData: any[];
  private columnDefs: any[];
  public rowCount: string;
  public dateComponentFramework: DateComponent;
  public HeaderGroupComponent = HeaderGroupComponent;
  interSummaryData: any;
  private gridApi;
  private gridColumnApi;
  customerID: any;
  pageName = 'site-locations';
  metadata = [
    {
      'title': 'Total Asset Value ($)',
      'value': '$871,506.50'
    },
    {
      'title': 'Number of Sites',
      'value': '200'
    },
    {
      'title': 'Number of Sites with IB',
      'value': '102'
    },
    {
      'title': 'Qualifications Stage',
      'value': 'In Progress'
    }
  ];
  mySettings: IMultiSelectSettings;
  myTexts: IMultiSelectTexts;
  sitesFilterOptions: IMultiSelectOption[];
  sitesFilter = ['Sites with IB'];
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(private router: Router,
    public headerService: HeaderService,
    private modalVar: NgbModal,
    public siteLocationsService: SiteLocationsService,
    private copyLinkService: CopyLinkService,
    private utilitiesService: UtilitiesService,
    private route: ActivatedRoute,
    public agGridService: AgGridService
  ) {
  }

  ngOnInit() {
    this.getIntermediateSummaryData();
    this.setGridOptions();
    this.setColumnDefs();

    this.route.params.subscribe((params: ParamMap) => {
      this.customerID = params['customerID'];
      // console.log(this.customerID);
    });


    this.mySettings = {
      selectionLimit: 1,
      autoUnselect: true,
      closeOnSelect: true
    };
    this.myTexts = {
      defaultTitle: ''
    };
    this.sitesFilterOptions = [
      {
        'id': 'Sites with IB',
        'name': 'Sites with IB'
      },
      {
        'id': 'All Sites',
        'name': 'All Sites'
      }
    ];
  }

  onSitesDropdownChange(selected) {
    const val = this.sitesFilter[0];
    if (val === 'Sites with IB') {
      const filterComponent = this.gridOptions.api.getFilterInstance('ibOpportunity');
      filterComponent.setModel({
        type: 'greaterThan',
        filter: 0,
        filterTo: null
      });
      this.gridOptions.api.onFilterChanged();
    } else {
      this.gridOptions.api.destroyFilter('ibOpportunity');
    }
    setTimeout(() => {
      this.gridOptions.api.redrawRows();
    }, 0);
  }

  getIntermediateSummaryData() {
    this.siteLocationsService.getSiteLocationsData()
      .subscribe(data => {
        this.interSummaryData = data;
        this.gridOptions.api.setRowData(this.interSummaryData);
        this.onSitesDropdownChange('');
      });
  }

  setGridOptions() {
    this.gridOptions = <GridOptions>{};
    this.showGrid = true;
    this.gridOptions.dateComponentFramework = DateComponent;
    this.gridOptions.rowSelection = 'multiple';
    this.gridOptions.paginationPageSize = 25;
    this.gridOptions.enableColResize = true;
    this.gridOptions.pagination = true;
    // this.gridOptions.groupSelectsChildren = true;
    // this.gridOptions.defaultColDef = {
    //     headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
    //     headerComponentParams: {
    //         menuIcon: 'fa-bars'
    //     }
    // };
    this.gridOptions.headerHeight = 23;
    this.gridOptions.suppressHorizontalScroll = false;
    this.gridOptions.showToolPanel = false;
    this.gridOptions.toolPanelSuppressRowGroups = true;
    this.gridOptions.toolPanelSuppressValues = true;
    this.gridOptions.suppressDragLeaveHidesColumns = true; // disable column removal after dragging out of table
    this.gridOptions.localeText = {
      next: '<span>Next <span class="pageRight"></span></span>',
      last: '<span class="icon-right-arrow-extreme"> >> </span>',
      first: '<span class="icon-left-arrow-extreme"> << </span>',
      previous: '<span> <span class="pageLeft"></span> Previous</span>'
    };
    this.gridOptions.toolPanelSuppressSideButtons = true;
    this.gridOptions.toolPanelSuppressColumnFilter = true;
    this.gridOptions.toolPanelSuppressColumnSelectAll = true;
    this.gridOptions.toolPanelSuppressColumnExpandAll = true;
  }

  setColumnDefs() {
    const thisInstance = this;
    this.columnDefs = [
      {
        headerName: '', suppressSorting: true,
        suppressMenu: true, pinned: 'left', width: 30, minWidth: 30,
        cellClass: 'rowNumber',
        cellRenderer: function ($event) {
          // tslint:disable-next-line:radix
          return '' + (parseInt($event.rowIndex) + 1);
        }
      },
      {
        headerName: 'Site Name',
        field: 'siteName',
        sort: 'asc',
        suppressMenu: true,
        cellRenderer: this.qualificationName,
        filterParams: { cellHeight: 20 }, width: 140, minWidth: 60
      },
      {
        headerName: 'Address',
        headerClass: 'addressGroup',
        children: [
          {
            headerName: 'Street Name',
            headerClass: 'addressSubGroup',
            field: 'streetName', suppressSorting: true,
            filterParams: { cellHeight: 25 }, width: 125, minWidth: 60,
            suppressMenu: true
          },
          {
            headerName: 'City',
            headerClass: 'addressSubGroup',
            field: 'city', suppressSorting: true,
            filterParams: { cellHeight: 25 }, width: 125, minWidth: 60,
            suppressMenu: true
          },
          {
            headerName: 'State',
            headerClass: 'addressSubGroup',
            field: 'state', suppressSorting: true,
            filterParams: { cellHeight: 25 }, width: 125, minWidth: 60,
            suppressMenu: true
          },
          {
            headerName: 'Country',
            headerClass: 'addressSubGroup',
            field: 'country', suppressSorting: true,
            filterParams: { cellHeight: 25 }, width: 125, minWidth: 60,
            suppressMenu: true
          }
        ],
        suppressMenu: true
      },
      {
        headerName: 'IB Opportunity Qualified / Disqualified / Pending (%)',
        field: 'ibOpportunityPercentage', suppressSorting: true,
        suppressMenu: true,
        cellRenderer: function (params) {
          return thisInstance.percentageBars(params, thisInstance);
        },
        filterParams: {
          cellHeight: 25,
          width: 280, minWidth: 60
        }
      },
      {
        headerName: 'Total Asset Value ($)',
        field: 'ibOpportunity', suppressSorting: true,
        suppressMenu: true,
        filterParams: { cellHeight: 20 }, width: 140, minWidth: 60,
        cellRenderer: function (params) {
          return thisInstance.currencyFormat(params, thisInstance);
        },
        type: 'numericColumn',
        filter: 'number'
      },
      {
        headerName: 'Number of Contracts',
        field: 'contracts', suppressSorting: true,
        suppressMenu: true,
        filterParams: { cellHeight: 20 }, width: 80, minWidth: 60,
        cellRenderer: this.numberCellRendered
      }
    ];
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
    this.calculateRowCount();
  }

  private onReady(params) {
    // for column resize to fit window
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    this.calculateRowCount();
  }

  private onCellClicked($event) {
    let link = '/line-level/';
    if ($event.data.customerId !== 'undefined') {
      link = link + 'AMAZON';
    }

    if ($event.colDef.field === 'siteName') {
      this.router.navigate([link]);
    } else if ($event.colDef.field === 'actionShare') {

      // email share popup
      const dropdownClass = $event.event.target.classList.value;
      const isEmailShare = dropdownClass.search('emailShare');
      if (isEmailShare > -1 || this.utilitiesService.currentShareActive.action === 'email') {
        this.openEmailModal();
      }

      // copy link feature
      const copyLink = dropdownClass.search('copyLink');
      if (copyLink > -1 || this.utilitiesService.currentShareActive.action === 'copy') {
        this.copyLinkService.copyLink(link);
      }

    } else if ($event.colDef.field === 'notifyAm') {

      // notification for Notify to AM
      const activeClass = $event.event.target.classList.value;
      const notifyLink = activeClass.search('notifyAm active');
      if (notifyLink > -1) {
        this.copyLinkService.showMessage('Notification has been sent to AM.', false);

        // change Qualification Stage
        $event.data.qualificationStage = 'Approval Pending';
        setTimeout(() => {
          this.gridOptions.api.refreshCells();
        }, 0);
      }
    }
  }

  private onCellValueChanged($event) {
    // console.log('onCellValueChanged: ' + $event.oldValue + ' to ' + $event.newValue);
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
  }

  private onSelectionChanged() {
    // console.log('selectionChanged');
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

  private onVirtualRowRemoved($event) {
    // because this event gets fired LOTS of times, we don't print it to the
    // console. if you want to see it, just uncomment out this line
    // console.log('onVirtualRowRemoved: ' + $event.rowIndex);
  }

  private onRowClicked($event) {
    // console.log('onRowClicked: ' + $event.node.data.name);
  }

  public onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  // here we use one generic event to handle all the column type events.
  // the method just prints the event name
  private onColumnEvent($event) {
    // console.log('onColumnEvent: ' + $event);
  }

  // center align cell data
  numberCellRendered(params) {
    if (params.value) {
      return '<div class="text-center">' + params.value + '</div>';
    }
  }

  currencyFormat(params, thisInstance) {
    return thisInstance.utilitiesService.formatValue(params.value);
  }

  // create percentage bars
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

  // data and dropdown menu in Action column
  actionCellRenderer(params) {
    let val;
    let flag = '';
    if (params.data && params.data.qualificationStage === 'Not Started') {
      val = 'Start Qualification';
    } else {
      val = 'Share';
      flag = '<div class=\'shareDiv\'><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li><a class=\'dropdown-item emailShare\' href=\'javascript:\'><span class=\'icon-email\'></span> Email</a></li><li><a class=\'dropdown-item copyLink\' href=\'javascript:\'><span class=\'icon-link\'></span> Copy Link</a></li></ul></div></div>';
    }
    return val + '  ' + flag;
  }

  // notify sub-column under Action column
  notifyCellRenderer(params) {
    let enableLink = '';
    let notifyToAm = 'Notify to AM';
    if (params.data && params.data.qualificationStage === 'Complete') {
      enableLink = ' active';
    }
    if (params.data.qualficationId === 63611312) { // change check for Approved status with API
      notifyToAm = 'Approved';
    } else if (params.data.qualficationId === 53611312) { // change check for Dispproved status with API
      notifyToAm = 'Dispproved';
    }
    return '<a href="javascript:" class="notifyAm' + enableLink + '">' + notifyToAm + '</a>';
  }

  openEmailModal() {
    const modalRef = this.modalVar.open(EmailComponent, this.ngbModalOptions);
    modalRef.componentInstance.name = 'World New';
  }

  // add link to Name of Qualifications column values
  qualificationName(params) {
    const nodeId = params.node.id;
    const val = params.value ? params.value : '';
    // const anchor = '<a>' + val + '</a>';
    const anchor = `<a href="javascript:" id="nodeId` + nodeId + `">` + val + `</a>`;
    return anchor;
  }

}
