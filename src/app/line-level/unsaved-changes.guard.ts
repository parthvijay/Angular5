import { ConfirmLeaveComponent } from '../modal/confirm-leave/confirm-leave.component';
import { LineLevelComponent } from './line-level.component';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { NgbModal, ModalDismissReasons, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ManageTemplateService } from '../shared/manage-template/manage-template.service';
import { FiltersService } from '../filters/filters.service';

@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<LineLevelComponent> {

  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  constructor(private modalVar: NgbModal, public manageTemplateService: ManageTemplateService, public filtersService: FiltersService) { }

  canDeactivate(component: LineLevelComponent) {
    if (component.writebackDone || this.manageTemplateService.templateChanged || this.filtersService.filtersUnsaved) {
      const subject = new Subject<boolean>();
      const modal = this.modalVar.open(ConfirmLeaveComponent, this.ngbModalOptions);
      modal.componentInstance.subject = subject;
      let message = '';
      if (component.writebackDone) {
        message = 'Please save the Write backs as Qualification Name and notify the AM to request approval so that the Write Backs are committed otherwise they will be lost.';
      } else if (this.manageTemplateService.templateChanged) {
        message = 'You are navigating out, please make sure the changes are saved to a template or they\'ll be lost.';
      } else if (this.filtersService.filtersUnsaved) {
        message = 'Please note the filters applied have not been saved. Click Save as Qualification button to save them otherwise they will be lost.';
      }
      modal.componentInstance.message = message;
      modal.result.then((result) => {
        if (result.callTabs === false) {
          component.getLineLevelTabs();
        }
      });
      return subject.asObservable();
    }
    return true;
  }
}
