import { LookupService } from './lookup.service';
import { CopyLinkService } from '../../shared/copy-link/copy-link.service';
import { UtilitiesService } from './../../shared/services/utilities.service';
import { Component, OnInit, Input, AfterViewInit, ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { NgbTooltip, NgbTooltipConfig } from '@ng-bootstrap/ng-bootstrap';
import * as XLSX from 'xlsx';
import * as AWS from 'aws-sdk';
import { Observable } from 'rxjs/Observable';
import { LoaderService } from '../../shared/loader/loader.service';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.css']
})

export class LookupComponent implements OnInit, AfterViewInit {

  @ViewChild('t') public tooltip: NgbTooltip;
  @Input() name;
  @Input() tableData;
  hasBaseDropZoneOver = false;
  hasAnotherDropZoneOver = false;
  enableAWS = false;
  // allowedFileType = ['doc', 'html'];
  uploader: FileUploader = new FileUploader({ url: URL, isHTML5: true, disableMultipart: this.enableAWS });
  data: any = [];
  // colHeaders = [];
  allCols = [
    {
      'name': 'Serial Number/PAK Number',
      'field': 'serialNumber',
      'checked': false,
      'match': 0,
      'required': true
    },
    {
      'name': 'Instance ID',
      'field': 'instanceId',
      'checked': false,
      'match': 0,
      'required': true
    },
    {
      'name': 'Product ID',
      'field': 'productID',
      'checked': false,
      'match': 0,
      'required': false
    },
    {
      'name': 'Install Site ID',
      'field': 'installSiteId',
      'checked': false,
      'match': 0,
      'required': false
    },
    {
      'name': 'Contract Number',
      'field': 'contractNumber',
      'checked': false,
      'match': 0,
      'required': false
    }
  ];
  colRadio = '';
  unmatchedData = {
    productID: [],
    installSiteId: [],
    contractNumber: []
  };
  unidentifiedRows = 0;
  unidentifiedPercent = 0;
  fileFormatError = false;
  fileName = '';

  constructor(public activeModal: NgbActiveModal,
    public utilitiesService: UtilitiesService,
    public lookupService: LookupService,
    public loaderService: LoaderService,
    public copyLinkService: CopyLinkService,
    config: NgbTooltipConfig
  ) {
    config.placement = 'left';
  }

  ngOnInit() {
    // console.log(this.tableData);
  }

  ngAfterViewInit() {
    if (this.enableAWS) {
      this.uploader.onAfterAddingFile = (item => {
        const AWSService = AWS;
        const file = item._file;

        AWSService.config.accessKeyId = 'AKIAJ5BPXU6IE7HKKTXQ';
        AWSService.config.secretAccessKey = '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';
        AWSService.config.region = 'us-west-2';

        const s3 = new AWSService.S3({
          params: { Bucket: 'cis-qual' }
        });
        const params = { Bucket: 'cis-qual', Key: file.name, Body: file };

        s3.upload(params, function (err, data) {
          // console.log(err, data);
        });
      });
    }
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  dropped(evt: any) {
    this.processFile(evt[0]);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  onFileChange(evt: any) {
    const target: DataTransfer = <DataTransfer>(evt.target);
    this.processFile(target.files[0]);
    (<HTMLInputElement>document.getElementById('file')).value = '';
  }

  processFile(file) {
    const fileName = file.name;
    const idxDot = fileName.lastIndexOf('.') + 1;
    const extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
    this.fileFormatError = false;
    this.lookupService.fileName = fileName;
    if (['xls', 'xlsx'].indexOf(extFile) === -1) {
      this.uploader.queue.length = 0;
      this.fileFormatError = true;
      this.fileName = fileName;
      this.tooltip.open();
      setTimeout(function () {
        this.tooltip.close();
      }.bind(this), 10000);
      return;
    }

    this.data = [];
    // this.colHeaders = [];

    if (this.uploader.queue.length > 1) {
      this.uploader.queue.splice(0, 1); // clear old file & replace it with the new one
    }

    /* wire up file reader */
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
      // this.data[0].forEach(element => {
      //   this.colHeaders.push({ title: element });
      // });
      const checkNullData = this.data;
      for (let i = 1; i < checkNullData.length; i++) {
        for (let j = 0; j < checkNullData[0].length; j++) {
          const element = checkNullData[i][j];
          if (element === undefined) {
            checkNullData[i][j] = null;
          }
        }
      }
      this.data = checkNullData;
      this.runMatch();
    };
    reader.readAsBinaryString(file);
  }

  selectAll(value) {
    this.allCols.forEach(element => {
      if (!element.required) {
        element.checked = value;
      }
    });
    this.runMatch();
  }

  removeItem(item) {
    item.remove();
    this.data = [];
    // this.colHeaders = [];
  }

  isFormValid() {
    const checkedHeaders = this.allCols.filter(opt => opt.checked).map(opt => opt.name);
    if (this.colRadio && checkedHeaders.length && this.uploader.queue.length && (this.uploader.queue[0].isSuccess || true)) {
      return true;
    }
    return false;
  }

  runMatch() {
    this.lookupService.excelData = this.data;
    this.lookupService.tableData = this.tableData;
    this.lookupService.colRadio = this.colRadio;
    this.lookupService.colCheckbox = [];
    this.allCols.forEach(element => {
      if (element.checked) {
        this.lookupService.colCheckbox.push(element.field);
      }
    });
    // this.lookupService.matchData();
  }

  uploadFile () {
    const isValid: boolean = this.isFormValid();
    if (isValid) {
      this.lookupService.uploadFile()
        .subscribe(res => {
          this.loaderService.hide();
          this.lookupService.unidentifiedPercent = Object.values(res)[0];
          this.activeModal.close();
        },
        error => {
          this.loaderService.hide();
          if (error.status === 400) {
            const errBody = JSON.parse(error._body);
            this.copyLinkService.showMessage(errBody.error, true);
          }
        });
    }
  }

  setPrimary(c) {
    c.checked = true;
    this.colRadio = c.field;
    this.runMatch();
  }

}
