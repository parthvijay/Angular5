import { Injectable, Inject } from '@angular/core';
import { APP_CONFIG, AppConfig } from '../../app-config';

@Injectable()

export class RestApiService {
    public uriObj = {
        // Main Header APIs...
        'user': '/user',
        'bookmark': '/bookmarks?bookmarkType=favorite&limit=5',
        'search-customer': '/qual/searchCustomer',
        // Summary view APIs...
        'summary-view': '/qual/summaryView',
        'task-count': '/qual/taskCount',
        'customer-count': '/qual/customerCount',
        'save-task': '/qual/saveQualificationTask',
        'search-user': '/qual/searchUser?searchName=',
        'share-summary': '/qual/shareQual',
        'summary-view-global': '/qual/summaryView/global',
        // Intermidiate Qualification APIs...
        'qual-header': '/qual/header',
        'qual-line-header': '/qual/lineHeader',
        'qual-summary': '/qual/details',
        'list-AM': '/qual/amList',
        'notify-AM': '/qual/notifyAM',
        'share-qualification': '/qual/shareLineLevel',
        // Line Level APIs...
        'line-count': '/qual/lineCount',
        'customer-guid': '/qual/guid',
        'line-level-header': '/qual/custHeader',
        'line-detail': '/qual/custDetails',
        'qual-line-details': '/qual/lineDetails',
        'line-level-tab': '/qual/qualList',
        'approve-qualification': '/qual/approvalEligibilty',
        'request-lineLevel-report': '/reportCenter/lineLevelView/customerReport/qualifications',
        'cr-justification': '/email/crApproval',
        // Lookup APIs...
        'upload-file': '/qual/lookup',
        'download-list': '/qual/download',
        'clear-lookup': '/qual/delete/lookup',
        // Config Column APIs...
        'save-template': '/qual/saveQualView',
        'get-template': '/qual/views',
        'template-headers': '/qual/headerOrder',
        // Save Qualification APIs...
        'save-qualification': '/qual/line/saveQual',
        'qualify-disqualify': '/qual/line/qualifyDisQualify',
        'delete-qualification': '/qual/delete',
        'rename-qualification': '/qual/rename',
        // Save Qualification Bulk APIs...
        'save-bulk-qual': '/qual/bulk/saveQual',
        'bulk-qual-disqual': '/qual/bulk/qualifyDisQualify',
        // Approve Disapprove Qualification APIs...
        'approve-disapprove': '/qual/line/approveDisapprove',
        'approve-disapp-bulk': '/qual/bulk/approveDisapprove',
        'am-summary': '/qual/qualSummary',
        // UnDo Qualification APIs...
        'line-reset': '/qual/line/reset',
        'line-bulk-reset': '/qual/bulk/reset',
        // Filter APIs...
        'contract': '/qual/contract',
        'qualification': '/qual/qualDisQual',
        'year': '/qual/year',
        'partner': '/qual/partner',
        'product': '/qual/product',
        'installSite': '/qual/installSite',
        // Create Pipeline APIs...
        'pipeline-details': '/qual/pipelineDetails',
        'contract-list': '/qual/pipeline/contractDetails',
        'get-savId': '/qual/savIds',
        'generate-refId': '/qual/pipeline/refId',
        'pipeline-accounts': '/pipeline/accounts',
        'technology-Ib': '/qual/pipeline/technologiesByIB',
        'product-services': '/pipeline/productServices',
        // Asset Summary view APIs...
        'asset-summary-view': '/qual/summaryView/',
        'asset-lineCount': '/qual/summary/lineCount'
    };

    constructor( @Inject(APP_CONFIG) private config: AppConfig) {
        const env = this.config.env;
        const apiDomain = this.config.apiDomain;
    }

    getApiPath(path: string) {
        return this.config.apiDomain[this.config.env] + this.uriObj[path];
    }
}
