import { UnsavedChangesGuard } from './line-level/unsaved-changes.guard';
import { SiteLocationsComponent } from './site-locations/site-locations.component';
// import modules necessary for routing
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { SummaryComponent } from './summary/summary.component';
import { LineLevelComponent } from './line-level/line-level.component';
import { IntermediateSummaryComponent } from './intermediate-summary/intermediate-summary.component';
import { ErrorComponent } from './error/error.component';
import { ExternalRedirectComponent } from './external-redirect/external-redirect.component';
import { CreatePipelineDetailsComponent } from './create-pipeline/create-pipeline-details/create-pipeline-details.component';
import { CreatePipelineStepOneComponent } from './create-pipeline/create-pipeline-step-one/create-pipeline-step-one.component';
import { CreatePipelineStepTwoComponent } from './create-pipeline/create-pipeline-step-two/create-pipeline-step-two.component';
import { CreatePipelineStepThreeComponent } from './create-pipeline/create-pipeline-step-three/create-pipeline-step-three.component';
import { CreatePipelineSuccessComponent } from './create-pipeline/create-pipeline-success/create-pipeline-success.component';


export const router: Routes = [
  {
    path: '',
    redirectTo: 'summary/N',
    pathMatch: 'full'
  },
  {
    path: 'summary/:global',
    component: SummaryComponent
  },
  {
    path: 'line-level/:customerID/:qualificationID/:global',
    component: LineLevelComponent,
    pathMatch: 'full',
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'line-level/:customerID/:qualificationID/:global/:assetType/:assetID',
    component: LineLevelComponent,
    pathMatch: 'full',
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: 'intermediate-summary/:customerID/:global',
    component: IntermediateSummaryComponent,
    pathMatch: 'full'
  },
  {
    path: 'site-locations/:customerID',
    component: SiteLocationsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-pipeline',
    component: CreatePipelineDetailsComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-pipeline/one/:tab/:subTab/:refId',
    component: CreatePipelineStepOneComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-pipeline/two/:tab/:subTab/:refId',
    component: CreatePipelineStepTwoComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-pipeline/three/:tab/:subTab/:refId',
    component: CreatePipelineStepThreeComponent,
    pathMatch: 'full'
  },
  {
    path: 'create-pipeline/success/:tab/:subTab/:refId',
    component: CreatePipelineSuccessComponent,
    pathMatch: 'full'
  },
  {
    path: 'error',
    component: ErrorComponent,
    pathMatch: 'full'
  },
  {
    path: 'external/analysis',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/sales/analysis/asset'
    }
  },
  {
    path: 'external/campaigns',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/sales/campaign/drs'
    }
  },
  {
    path: 'external/security',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/campaigns/securityRefresh'
    }
  },
  {
    path: 'external/collaborationRefresh',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/campaigns/collaborationRefresh'
    }
  },
  {
    path: 'external/ciscoOne',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/sales/campaign/ciscoOne'
    }
  },
  {
    path: 'external/secondChance',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/campaigns/secondChance'
    }
  },
  {
    path: 'external/explore',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/explore/app/#/main-view'
    }
  },
  {
    path: 'external/proxy',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/proxy-user'
    }
  },
  {
    path: 'external/signout',
    component: ExternalRedirectComponent,
    data: {
      externalUrl: window.location.origin + '/#/'
    }
  },
  {
    path: '**',
    redirectTo: 'summary/N'
  }
];

export const routes: ModuleWithProviders = RouterModule.forRoot(router);
