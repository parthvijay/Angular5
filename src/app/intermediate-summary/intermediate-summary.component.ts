import { ViewAppliedFiltersComponent } from './../modal/view-applied-filters/view-applied-filters.component';
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
import { NotifyToAmComponent } from '../modal/notify-to-am/notify-to-am.component';

import { HeaderService } from '../shared/services/header.service';
import { UtilitiesService } from '../shared/services/utilities.service';
import { IntermediateSummaryService } from './intermediate-summary.service';
import { CopyLinkService } from '../shared/copy-link/copy-link.service';
import { AgGridService } from '../shared/ag-grid/ag-grid.service';
import { FiltersService } from '../filters/filters.service';
import { ErrorService } from './../error/error.service';
import { LoaderService } from './../shared/loader/loader.service';
import { CreatePipelineService } from '../create-pipeline/create-pipeline.service';

@Component({
    moduleId: module.id,
    selector: 'app-qualification-no-summary',
    templateUrl: './intermediate-summary.component.html',
    styleUrls: ['./intermediate-summary.component.css'],
    encapsulation: ViewEncapsulation.None
})

export class IntermediateSummaryComponent implements OnInit {
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
    pageName = 'intermediate-summary';
    mobWidth: any;
    dropdownsize = 25;
    emailData = [
        {
            'title': 'Customer Name',
            'value': ''
        },
        {
            'title': 'Qualification Name',
            'value': ''
        }
    ];
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };

    constructor(private router: Router,
        public headerService: HeaderService,
        private modalVar: NgbModal,
        public intermediateSummaryService: IntermediateSummaryService,
        private copyLinkService: CopyLinkService,
        private utilitiesService: UtilitiesService,
        private route: ActivatedRoute,
        public agGridService: AgGridService,
        public filterServ: FiltersService,
        public errorService: ErrorService,
        public loaderService: LoaderService,
        public createPipelineService: CreatePipelineService
    ) { }

    ngOnInit() {
        this.route.params.subscribe((params: ParamMap) => {
            this.customerID = params['customerID'];
            this.customerID = decodeURIComponent(this.customerID);
            if (params['global'] === 'Y') {
                this.utilitiesService.setGlobalCustomerView(true);
            }
        });
        this.getIntermediateSummaryData();
        this.setGridOptions();
        this.setColumnDefs();
    }

    getIntermediateSummaryData() {
        this.intermediateSummaryService.getIntermediateSummaryData(this.customerID)
            .subscribe(data => {
                this.loaderService.hide();
                this.interSummaryData = data.qualDetails;
                for (let i = 0; i < data.qualDetails.length; i++) {
                    let filterCount;
                    if (data.qualDetails[i].filters) {
                        if (data.qualDetails[i].filters.length <= 2) {
                            filterCount = this.filterServ.getFiltersCount(data.qualDetails[i].filters[1]);
                            this.interSummaryData[i].filtersApplied = filterCount;
                        } else {
                            filterCount = this.filterServ.getFiltersCount(data.qualDetails[i].filters);

                            this.interSummaryData[i].filtersApplied = filterCount;

                        }
                    }
                }
                this.gridOptions.api.setRowData(this.interSummaryData);
            },
            error => {
                this.loaderService.hide();
                if (error.status === 500 || error.status === 504 || error.status === 404) {
                    this.errorService.setErrorCode(error.status);
                    this.router.navigate(['/error']);
                }
            }
        );
    }

    setGridOptions() {
        this.gridOptions = <GridOptions>{};
        this.showGrid = true;
        this.gridOptions.dateComponentFramework = DateComponent;
        this.gridOptions.rowSelection = 'multiple';
        this.gridOptions.enableColResize = true;
        this.gridOptions.pagination = true;
        this.gridOptions.paginationPageSize = 25;
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
                headerName: 'Qualification ID',
                field: 'qualficationId', width: 130, minWidth: 60, suppressSorting: true,
                suppressMenu: true,
                filter: 'text',
                filterParams: {
                    cellHeight: 20
                }
            },
            {
                headerName: 'Name of Qualifications',
                field: 'qualificationName', suppressSorting: true,
                suppressMenu: true,
                cellRenderer: this.qualificationName,
                filterParams: { cellHeight: 20 }, width: 160, minWidth: 60
            },
            {
                headerName: 'Filters Applied',
                field: 'filtersApplied', suppressSorting: true,
                suppressMenu: true,
                filterParams: { cellHeight: 20 }, width: 80, minWidth: 60,
                cellRenderer: this.numberCellRendered
            },
            {
                headerName: 'Total Asset Value ($)',
                field: 'ibOpportunity', suppressSorting: true,
                suppressMenu: true,
                filterParams: { cellHeight: 20 }, width: 140, minWidth: 60,
                cellRenderer: function (params) {
                    return thisInstance.currencyFormat(params, thisInstance);
                },
                type: 'numericColumn'
            },
            {
                headerName: 'IB Opportunity Qualified / Disqualified / Pending (%)',
                field: 'ibOpportunityPercentage', suppressSorting: true,
                suppressMenu: true, width: 240,
                cellRenderer: function (params) {
                    return thisInstance.percentageBars(params, thisInstance);
                },
                filterParams: {
                    cellHeight: 25,
                    width: 280, minWidth: 60
                }
            },
            {
                headerName: 'Qualification Stage',
                field: 'qualificationStage', suppressSorting: true,
                suppressMenu: true,
                filterParams: { cellHeight: 20 }, width: 130, minWidth: 60,
                cellClassRules: {
                    'notstarted': function (params) { return params.value === 'Not Started'; },
                    'inprogress': function (params) { return params.value === 'In Progress'; },
                    'completed': function (params) { return params.value === 'Complete'; }
                }
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
                        filterParams: { cellHeight: 25 }, width: 130, minWidth: 60,
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
                        filterParams: { cellHeight: 25 }, width: 130, minWidth: 60,
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
                        filterParams: { cellHeight: 25 }, width: 130, minWidth: 60,
                        getQuickFilterText: function (params) { return null; }, // hide column from search
                        suppressMenu: true
                    }
                ],
                suppressMenu: true
            },
            {
                headerName: 'Action',
                cellRenderer: this.actionCellRenderer,
                children: [
                    {
                        headerName: '',
                        field: 'notifyAm',
                        suppressSorting: true,
                        filterParams: { cellHeight: 20 }, width: 220, minWidth: 60,
                        pinned: 'right',
                        cellRenderer: this.notifyCellRenderer
                    }
                ]
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
        // for column resize to fit window
        this.gridApi = params.api;
        this.gridColumnApi = params.columnApi;

        // for column resize to fit window
        this.mobWidth = (window.screen.width);
        if (this.mobWidth > 1600) {
            params.api.sizeColumnsToFit();
        }

        this.calculateRowCount();
    }

    private onCellClicked($event) {
        let link = '/line-level/';
        const customerName = encodeURIComponent(this.customerID);
        this.utilitiesService.setCustomerName(customerName);
        this.intermediateSummaryService.setQualification($event.data);
        if ($event.colDef.field === 'qualificationName') {
            this.router.navigate([link, customerName, $event.data.qualificationHashId, this.utilitiesService.getGlobalCustomerView()]);
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
                link = '/qualifications/app/#' + link + customerName + '/' + $event.data.qualificationHashId + '/' + this.utilitiesService.getGlobalCustomerView();
                this.copyLinkService.copyLink(link);
            }

        } else if ($event.colDef.field === 'notifyAm') {
            if ($event.data.enableActionURL === 'Y' && $event.data.userAction === 'Notify AM') {
                this.openNotifyToAmPopup($event);
            } else if ($event.data.enableActionURL === 'Y' && $event.data.userAction === 'Create Pipeline') {
                this.utilitiesService.setPipelineDetails($event.data);
                this.createPipelineService.setOpportunityName($event.data.qualificationName);
                this.router.navigate(['/create-pipeline']);
            }
        } else if ($event.colDef.field === 'filtersApplied') {
            for (const val of this.interSummaryData) {
                if ($event.data.qualficationId === val.qualficationId) {
                    if (val.filters && val.filtersApplied > 0) {
                        const ngbModalOptionsLocal = this.ngbModalOptions;
                        ngbModalOptionsLocal.windowClass = 'applied-filters-modal';
                        const modalRef = this.modalVar.open(ViewAppliedFiltersComponent, ngbModalOptionsLocal);
                        if (val.filters.length <= 2) {
                            modalRef.componentInstance.filters = val.filters[1];
                        } else {
                            modalRef.componentInstance.filters = val.filters;
                        }
                    } else {
                        return;
                    }
                }
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

    // open Notify to AM modal
    openNotifyToAmPopup(e) {
        const ngbModalOptionsLocal = this.ngbModalOptions;
        const modalRef = this.modalVar.open(NotifyToAmComponent, ngbModalOptionsLocal);
        modalRef.componentInstance.qualId = e.data.qualficationId;
        modalRef.componentInstance.view = this.utilitiesService.getGlobalCustomerView();
        modalRef.result.then((result) => {
            const selectedAm = [];
            result.selectedAm.forEach(ele => {
                selectedAm.push(ele.emailId + '@cisco.com');
            });
            const customerName = encodeURIComponent(this.customerID);
            const userName = this.utilitiesService.getUserInformation();
            const payload = {
                'qualificationHashId': e.data.qualificationHashId,
                'url': window.location.origin + '/qualifications/app/#/line-level/' + customerName + '/' + e.data.qualificationHashId + '/' + this.utilitiesService.getGlobalCustomerView(),
                'qualName': e.data.qualificationName,
                'customerName': this.customerID,
                'to': selectedAm.join(','),
                'oppAmount': e.data.ibOpportunity,
                'qualAmount': e.data.ibOpportunityPercentage.qualified,
                'disQualAmount': e.data.ibOpportunityPercentage.disqualified,
                'startedBy': e.data.startedById,
                'sender': userName.user.fullName
            };
            this.intermediateSummaryService.notifyAM(payload)
                .subscribe((data: any) => {
                    this.copyLinkService.showMessage('Notification has been sent to AM.', false);
                    this.interSummaryData = [];
                    this.getIntermediateSummaryData();
                    setTimeout(() => {
                        this.gridOptions.api.redrawRows();
                    }, 0);
                });
        }, (reason) => {
            // console.log(`Dismissed ${this.getDismissReason(reason)}`);
        });
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
        let enableLink = ' disabled';
        if (params.data && params.data.enableActionURL === 'Y') {
            enableLink = ' active';
        }
        return '<a href="javascript:" class="notifyAm' + enableLink + '">' + params.data.userAction + '</a>';
    }

    openEmailModal() {
        const modalRef = this.modalVar.open(EmailComponent, this.ngbModalOptions);
        modalRef.componentInstance.name = 'intermediate-summary';
        modalRef.componentInstance.emaildata = this.emailData;
    }

    // add link to Name of Qualifications column values
    qualificationName(params) {
        const nodeId = params.node.id;
        const val = params.value ? params.value : '';
        const anchor = `<a href="javascript:" id="nodeId` + nodeId + `">` + val + `</a>`;
        return anchor;
    }

}

