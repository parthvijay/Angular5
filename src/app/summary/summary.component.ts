import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule, NavigationExtras, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { HeaderGroupComponent } from '../shared/ag-grid/header-group-component/header-group.component';
import { DateComponent } from '../shared/ag-grid/date-component/date.component';
import { HeaderComponent } from '../shared/ag-grid/header-component/header.component';
import { EmailComponent } from '../modal/email/email.component';
import { CopyLinkComponent } from '../shared/copy-link/copy-link.component';

import { SummaryService } from './summary.service';
import { CopyLinkService } from '../shared/copy-link/copy-link.service';
import { FiltersService } from '../filters/filters.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { AgGridService } from '../shared/ag-grid/ag-grid.service';
import { ErrorService } from '../error/error.service';
import { LoaderService } from './../shared/loader/loader.service';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/merge';
import { HeaderService } from '../shared/services/header.service';

@Component({
    moduleId: module.id,
    selector: 'app-summary',
    templateUrl: 'summary.component.html',
    styleUrls: ['./summary.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class SummaryComponent implements OnInit {

    private gridOptions: GridOptions;
    public showGrid = true;
    public rowData: any[];
    private columnDefs: any[];
    public rowCount: string;
    public dateComponentFramework: DateComponent;
    public HeaderGroupComponent = HeaderGroupComponent;
    public fullScreen = false;
    public flagged = false;
    public bounced = false;
    public flagCount: number;
    summaryData = [];
    agGrid: any[];
    viewdata: string;
    dropdownsize = 25;
    searchInput: string;
    private gridApi;
    private gridColumnApi;
    globalView = this.utilitiesService.getGlobalCustomerView() === 'Y' ? true : false;
    mobWidth: any;
    emailData = [
        {
            'title': 'Customer Name',
            'value': ''
        }
    ];
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };
    offSet = 0;
    offSetLimit = 5000;
    customerCount: any;
    disableLoadMore = true;
    cName: '';
    searching = false;
    searchFailed = false;
    hideSearchingWhenUnsubscribed = new Observable(() => () => this.searching = false);

    searchCustomer = (text$: Observable<string>) =>
        text$
            .debounceTime(300)
            .distinctUntilChanged()
            .do(() => this.searching = true)
            .switchMap(term =>
                this.summaryService.search(term)
                    .do(() =>  {
                        this.loaderService.hide();
                        return this.searchFailed = false;
                    })
                    .catch(() => {
                        this.searchFailed = true;
                        return of([]);
                    }))
            .do(() => this.searching = false)
            .merge(this.hideSearchingWhenUnsubscribed)

    constructor(
        private modalVar: NgbModal,
        private router: Router,
        private route: ActivatedRoute,
        public summaryService: SummaryService,
        private copyLinkService: CopyLinkService,
        private utilitiesService: UtilitiesService,
        public agGridService: AgGridService,
        public filtersService: FiltersService,
        public errorService: ErrorService,
        public loaderService: LoaderService,
        public headerService: HeaderService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params: ParamMap) => {
            const isGlobal = params['global'];
            if (isGlobal === 'Y') {
                this.utilitiesService.setGlobalCustomerView(true);
                this.globalView = true;
            }
            this.router.navigate(['summary', this.utilitiesService.getGlobalCustomerView()]);
        });
        this.setGridOptions();
        this.setColumnDefs();
        this.getFlagCount();
        setTimeout(() => {
            this.getCustomerCount(this.flagged);
            this.getSummaryData();
        }, 3000);
    }

    // call for getting summary details
    getSummaryData() {
        const payload = {
            offSet: this.offSet,
            customerName: this.cName,
            taskedCustomers: this.flagged
        };
        if (this.flagged && this.flagCount === 0) {
            this.copyLinkService.showMessage('No Customer is added to My Tasks.', true);
            this.summaryData = [];
            this.gridOptions.api.setRowData(this.summaryData);
            // this.gridOptions.api.hideOverlay();
        } else {
            this.summaryService.getSummaryData(payload)
            .subscribe((data: any) => {
                this.loaderService.hide();
                if (this.summaryData.length === 0 && this.offSet === 0) {
                    this.summaryData = data.summaryView;
                } else {
                    data.summaryView.forEach(line => {
                      this.summaryData.push(line);
                    });
                }
                this.gridOptions.api.setRowData(this.summaryData);
                if (this.flagged) {
                    this.disableLoadMore = (this.flagCount > this.offSetLimit) ? false : true;
                } else if (this.cName) {
                    this.disableLoadMore = true;
                } else {
                    this.disableLoadMore = (this.customerCount > this.offSetLimit) ? false : true;
                }
                setTimeout(() => {
                    document.getElementById('openLoadPopoverSummary').click();
                }, 1000);
                setTimeout(() => {
                    document.getElementById('closeLoadPopoverSummary').click();
                }, 5000);
            },
            error => {
                this.loaderService.hide();
                if (error.status === 500 || error.status === 504) {
                    this.errorService.setErrorCode(error.status);
                    this.router.navigate(['/error']);
                } else if (error.status === 404) {
                    this.copyLinkService.showMessage('No Data Available for the selected customer.', true);
                }
            }
            );
        }
    }

    resetPayload() {
        this.summaryData = [];
        this.offSet = 0;
        this.cName = '';
        this.getSummaryData();
    }

    globalSwitchChange(checked) {
        this.utilitiesService.setGlobalCustomerView(checked);
        this.router.navigate(['summary', this.utilitiesService.getGlobalCustomerView()]);
        this.flagged = false;
        this.getFlagCount();
        this.resetPayload();
    }

    getCustomerCount(isSelected) {
        this.summaryService.getCustomerCount(isSelected).subscribe((data: any) => {
            this.customerCount = data.count;
        });
    }

    // call for getting flag count
    getFlagCount() {
        this.summaryService.getTaskCount()
            .subscribe((data: any) => {
                this.flagCount = data.count;
        });
    }

    setGridOptions() {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{};
        // this.gridOptions.groupSelectsChildren = true;
        this.gridOptions.dateComponentFramework = DateComponent;
        this.gridOptions.rowSelection = 'multiple';
        this.gridOptions.paginationPageSize = 25;
        this.gridOptions.enableColResize = true;
        this.gridOptions.pagination = true;
        this.gridOptions.suppressLoadingOverlay = false;
        // this.gridOptions.defaultColDef = {
        //     headerComponentFramework: <{ new(): HeaderComponent }>HeaderComponent,
        //     headerComponentParams: {
        //         menuIcon: 'fa-bars'
        //     }
        // };
        this.gridOptions.headerHeight = 23;
        this.gridOptions.enableSorting = true;
        this.gridOptions.enableFilter = true;
        this.gridOptions.sortingOrder = ['asc', 'desc'];
        this.gridOptions.suppressHorizontalScroll = false;
        this.gridOptions.toolPanelSuppressRowGroups = true;
        this.gridOptions.toolPanelSuppressValues = true;
        this.gridOptions.localeText = {
            pivotMode: 'Configure Column',
            next: '<span>Next <span class="pageRight"></span></span>',
            last: '<span class="icon-right-arrow-extreme"> >> </span>',
            first: '<span class="icon-left-arrow-extreme"> << </span>',
            previous: '<span> <span class="pageLeft"></span> Previous</span>'
        };
        this.gridOptions.suppressDragLeaveHidesColumns = true; // disable column removal after dragging out of table
        this.gridOptions.toolPanelSuppressSideButtons = true;
        this.gridOptions.toolPanelSuppressColumnFilter = true;
        this.gridOptions.toolPanelSuppressColumnSelectAll = true;
        this.gridOptions.toolPanelSuppressColumnExpandAll = true;
    }

    setColumnDefs() {
        const thisInstance = this;
        this.columnDefs = [
            {
                headerName: 'Customer Name',
                field: 'customerName', width: 200, minWidth: 60,
                filter: 'text',
                cellRenderer: this.customerCellRenderer,
                filterParams: {
                    cellRenderer: this.customerCellRenderer,
                    cellHeight: 25
                },
                suppressMenu: true
            },
            {
                headerName: '',
                field: 'flagged', suppressSorting: true, width: 30, minWidth: 30,
                // suppressSizeToFit: true,
                filter: 'number',
                cellRenderer: this.customerCellRendererFlag,
                filterParams: {
                    cellRenderer: this.customerCellRendererFlag,
                    cellHeight: 25
                },
                getQuickFilterText: function (params) { return null; }, // hide column from search
                suppressMenu: true
            },
            {
                headerName: '',
                field: 'actionShare',
                suppressSorting: true,
                cellClass: 'action-dropdown',
                filterParams: { cellHeight: 25 }, width: 30, minWidth: 30, maxWidth: 30,
                cellRenderer: function (params) {
                    return thisInstance.actionCellRenderer(params, thisInstance);
                },
                cellClassRules: {
                    'shareAction': function (params) { return params.value === 'Share'; }
                },
                suppressMenu: true
            },
            {
                headerName: 'Number of Qualifications',
                field: 'qualificationNumber',
                // suppressSorting: true, sort: 'asc',
                filterParams: { cellHeight: 25 }, width: 135, minWidth: 60,
                cellClassRules: {
                    'noData': function (params) { return params.value === '--'; }
                },
                cellRenderer: this.numberCellRendered,
                getQuickFilterText: function (params) { return null; }, // hide column from search
                suppressMenu: true
            },
            {
                headerName: 'Total Asset Value ($)',
                field: 'ibOpportunity',
                sort: 'desc',
                filterParams: { cellHeight: 25 }, width: 150, minWidth: 60,
                type: 'numericColumn',
                cellRenderer: function (params) {
                    return thisInstance.currencyFormat(params, thisInstance);
                },
                getQuickFilterText: function (params) { return null; }, // hide column from search
                suppressMenu: true
            },
            {
                headerName: 'IB Opportunity Qualified / Disqualified / Pending (%)',
                field: '', suppressSorting: true, width: 225, minWidth: 60,
                cellRenderer: function (params) {
                    return thisInstance.percentageBars(params, thisInstance);
                },
                filterParams: {
                    cellHeight: 25
                },
                getQuickFilterText: function (params) { return null; }, // hide column from search
                suppressMenu: true
            },
            {
                headerName: 'Qualification Stage',
                field: 'qualificationStage',
                // suppressSorting: true, sort: 'asc',
                filterParams: { cellHeight: 25 }, width: 130, minWidth: 60,
                cellClassRules: {
                    'notstarted': function (params) { return params.value === 'Not Started'; },
                    'inprogress': function (params) { return params.value === 'In Progress'; },
                    'completed': function (params) { return params.value === 'Complete'; }
                },
                filter: 'text',
                getQuickFilterText: function (params) { return null; }, // hide column from search
                suppressMenu: true
            },
            {
                headerName: 'Qualification',
                children: [
                    {
                        headerName: 'Date Started',
                        field: 'dateStarted', suppressSorting: true,
                        filterParams: { cellHeight: 25 }, width: 125, minWidth: 60,
                        type: 'numericColumn',
                        getQuickFilterText: function (params) { return null; }, // hide column from search
                        suppressMenu: true,
                        cellRenderer: function (params) {
                            return thisInstance.changeDateFormat(params, thisInstance);
                        }
                    },
                    {
                        headerName: 'Started By',
                        field: 'startedBy', suppressSorting: true,
                        filterParams: { cellHeight: 25 }, width: 100, minWidth: 60,
                        getQuickFilterText: function (params) { return null; }, // hide column from search
                        suppressMenu: true
                    }
                ],
                suppressMenu: true
            },
            {
                headerName: 'Qualification',
                children: [
                    {
                        headerName: 'Date Modified',
                        field: 'dateModified', suppressSorting: true,
                        filterParams: { cellHeight: 25 }, width: 128, minWidth: 60,
                        type: 'numericColumn',
                        getQuickFilterText: function (params) { return null; }, // hide column from search
                        suppressMenu: true,
                        cellRenderer: function (params) {
                            return thisInstance.changeDateFormat(params, thisInstance);
                        }
                    },
                    {
                        headerName: 'Modified By',
                        field: 'modifiedBy', suppressSorting: true,
                        filterParams: { cellHeight: 25 }, width: 115, minWidth: 60,
                        getQuickFilterText: function (params) { return null; }, // hide column from search
                        suppressMenu: true
                    }
                ],
                suppressMenu: true
            }
        ];
    }

    // changing date format (ex: 01-Jan-2018)
    changeDateFormat(params, thisInstance) {
        return thisInstance.utilitiesService.getFormattedDate(params.value);
    }

    // View dropdown feature in pagination
    onPageSizeChanged(newPageSize) {
        this.gridOptions.api.paginationSetPageSize(Number(newPageSize));
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
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // for column resize to fit window
        this.mobWidth = (window.screen.width);
        if (this.mobWidth > 1600) {
            params.api.sizeColumnsToFit();
        }

        this.calculateRowCount();
    }

    currencyFormat(params, thisInstance) {
        return thisInstance.utilitiesService.formatValue(params.value);
    }

    private onCellClicked($event) {
        const cName = encodeURIComponent($event.data.customerName);
        this.utilitiesService.setCustomerName(cName);
        this.utilitiesService.setActiveTemp('Default Template');
        const link = '/line-level/';
        if ($event.colDef.field === 'customerName' && $event.event.target.tagName === 'A') {
            this.filtersService.qualFilters = {};
            this.filtersService.filters = JSON.parse(JSON.stringify(this.filtersService.getDefaultFilters()));
            this.filtersService.applyFilters(this.filtersService.filters);
            this.router.navigate([link, cName, 'All', this.utilitiesService.getGlobalCustomerView()]);
        } else if ($event.colDef.field === 'flagged') {
            $event.data.flagged = $event.data.flagged ? 0 : 1;
            this.summaryService.saveCustomerToMyTask($event.data.flagged, $event.data.customerName)
                .subscribe((data: any) => {
                    if (data.status === 'Y') {
                        setTimeout(() => {
                            this.gridOptions.api.redrawRows({ rowNodes: [$event.node] });
                        }, 0);
                        this.getFlagCount();
                        if (!this.flagged) {
                            this.loaderService.hide();
                        }
                    }
                    if (this.flagged) {
                        if (this.flagCount === 1) {
                            this.summaryData = [];
                            this.gridOptions.api.setRowData(this.summaryData);
                            // this.gridOptions.api.hideOverlay();
                            this.loaderService.hide();
                        } else {
                            this.resetPayload();
                        }
                    }
                }, error => {
                    this.loaderService.hide();
                });
        } else if ($event.colDef.field === 'qualificationNumber' && $event.value) {
            this.router.navigate(['/intermediate-summary/', cName, this.utilitiesService.getGlobalCustomerView()]);
        } else if ($event.colDef.field === 'sites' && $event.value) {
            // if ($event.data.customerName !== undefined) {
            //     this.router.navigate(['/site-locations/' + cName]);
            // } else {
            //     this.router.navigate(['/site-locations/12456787']);
            // }
        } else if ($event.colDef.field === 'actionShare') {
            const dropdownClass = $event.event.target.classList.value;

            const isStartQual = dropdownClass.search('startQual');
            if (isStartQual > -1 || this.utilitiesService.currentShareActive.action === 'qual') {
                this.router.navigate([link, cName, 'All', this.utilitiesService.getGlobalCustomerView()]);
            }

            // email share popup
            const isEmailShare = dropdownClass.search('emailShare');
            if (isEmailShare > -1 || this.utilitiesService.currentShareActive.action === 'email') {
                this.openEmailModal();
            }

            // copy link feature
            const copyLink = dropdownClass.search('copyLink');
            if (copyLink > -1 || this.utilitiesService.currentShareActive.action === 'copy') {
                const copiedLink: string = '/qualifications/app/#/line-level/' + cName + '/All/' + this.utilitiesService.getGlobalCustomerView();
                this.copyLinkService.copyLink(copiedLink);
            }

            // const isRequestReport = dropdownClass.search('requestReport');
            // if (isRequestReport > -1 || this.utilitiesService.currentShareActive.action === 'report') {
            //     this.copyLinkService.showMessage('Your request for report generation has been successfully submitted.', false);
            // }
        }
        return;
    }

    customerCellRenderer(params) {
        const val = params.value ? params.value : '';
        const anchor = '<a href="javascript:">' + val + '</a>';
        return anchor;
    }

    customerCellRendererFlag(params) {
        const flagged = params.data && params.data.flagged ? 'selected' : '';
        const flaggedCheck = params.data && params.data.flagged ? '-checked' : '';
        let flag = `
        <div class="tooltip-custom">
        <span class='iconFlagWrap ` + flagged + `'><i class='icon-flag` + flaggedCheck + `'></i>
        `;
        if (flagged) {
            flag += `
        <span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Remove this item from My Tasks</span>
        `;
        } else {
            flag += `
            <span class="tooltiptext tooltip-right"><span class="arrow-right"></span>Add this item to My Tasks</span>
            `;
        }

        flag += `
        </span></div>
        `;
        return flag;
    }

    toggleFlaggedRows(flagVal) {
        this.flagged = !this.flagged;
        this.bounced = true;
        this.resetPayload();
    }

    // center align cell data
    numberCellRendered(params) {
        const val = params.value ? '<a href="javascript:">' + params.value + '</a>' : '--';
        return '<div class="text-center">' + val + '</div>';
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

    public quickFilterChanged() {
        // this.gridOptions.api.setQuickFilter(this.searchInput);
        // setTimeout(() => {
        //     this.gridOptions.api.redrawRows();
        // }, 0);
    }

    clearInput() {
        this.searchInput = '';
        this.flagged = false;
        this.resetPayload();
        this.quickFilterChanged();
    }

    // here we use one generic event to handle all the column type events.
    // the method just prints the event name
    private onColumnEvent($event) {
        // console.log('onColumnEvent: ' + $event);
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

    getBooleanValue(cssSelector) {
        return document.querySelector(cssSelector).checked === true;
    }

    // export table data to CSV
    exportToCsv() {
        const params = {
            fileName: 'line-level',
            columnSeparator: ';'
        };
        this.gridOptions.api.exportDataAsCsv(params);
    }

    // export table data to Excel
    exportToExcel() {
        const params = {
            fileName: 'line-level',
            columnGroups: true
        };
        this.gridOptions.api.exportDataAsExcel(params);
    }

    actionCellRenderer(params, thisInstance) {
        const val = '<span class=\'ico-dropdown\'></span>';
        let flag = '';
        if (params.data && params.data.action === 'Start Qualification') {
            // flag = 'Start Qualification';
            flag += '<div class=\'shareDiv row-action-div\'><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li><a class=\'dropdown-item startQual\' href=\'javascript:\'><span class=\'icon-email\'></span> Start Qualification</a></li></ul></div></div>';
        } else {
            // flag = 'Share';
            flag += '<div class=\'shareDiv row-action-div\'><div class=\'dropdown-menu\' aria-labelledby=\'mainDropdown\'><span class=\'icon-arrow-up\'><span class=\'path1\'></span><span class=\'path2\'></span></span><ul><li><a class=\'dropdown-item emailShare\' href=\'javascript:\'><span class=\'icon-email\'></span> Email</a></li><li><a class=\'dropdown-item copyLink\' href=\'javascript:\'><span class=\'icon-link\'></span> Copy Link</a></li></ul></div></div>';
        }
        return val + '  ' + flag;
    }

    itemSelected($event) {
        this.gridOptions.api.setQuickFilter($event.item.customerName);
    }

    openEmailModal() {
        const modalRef = this.modalVar.open(EmailComponent, this.ngbModalOptions);
        modalRef.componentInstance.name = 'summary';
        modalRef.componentInstance.emaildata = this.emailData;
    }

    showGridOverlay() {
        this.gridApi.showNoRowsOverlay();
    }

    hideGridOverlay() {
        this.gridApi.hideOverlay();
    }

    loadMore() {
        const rowCount = this.summaryData.length;
        if (rowCount <= this.offSetLimit) {
            this.offSet = this.offSet + 5000;
            this.offSetLimit = this.offSetLimit + 5000;
            this.getSummaryData();
        }
    }

    customerSelection($event) {
        this.cName = $event.item;
        this.summaryData = [];
        this.getSummaryData();
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
