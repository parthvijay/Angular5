import { Component, OnInit, Input } from '@angular/core';
import { CreatePipelineService } from '../../create-pipeline.service';
import { UtilitiesService } from '../../../shared/services/utilities.service';
import { NgbModal, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-pipeline-technology-all',
  templateUrl: './create-pipeline-technology-all.component.html',
  styleUrls: ['./create-pipeline-technology-all.component.css']
})
export class CreatePipelineTechnologyAllComponent implements OnInit {

  @Input() technologies;
  @Input() selectedTechnologies;
  select: any;
  expand: any;
  objectKeys = Object.keys;

  constructor(public activeModal: NgbActiveModal, private modalVar: NgbModal, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.select = this.allSelected(this.technologies);
    this.expand = this.allExpand(this.technologies);
    this.checkSelected();
   // console.log('techs: ' + this.technologies);
  }

  checkSelected() {
    const thisInstance = this;
    for (const key_1 in this.technologies) {
      if (this.technologies.hasOwnProperty(key_1)) {
        if (this.selectedTechnologies[key_1]) {

          if (this.technologies[key_1].options.length === this.selectedTechnologies[key_1].options.length) {
            this.technologies[key_1].selected = true;
          } else {
            this.technologies[key_1].selected = false;
          }

          this.technologies[key_1].options.forEach(value_2 => {
            const key_3 = thisInstance.utilitiesService.findKeyValue(this.selectedTechnologies[key_1].options, 'key', value_2.key);
            if (key_3 > -1) {
              value_2.selected = true;
            } else {
              value_2.selected = false;
            }
          });
        } else {
          this.technologies[key_1].selected = false;
          this.technologies[key_1].options.forEach(element => {
            element.selected = false;
          });
        }
      }
    }
  }

  expandAll = function () {
    this.expand = !this.expand;
    for (const key in this.technologies) {
      if (this.technologies.hasOwnProperty(key)) {
        this.technologies[key].showTechnologyOptions = this.expand;
      }
    }
  };

  selectAll = function () {
    this.select = !this.select;

    for (const key in this.technologies) {
      if (this.technologies.hasOwnProperty(key)) {
        this.technologies[key].selected = this.select;
        this.technologies[key].options.forEach(element => {
          element.selected = this.select;
        });
      }
    }

    if (this.select) {
      this.selectedTechnologies = this.technologies;
    } else {
      this.selectedTechnologies = {};
    }

  };

  allSelected(obj) {
    for (const o in obj) {
      if (!obj[o].selected) {
        return false;
      }
    }
    return true;
  }

  allExpand(obj) {
    for (const o in obj) {
      if (!obj[o].selected) {
        return false;
      }
    }
    return true;
  }

  setExpandBool(val) {
    val.showTechnologyOptions = !val.showTechnologyOptions;
    this.expand = this.allExpand(this.technologies);
  }

  pushItem = function (item, key, deepCopy) {
    if (this.selectedTechnologies[key] == null) {
      this.selectedTechnologies[key] = { 'selected': true, 'options': [] };
    }
    if (deepCopy) {
      this.technologies[key].selected = true;
      this.technologies[key]['options'].forEach(option => {
        option.selected = true;
      });
      this.selectedTechnologies[key] = item;
    } else {
      this.selectedTechnologies[key]['options'].push(item);
    }

  };

  remove(item, key, deepCopy) {
    if (deepCopy) {
      this.technologies[key].selected = false;
      this.technologies[key]['options'].forEach(option => {
        option.selected = false;
      });
      delete this.selectedTechnologies[key];
    } else {
      const index = this.selectedTechnologies[key]['options'].findIndex(function (x) {
        return x.key === item.key;
      });
      if (index > -1) {
        this.selectedTechnologies[key]['options'].splice(index, 1);
        if (this.selectedTechnologies[key]['options'].length === 0) {
          delete this.selectedTechnologies[key];
        }
      }
    }
    if (this.selectedTechnologies[key] == null) {
      this.technologies[key].selected = false;
    }
  }

  pushOrPopElement(item, key, deepCopy) {
    if (item.selected) {
      this.pushItem(item, key, deepCopy);
    } else {
      this.remove(item, key, deepCopy);
    }
    // var selectedOptions = $filter('filter')($scope.technologies[key].options, { selected: true });
    this.technologies[key].selected = false;
    // if (selectedOptions.length === $scope.technologies[key].options.length) {
    //   $scope.technologies[key].selected = true;
    // }
    this.select = this.allSelected(this.technologies);
  }

  saveTechnologies() {
    this.activeModal.close({
      selectedTech: this.selectedTechnologies
    });
  }

}
