import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageTemplateService } from '../../shared/manage-template/manage-template.service';
import { FiltersService } from '../../filters/filters.service';
import { LookupService } from '../../modal/lookup/lookup.service';
import { UtilitiesService } from '../../shared/services/utilities.service';

@Component({
  selector: 'app-confirm-leave',
  templateUrl: './confirm-leave.component.html',
  styleUrls: ['./confirm-leave.component.css']
})
export class ConfirmLeaveComponent {

  subject: Subject<boolean>;
  message: any;

  constructor(
    public activeModal: NgbActiveModal,
    private modalVar: NgbModal,
    public manageTemplateService: ManageTemplateService,
    public filtersService: FiltersService,
    private lookupService: LookupService,
    private utilitiesService: UtilitiesService,
  ) { }

  closeModal(value: boolean) {
    if (value) {
      this.manageTemplateService.templateChanged = false;
      this.filtersService.filtersUnsaved = false;
      this.resetLookupService();
      this.utilitiesService.setWritebackDone(false);
    }
    this.activeModal.close({
      'callTabs': value
    });
    this.subject.next(value);
    this.subject.complete();
  }

  resetLookupService() {
    this.lookupService.colCheckbox = [];
    this.lookupService.lookupBy = '';
    this.lookupService.lookupWith = '';
    this.lookupService.fileName = '';
    this.lookupService.excelData = [];
    this.lookupService.colRadio = '';

    // resetting qualification in utility service
    if (this.utilitiesService.getQualification() !== undefined) {
      this.utilitiesService.setQualification(undefined);
    }
  }
}
