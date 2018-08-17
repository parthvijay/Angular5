import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { LicenseManager } from 'ag-grid-enterprise/main';

// LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_for_Production_1Devs15_November_2017__MTUxMDcwNDAwMDAwMA==3c862d06679ff2da4f8d4ac677bff980');

LicenseManager.setLicenseKey('Intelligaia_Connected_Experience_1Devs10_November_2018__MTU0MTgwODAwMDAwMA==e1cd9ada2bc7a3572f5eac11c3a7bd09');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
