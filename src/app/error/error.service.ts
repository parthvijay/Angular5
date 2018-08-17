import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { APP_CONFIG, AppConfig } from '../app-config';

@Injectable()
export class ErrorService {

    errorCode: Number;

    constructor(private http: Http, @Inject(APP_CONFIG) private config: AppConfig, ) {
        const env = this.config.env;
        const apiDomain = this.config.apiDomain;
    }

    setErrorCode(status) {
        this.errorCode = status;
    }

    getErrorCode() {
        switch (this.errorCode) {
            case 504:
                return 'System is down for maintenance!';
            case 404:
                return 'No Data Available';
            case 500:
                return 'No Data Available';
            case 401:
                return `<span class="error-msg">No Access</span> <br>
                        <span class="grey-text">You are not authorized to view this page. </span> <br>
                        <span class="grey-text">For instructions on how to request access, please visit the Cisco SalesConnect Access Guide webpage. </span>
                        <a class="link-text" target="_blank" href="https://www.cisco.com/c/dam/en/us/products/se/2017/4/Collateral/Cisco_Ready_Access_Guide.pdf">Enrollment Guide</a>
                        <a target="_blank" href="https://salesconnect.cisco.com/c/r/salesconnect/index.html#/content-detail/b5e2cb9a-25f3-4f59-9ae2-8ba3fe1326f5" class="button filled-btn blue"><span>For additional information - go to SalesConnect</span></a>`;
        }
    }
}
