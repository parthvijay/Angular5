import { Injectable } from '@angular/core';

@Injectable()
export class AgGridService {

  defaultColDef = {
    lockPinned: true
  };

  overlayNoRowsTemplate =
  '<div><span class="system-error"></span><span class="bigText">Please note the Line count needs to be <br/>2M or Less. You need to apply filters to <br/>reduce the Line count and View the <br/>Line Level details. </span>';

  overlayLoadingTemplate = '<div class="preloader ag-grid-loading"><div class="preloader-img"></div></div>';

  constructor() { }

}
