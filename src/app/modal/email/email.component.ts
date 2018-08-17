import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { UtilitiesService } from '../../shared/services/utilities.service';
import { EmailService } from './email.service';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';
import { IntermediateSummaryService } from './../../intermediate-summary/intermediate-summary.service';
import { EmailConfirmationComponent } from '../email-confirmation/email-confirmation.component';
import { LoaderService } from '../../shared/loader/loader.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.css']
})

export class EmailComponent implements OnInit {

  @Input() name;
  @Input() emaildata;
  public model: any;
  selectedEmails = [];
  suggestionsArr = [];
  messageDis: any;
  customerName: string;
  customerID: string;
  userInfo: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    private utilitiesService: UtilitiesService,
    private emailService: EmailService,
    private intermidiateService: IntermediateSummaryService,
    private loaderService: LoaderService) { }

  ngOnInit() {
    this.customerName = this.utilitiesService.getCustomerName();
    this.customerID = decodeURIComponent(this.customerName);
    this.userInfo = this.utilitiesService.getUserInformation();
    this.emaildata[0].value = this.customerID;
    if (this.emaildata.length === 2) {
      this.emaildata[1].value = this.intermidiateService.qualData.qualificationName;
    }
  }

  updateEmails(emails: Array<any>): void {
    this.selectedEmails = emails.slice();
  }

  clearEmails() {
    this.selectedEmails = [];
  }

  isFormValid() {
    return this.selectedEmails.length;
  }

  sendNotification() {
    this.modalVar.open(EmailConfirmationComponent, this.ngbModalOptions);
    this.activeModal.close();
  }

  commaSepratedUserNames(emailObj) {
    let userString = '';
    for (const userSelected of emailObj) {
      if (userString.length === 0) {
        userString = userString + userSelected.cec;
      } else {
        userString = userString + ',' + userSelected.cec;
      }
    }
    return userString;
  }

  sendEmail() {
    const nameString = this.commaSepratedUserNames(this.selectedEmails);
    // this is to send email from summary screen...Parth
    const url = window.location.hash.split('/');
    if (url[1] === 'summary') {
      const url_summary = window.location.origin + '/qualifications/app/#/line-level/' + this.customerName + '/All/' + this.utilitiesService.getGlobalCustomerView();
      const payload_summary = {
        customerName: this.customerID,
        url: url_summary,
        to: nameString,
        desc: this.messageDis,
        sender: this.userInfo.user.fullName
      };
      this.emailService.sendEmailFromSummary(payload_summary)
        .subscribe((data: any) => {
          this.loaderService.hide();
          this.sendNotification();
        });
    }

    // this is to send email from intermidiate summary screen...Parth
    if (url[1] === 'intermediate-summary') {
      const qualData = this.intermidiateService.getQualification();
      const url_qualification = window.location.origin + '/qualifications/app/#/line-level/' + this.customerName + '/'
        + qualData.qualificationHashId + '/' + this.utilitiesService.getGlobalCustomerView();
      const payload_qualification = {
        customerName: this.customerID,
        url: url_qualification,
        to: nameString,
        desc: this.messageDis,
        sender: this.userInfo.user.fullName,
        qualName: qualData.qualificationName
      };
      this.emailService.sendEmailFromQualification(payload_qualification)
        .subscribe((data: any) => {
          this.loaderService.hide();
          this.sendNotification();
        });
    }
  }

}
