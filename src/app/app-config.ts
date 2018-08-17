import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';

export let APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export class AppConfig {
  env: any;
  apiDomain: any;
  labels: any;
}

const configJsonData = require('./data/config.json');
export const APP_DI_CONFIG: AppConfig = configJsonData;

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [{
    provide: APP_CONFIG,
    useValue: APP_DI_CONFIG
  }]
})

export class AppConfigModule { }
