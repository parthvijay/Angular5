import { Directive, ElementRef, Input, SimpleChanges, OnInit, OnChanges } from '@angular/core';
import { UtilitiesService } from '../services/utilities.service';

@Directive({
  selector: '[appTableHeight]'
})
export class TableHeightDirective implements OnInit, OnChanges {

  @Input() fullScreen: string;

  constructor(public utilitiesService: UtilitiesService) {
  }

  ngOnInit() {
    this.utilitiesService.setTableHeight();
  }

  ngOnChanges() {
    const thisInstance = this;
    thisInstance.utilitiesService.setTableHeight();
  }

}
