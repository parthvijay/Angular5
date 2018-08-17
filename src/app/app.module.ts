import { LookupService } from './modal/lookup/lookup.service';
import { UnsavedChangesGuard } from './line-level/unsaved-changes.guard';
import { SiteLocationsService } from './site-locations/site-locations.service';
import { FiltersService } from './filters/filters.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { routes } from './app.router';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe, LowerCasePipe } from '@angular/common';
import { AppConfigModule } from './app-config';
import { fakeBackendProvider } from './helpers/index';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { BaseRequestOptions } from '@angular/http';

// ag-grid
import { AgGridModule } from 'ag-grid-angular/main';
import 'ag-grid-enterprise/main';

// application
import { AppComponent } from './app.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { SummaryComponent } from './summary/summary.component';
import { LineLevelComponent } from './line-level/line-level.component';

// grid
import { DateComponent } from './shared/ag-grid/date-component/date.component';
import { HeaderComponent } from './shared/ag-grid/header-component/header.component';
import { HeaderGroupComponent } from './shared/ag-grid/header-group-component/header-group.component';
import { DisqualifyComponent } from './modal/disqualify/disqualify.component';
import { FiltersComponent } from './filters/filters.component';
import { IntermediateSummaryComponent } from './intermediate-summary/intermediate-summary.component';
import { DeleteQualificationComponent } from './modal/delete-qualification/delete-qualification.component';
import { RenameQualificationComponent } from './modal/rename-qualification/rename-qualification.component';
import { ApproveDisapproveComponent } from './modal/approve-disapprove/approve-disapprove.component';

// services
import { HeaderService } from './shared/services/header.service';
import { DisqualifyPopupDropdownService } from './line-level/disqualify-popup-dropdown.service';
import { SummaryService } from './summary/summary.service';
import { IntermediateSummaryService } from './intermediate-summary/intermediate-summary.service';
import { LineLevelService } from './line-level/line-level.service';
import { UtilitiesService } from './shared/services/utilities.service';
import { RestApiService } from './shared/services/restAPI.service';
import { MainHeaderService } from './main-header/main-header.service';
import { SubHeaderService } from './shared/sub-header/sub-header.service';
import { QualifyDisqualifyService } from './modal/qualify-disqualify/qualify-disqualify.service';
import { ApproveDisapproveService } from './modal/approve-disapprove/approve-disapprove.service';
import { CopyLinkService } from './shared/copy-link/copy-link.service';
import { MultipleSelectService } from './shared/multiple-select/multiple-select.service';
import { EmailService } from './modal/email/email.service';
import { CreatePipelineDetailsService } from './create-pipeline/create-pipeline-details/create-pipeline-details.service';
import { ColorsService } from './create-pipeline/create-pipeline-details/chart/colors.service';
import { ChartUtilitiesService } from './create-pipeline/create-pipeline-details/chart/chart-utilities.service';
import { CreatePipelineService } from './create-pipeline/create-pipeline.service';
import { LookupComponent } from './modal/lookup/lookup.component';
import { QualifyDisqualifyComponent } from './modal/qualify-disqualify/qualify-disqualify.component';
import { TableHeightDirective } from './shared/directives/table-height.directive';
import { EmailComponent } from './modal/email/email.component';
import { MultipleSelectComponent } from './shared/multiple-select/multiple-select.component';
import { CopyLinkComponent } from './shared/copy-link/copy-link.component';
import { SubHeaderComponent } from './shared/sub-header/sub-header.component';
import { SaveAsQualificationComponent } from './modal/save-as-qualification/save-as-qualification.component';
import { RequestReportComponent } from './modal/request-report/request-report.component';
import { ElementFocusDirective } from './shared/directives/element-focus.directive';
import { FilterPipe } from './shared/filters/filter.pipe';

import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { ViewAppliedFiltersComponent } from './modal/view-applied-filters/view-applied-filters.component';
import { IonRangeSliderModule } from 'ng2-ion-range-slider';
import { SiteLocationsComponent } from './site-locations/site-locations.component';

import { AgmCoreModule } from '@agm/core';
import { UiSwitchModule } from '../../node_modules/angular2-ui-switch/src/index';
import { FiltersActionsComponent } from './filters/filters-actions/filters-actions.component';
import { ClickOutsideModule } from 'ng4-click-outside';

import { FileUploadModule } from 'ng2-file-upload';
import { UnidentifiedDataComponent } from './modal/lookup/unidentified-data/unidentified-data.component';
import { ConfirmLeaveComponent } from './modal/confirm-leave/confirm-leave.component';
import { ManageTemplateComponent } from './shared/manage-template/manage-template.component';
import { ManageTemplateService } from './shared/manage-template/manage-template.service';
import { EmailConfirmationComponent } from './modal/email-confirmation/email-confirmation.component';
import { ConfirmDisapprovalComponent } from './modal/confirm-disapproval/confirm-disapproval.component';
import { ConfirmDeletionComponent } from './modal/confirm-deletion/confirm-deletion.component';
import { AgGridService } from './shared/ag-grid/ag-grid.service';
import { ErrorComponent } from './error/error.component';
import { ExternalRedirectComponent } from './external-redirect/external-redirect.component';
import { LineCountComponent } from './modal/line-count/line-count.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { LoaderService } from './shared/loader/loader.service';
import { ErrorService } from './error/error.service';
import { ApiDispacherService } from './shared/services/apiDispacher.service';
import { CookieService } from 'ngx-cookie-service';
import { CreatePipelineDetailsComponent } from './create-pipeline/create-pipeline-details/create-pipeline-details.component';
import { CreatePipelineStepOneComponent } from './create-pipeline/create-pipeline-step-one/create-pipeline-step-one.component';
import { CreatePipelineStepTwoComponent } from './create-pipeline/create-pipeline-step-two/create-pipeline-step-two.component';
import { CreatePipelineStepThreeComponent } from './create-pipeline/create-pipeline-step-three/create-pipeline-step-three.component';
import { CreatePipelineSuccessComponent } from './create-pipeline/create-pipeline-success/create-pipeline-success.component';
import { CreatePipelineTechnologyAllComponent } from './create-pipeline/modal/create-pipeline-technology-all/create-pipeline-technology-all.component';
import { CreatePipelineTechnologyIbComponent } from './create-pipeline/modal/create-pipeline-technology-ib/create-pipeline-technology-ib.component';
import { CreatePipelineServiceAllComponent } from './create-pipeline/modal/create-pipeline-service-all/create-pipeline-service-all.component';
import { PieChartComponent } from './create-pipeline/create-pipeline-details/chart/pie-chart/pie-chart.component';
import { CreatePipelineStepTwoService } from './create-pipeline/create-pipeline-step-two/create-pipeline-step-two.service';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CreatePipelineContractsComponent } from './create-pipeline/modal/create-pipeline-contracts/create-pipeline-contracts.component';
import { CompetitiveDashboardComponent } from './modal/competitive-dashboard/competitive-dashboard.component';
import { UndoQualificationComponent } from './modal/undo-qualification/undo-qualification.component';
import { DropFiltersComponent } from './modal/drop-filters/drop-filters.component';
import { RequestAccessComponent } from './modal/request-access/request-access.component';
import { RollBackComponent } from './modal/roll-back/roll-back.component';
import { NotifyToAmComponent } from './modal/notify-to-am/notify-to-am.component';

@NgModule({
    imports: [
        BrowserModule,
        NgbModule.forRoot(),
        routes,
        HttpModule,
        FormsModule,
        AgGridModule.withComponents(
            [
                DateComponent,
                HeaderComponent,
                HeaderGroupComponent
            ]),
        AppConfigModule,
        MultiselectDropdownModule,
        IonRangeSliderModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyCqizQkCuqsUw2DwSqMQssN3RaJTcb3DFQ'
        }),
        UiSwitchModule,
        ClickOutsideModule,
        FileUploadModule,
        HttpClientModule
    ],
    declarations: [
        AppComponent,
        SummaryComponent,
        DateComponent,
        HeaderComponent,
        HeaderGroupComponent,
        MainHeaderComponent,
        LineLevelComponent,
        DisqualifyComponent,
        FiltersComponent,
        IntermediateSummaryComponent,
        LookupComponent,
        QualifyDisqualifyComponent,
        TableHeightDirective,
        EmailComponent,
        MultipleSelectComponent,
        CopyLinkComponent,
        SubHeaderComponent,
        SaveAsQualificationComponent,
        ElementFocusDirective,
        FilterPipe,
        DeleteQualificationComponent,
        RenameQualificationComponent,
        ViewAppliedFiltersComponent,
        SiteLocationsComponent,
        ApproveDisapproveComponent,
        FiltersActionsComponent,
        UnidentifiedDataComponent,
        ConfirmLeaveComponent,
        ManageTemplateComponent,
        EmailConfirmationComponent,
        ConfirmDisapprovalComponent,
        ConfirmDeletionComponent,
        ErrorComponent,
        ExternalRedirectComponent,
        RequestReportComponent,
        LineCountComponent,
        LoaderComponent,
        CreatePipelineDetailsComponent,
        CreatePipelineStepOneComponent,
        CreatePipelineStepTwoComponent,
        CreatePipelineStepThreeComponent,
        CreatePipelineSuccessComponent,
        CreatePipelineTechnologyAllComponent,
        CreatePipelineTechnologyIbComponent,
        CreatePipelineServiceAllComponent,
        PieChartComponent,
        CreatePipelineContractsComponent,
        CompetitiveDashboardComponent,
        UndoQualificationComponent,
        DropFiltersComponent,
        RequestAccessComponent,
        RollBackComponent,
        NotifyToAmComponent
    ],
    providers: [HeaderService, DisqualifyPopupDropdownService, SummaryService,
        IntermediateSummaryService, LineLevelService, UtilitiesService, MultipleSelectService,
        RestApiService, SubHeaderService, CurrencyPipe, DecimalPipe, LowerCasePipe, MainHeaderService, EmailService,
        // fakeBackendProvider,
        CopyLinkService, ErrorService, ApiDispacherService, CookieService, ColorsService, ChartUtilitiesService, CreatePipelineDetailsService, CreatePipelineService, CreatePipelineStepTwoService,
        MockBackend, BaseRequestOptions, FiltersService, QualifyDisqualifyService, ApproveDisapproveService, { provide: LocationStrategy, useClass: HashLocationStrategy }, SiteLocationsService, UnsavedChangesGuard, LookupService, ManageTemplateService, AgGridService, LoaderService],
    bootstrap: [AppComponent],
    entryComponents: [LookupComponent, QualifyDisqualifyComponent, EmailComponent,
        SaveAsQualificationComponent, DeleteQualificationComponent, RenameQualificationComponent, ViewAppliedFiltersComponent,
        ApproveDisapproveComponent, UnidentifiedDataComponent, ConfirmLeaveComponent, EmailConfirmationComponent,
        ConfirmDisapprovalComponent, ConfirmDeletionComponent, RequestReportComponent, LineCountComponent, CreatePipelineServiceAllComponent, CreatePipelineTechnologyAllComponent, CreatePipelineTechnologyIbComponent, CreatePipelineContractsComponent, CompetitiveDashboardComponent, UndoQualificationComponent, DropFiltersComponent, RequestAccessComponent, RollBackComponent, NotifyToAmComponent
    ]
})
export class AppModule {
}
