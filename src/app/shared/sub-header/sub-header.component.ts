import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { HeaderService } from '../services/header.service';
import { SubHeaderService } from './sub-header.service';
import { UtilitiesService } from '../services/utilities.service';
import { ErrorService } from './../../error/error.service';
import { LoaderService } from '../loader/loader.service';
import { CookieService } from 'ngx-cookie-service';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { RequestAccessComponent } from '../../modal/request-access/request-access.component';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css']
})
export class SubHeaderComponent implements OnInit {

  @Input() pageName;
  @Input() metadata;
  @Output() headerInfo = new EventEmitter();
  @Input() totalQualification;
  customersList: any;
  lineLevelSubHeader: any = {};
  intermediateSubHeader: any = {};
  amSubHeader: any = {};
  customerName: string;
  customerID;
  qID: string;
  qualificationName: string;
  manageLocation: boolean;
  isGlobal = this.utilitiesService.getGlobalCustomerView();
  category: string;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  isAccessRequested = true;
  canManageLocation = true;

  constructor(private router: Router,
    public headerService: HeaderService,
    public subheaderService: SubHeaderService,
    private route: ActivatedRoute,
    private utilitiesService: UtilitiesService,
    public errorService: ErrorService,
    public loaderService: LoaderService,
    public cookieService: CookieService,
    private modalVar: NgbModal
  ) { }

  viewMore() {
    this.router.navigate(['']);
  }

  ngOnInit() {
    this.route.params.subscribe((params: ParamMap) => {
      this.customerID = params['customerID'];
      this.isGlobal = params['global'];
      this.customerID = decodeURIComponent(this.customerID);
      this.qID = params['qualificationID'];
      if (this.pageName === 'line-level') {
        this.getLineLevelHeaders();
        if (this.isGlobal === 'Y') {
          this.manageLocation = true;
        }
      }
    });
    if (this.pageName === 'intermediate-summary') {
      this.getQualificationHeaders();
    }
    if (this.isGlobal === 'Y' && this.pageName === 'line-level') {
      this.canManageLocation = false;
    }
  }

  getQualificationHeaders() {
    this.subheaderService.getQualHeader(this.customerID)
      .subscribe((data: any) => {
        this.loaderService.hide();
        this.customerName = data.customerName;
        this.utilitiesService.setCustomerName(data.customerName);
        this.metadata = [
          {
            'title': 'Total Asset Value ($)',
            'value': this.utilitiesService.formatValue(data.ibOpportunity)
          },
          {
            'title': 'Number of Qualifications',
            'value': data.qualificationNumber
          }
        ];
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

  getLineLevelHeaders() {
    if (this.isGlobal === 'Y') {
      setTimeout(() => {
        const payload = {
          'userID': this.utilitiesService.getUserInformation().user.userId,
          'sourceSys': 'QnC'
        };
        this.subheaderService.checkManageAccess(payload)
          .subscribe((data: any) => {
            if (data.access === 'Y') {
              this.canManageLocation = true;
              this.isAccessRequested = true;
            } else {
              if (window.localStorage.getItem('proxy') !== null) {
                this.isAccessRequested = true;
              } else {
                this.isAccessRequested = false;
              }
            }
          });
      }, 4000);
    }
    if (this.qID === 'All') {
      this.subheaderService.getLineLevelSubHeader(this.customerID, 'line-level-header', undefined)
        .subscribe((data: any) => {
          this.loaderService.hide();
          this.headerInfo.emit({
            headerInfo: data
          });
          this.customerName = data.customerName;
          this.utilitiesService.setCustomerName(data.customerName);
          this.utilitiesService.setLineHeaderDetails(data);
          this.metadata = [
            {
              'title': 'Total Asset Value ($)',
              'value': this.utilitiesService.formatValue(data.ibOpportunity)
            },
            {
              'title': 'Total Sites',
              'value': data.totalSites
            },
            {
              'title': 'Line Count',
              'value': this.utilitiesService.formatNumber(data.lineCount)
            },
            {
              'title': 'Network Collection (%)',
              'value': data.networkCollection
            }
          ];
        },
        error => {
          this.loaderService.hide();
          if (error.status === 500 || error.status === 504 || error.status === 404) {
            this.errorService.setErrorCode(error.status);
            // this.router.navigate(['/error']);
          }
        }
      );
    } else {
      this.subheaderService.getLineLevelSubHeader(this.qID, 'qual-line-header', this.customerID)
        .subscribe((data: any) => {
          this.loaderService.hide();
          this.headerInfo.emit({
            headerInfo: data
          });
          this.qualificationName = data.qualName;
          this.customerName = data.customerName;
          this.utilitiesService.setCustomerName(data.customerName);
          this.utilitiesService.setLineHeaderDetails(data);
          this.metadata = [
            {
              'title': 'Total Asset Value ($)',
              'value': this.utilitiesService.formatValue(data.ibOpportunity)
            },
            {
              'title': 'Total Sites',
              'value': data.totalSites
            },
            {
              'title': 'Line Count',
              'value': this.utilitiesService.formatNumber(data.lineCount)
            },
            {
              'title': 'Network Collection (%)',
              'value': data.networkCollection
            }
          ];
        },
        error => {
          this.loaderService.hide();
          if (error.status === 500 || error.status === 504 || error.status === 404) {
            this.errorService.setErrorCode(error.status);
          }
        }
      );
    }
  }

  manage() {
    if (!this.canManageLocation) {
      return;
    } else {
      this.subheaderService.getCustomerGUID(this.customerID)
      .subscribe((res: any) => {
        const payload = { userID: this.utilitiesService.getUserInformation().user.userId.toUpperCase(), guID: res.guid, appName: 'QnC', punchBackURL: window.location.href };
        this.subheaderService.punchOutToCR(payload)
          .subscribe((data: any) => {
            window.localStorage.setItem('globalCustomer', 'Y');
            window.open(data.redirectUrl, '_self');
          });
      });
    }
  }

  getSiteLocationsHeader() {
    this.subheaderService.getQualHeader(this.customerID)
      .subscribe((data: any) => {
        this.customerName = data.customerName;
      });
  }

  // get selected customer name
  getSelectedCustomer(c) {
    this.customerName = c;
  }

  // request access modal
  requestAccess() {
    const ngbModalOptionsLocal = this.ngbModalOptions;
    ngbModalOptionsLocal.windowClass = 'requestAccessModal';
    const modalRef = this.modalVar.open(RequestAccessComponent, ngbModalOptionsLocal);
    modalRef.result.then((result) => {
      const payload = {
        'sender': this.utilitiesService.getUserInformation().user.userId,
        'content': result.text
      };
      this.subheaderService.sendCRApprovalEmail(payload)
      .subscribe((data: any) => {
        this.loaderService.hide();
      });
    }, (reason) => {
    });
  }

}
