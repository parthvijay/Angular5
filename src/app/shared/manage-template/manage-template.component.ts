import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDeletionComponent } from '../../modal/confirm-deletion/confirm-deletion.component';
import { ManageTemplateService } from './manage-template.service';
import { UtilitiesService } from './../services/utilities.service';
import { LoaderService } from '../loader/loader.service';

@Component({
  selector: 'app-manage-template',
  templateUrl: './manage-template.component.html',
  styleUrls: ['./manage-template.component.css']
})
export class ManageTemplateComponent implements OnInit {

  activeTemplate: string;
  activeTemplateId: string;
  createNew: any;
  templates = [];
  @Output() onNewEntryAdded = new EventEmitter();
  @Output() onTemplateSelect = new EventEmitter();

  constructor(public manageTemplateService: ManageTemplateService,
    private modalVar: NgbModal,
    private utilitiesService: UtilitiesService,
    public loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.activeTemplate = 'Default Template';
    this.resetActiveTemplate();
  }

  resetActiveTemplate() {
    this.activeTemplate = this.utilitiesService.getActiveTemp();
    if (this.activeTemplate === undefined) {
      this.activeTemplate = 'Default Template';
    } else {
      this.activeTemplate = this.utilitiesService.getActiveTemp();
    }
    this.templates = [];
    this.manageTemplateService.getTemplates()
      .subscribe(data => {
        // this.loaderService.hide();
        for (let index = 0; index < data.views.length; index++) {
          this.templates.push(data.views[index]);
        }
      }, (error) => {
        this.loaderService.hide();
        this.activeTemplate = 'Default Template';
        this.onTemplateSelect.emit({
          selectedTemplate: this.activeTemplate
        });
      });
  }

  selectTemplate(c) {
    this.activeTemplate = c.viewName ? c.viewName : c.name;
    this.activeTemplateId = c.viewId;
    this.createNew = '';
    this.manageTemplateService.templateChanged = false;
    this.onTemplateSelect.emit({
      selectedTemplate: c
    });
    this.utilitiesService.setActiveTemp(this.activeTemplate);
  }

  createTemplate() { }

  updateTemplate() { }

  saveTemplate() {
    const tempAction = this.createNew ? 'Create' : 'Update';
    const tempName = this.createNew.replace(/\s/g, '').search(/defaulttemplate/gi);
    const isDefault = (tempName === 0) ? true : false;
    let isUnique = true;
    if (tempAction === 'Update' && this.activeTemplate === 'Default Template' || isDefault) {
      isUnique = false;
    }
    if (this.templates.length !== 0) {
      for (const item of this.templates) {
        if (tempAction === 'Update' && item.viewName === this.activeTemplate) {
          this.activeTemplateId = item.viewId;
        } else if (tempAction === 'Create' && item.viewName === this.createNew) {
          isUnique = false;
        }
      }
    }
    if (isUnique) {
      this.onNewEntryAdded.emit({
        action: tempAction,
        activeTemplate: this.createNew ? this.createNew : this.activeTemplate,
        activeTemplateId: this.activeTemplateId
      });
      this.manageTemplateService.templateChanged = false;
      this.createNew = '';
    }
  }

  deleteTemplate(c) {
    const modalRef = this.modalVar.open(ConfirmDeletionComponent);
    modalRef.componentInstance.deleteTemp = c;
    modalRef.result.then((result) => {
      this.manageTemplateService.deleteTemplate(result.views)
        .subscribe(data => {
          this.loaderService.hide();
          this.templates = [];
          if (this.activeTemplate === c.viewName) {
            this.utilitiesService.setActiveTemp('Default Template');
            this.onTemplateSelect.emit({
              selectedTemplate: this.activeTemplate
            });
            this.resetActiveTemplate();
          } else {
            this.resetActiveTemplate();
          }
          this.manageTemplateService.templateChanged = false;
        }, error => {
          this.loaderService.hide();
        });
    }, (reason) => {
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

}
