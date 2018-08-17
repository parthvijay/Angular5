import { Component, OnInit, Input } from '@angular/core';
import { CreatePipelineService } from '../../create-pipeline.service';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UtilitiesService } from '../../../shared/services/utilities.service';

@Component({
  selector: 'app-create-pipeline-service-all',
  templateUrl: './create-pipeline-service-all.component.html',
  styleUrls: ['./create-pipeline-service-all.component.css']
})
export class CreatePipelineServiceAllComponent implements OnInit {
  @Input() services;
  @Input() selectedServices;
  select: any;
  objectKeys = Object.keys;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.select = this.allSelected(this.services);
  }

  pushOrPopElement(item, key) {
    if (item.selected) {
      this.pushItem(item, key);
    } else {
      this.remove(key);
    }
    this.select = this.allSelected(this.services);
  }

  remove(key) {
    delete this.selectedServices[key];
  }

  pushItem(item, key) {
    this.selectedServices[key] = item;
  }

  selectAll() {
    this.select = !this.select;
    for (const key in this.services) {
      if (this.services.hasOwnProperty(key)) {
        this.services[key].selected = this.select;
      }
    }
    if (this.select) {
      this.selectedServices = this.services;
    } else {
      this.selectedServices = {};
    }
  }

  allSelected(obj) {
    for (const o in obj) {
      if (!obj[o].selected) {
        return false;
      }
    }
    return true;
  }

  saveServices() {
    this.activeModal.close({
      selectedServ: this.selectedServices
    });
  }

}
