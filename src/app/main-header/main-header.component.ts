import { Component, NgModule, OnInit, Inject, AfterViewInit, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HeaderService } from '../shared/services/header.service';
import { MainHeaderService } from './main-header.service';
import { UtilitiesService } from './../shared/services/utilities.service';
import { LoaderService } from './../shared/loader/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { ErrorService } from '../error/error.service';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from './../app-config';
import { LineLevelService } from '../line-level/line-level.service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CompetitiveDashboardComponent } from '../modal/competitive-dashboard/competitive-dashboard.component';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.css']
})

export class MainHeaderComponent implements OnInit, AfterViewInit {
  userInfo: any = { user: {} };
  favoriteBookmarks: any;
  appDetails: any;
  isProxy = false;
  admin: string;
  redirectLink: any;
  isSFDC = true;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(
    public headerService: HeaderService,
    private mainHeader: MainHeaderService,
    private utilityService: UtilitiesService,
    public loaderService: LoaderService,
    private cookieService: CookieService,
    public errorService: ErrorService,
    public lineLevelService: LineLevelService,
    private router: Router,
    @Inject(DOCUMENT) private document,
    @Inject(APP_CONFIG) private config: AppConfig,
    private elementRef: ElementRef,
    private modalVar: NgbModal
  ) {
    const hasProxy = window.localStorage.getItem('proxy');
    if (hasProxy !== null) {
      this.isProxy = true;
      this.admin = JSON.parse(window.localStorage.getItem('proxy-admin'));
    }
    this.isSFDC = window.location !== window.parent.location;
  }
  ngAfterViewInit() {
    let walkMeCdn: string;
    if (this.config.env === 4) { // stage
      walkMeCdn = 'https://cdn.walkme.com/users/48b7950668df48868543ae1092766f49/test/walkme_48b7950668df48868543ae1092766f49_https.js';
    } else if (this.config.env === 5) { // prod
      walkMeCdn = 'https://cdn.walkme.com/users/48b7950668df48868543ae1092766f49/walkme_48b7950668df48868543ae1092766f49_https.js';
    }
    const walkme = this.document.createElement('script');
    walkme.type = 'text/javascript';
    walkme.async = true;
    walkme.src = walkMeCdn;
    this.elementRef.nativeElement.appendChild(walkme);
    (<any>window)._walkmeConfig = { smartLoad: true };
  }

  ngOnInit() {
    this.getUserDetails();
    // this.getFavoriteBookamrks();
    this.getAppDetails();
  }

  walkme() {
    (<any>window).WalkMePlayerAPI.toggleMenu();
  }

  openAnalysis(tab) {
    switch (tab) {
      case 'Analysis':
        window.location.href = window.location.origin + '/#/sales/analysis/asset';
        // window.open(window.location.origin + '/#/sales/analysis/asset', '_self');
        break;
      case 'Campaigns':
        window.open(window.location.origin + '/#/sales/campaign/drs', '_self');
        break;
      case 'Security':
        window.open(window.location.origin + '/#/campaigns/securityRefresh', '_self');
        break;
      case 'collaborationRefresh':
        window.open(window.location.origin + '/#/campaigns/collaborationRefresh', '_self');
        break;
      case 'ciscoOne':
        window.open(window.location.origin + '/#/sales/campaign/ciscoOne', '_self');
        break;
      case 'proxy':
        window.open(window.location.origin + '/#/proxy-user', '_self');
        break;
    }
  }

  getUserDetails() {
    this.mainHeader.getUserDetails()
      .subscribe(data => {
        this.loaderService.hide();
        this.userInfo = data;
        this.utilityService.setUserInformation(this.userInfo);
      }, error => {
        this.loaderService.hide();
        if (error.status === 401) {
          this.errorService.setErrorCode(error.status);
          this.router.navigate(['/error']);
        }
      });
  }

  // get favorite bookmarks call here
  getFavoriteBookamrks() {
    this.mainHeader.getFavoriteBookamrks()
      .subscribe((data: any) => {
        this.loaderService.hide();
        this.favoriteBookmarks = data.bookmarks;
      }, error => {
        this.loaderService.hide();
      });
  }

  applyBk(bookmark) {
    const url = window.location.origin + bookmark.urlDetails.appUrl;
    this.router.navigate([url]);
  }

  // get app details
  getAppDetails() {
    this.mainHeader.getAppDetails()
      .subscribe((data: any) => {
        this.appDetails = data.app;
      });
  }

  // signout a user from Q&C
  logout() {
    this.cookieService.delete('ObSSOCookie', '/', '.cisco.com');
    this.clearLocalStorage();
    window.location.reload();
  }

  removeProxy() {
    this.clearLocalStorage();
    this.isProxy = false;
    window.location.reload();
  }

  clearLocalStorage() {
    window.localStorage.removeItem('proxy');
    window.localStorage.removeItem('proxy-admin');
  }

  // redirect to link
  viewLink(n, p) {
    if (p === '') {
      return;
    }
    if (n === 'SFDC Competitive Dashboard') {
      const ngbModalOptionsLocal = this.ngbModalOptions;
      ngbModalOptionsLocal.windowClass = 'competitive-dashboard-modal';
      const modalRef = this.modalVar.open(CompetitiveDashboardComponent, ngbModalOptionsLocal);
      modalRef.componentInstance.redirectLink = p;
    } else if (n === 'Services Leadership Dashboard') {
      const win = window.open(p, '_self');
    } else {
      const win = window.open(p, '_blank');
      win.focus();
    }
  }



}
