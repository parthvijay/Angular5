import { LookupService } from './../lookup.service';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs as importedSaveAs } from 'file-saver';
import { LoaderService } from '../../../shared/loader/loader.service';
import { CopyLinkService } from '../../../shared/copy-link/copy-link.service';

@Component({
  selector: 'app-unidentified-data',
  templateUrl: './unidentified-data.component.html',
  styleUrls: ['./unidentified-data.component.css']
})
export class UnidentifiedDataComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,
    public lookupService: LookupService,
    public loaderService: LoaderService,
    public copyLinkService: CopyLinkService
  ) { }

  ngOnInit() {
  }

  download() {
    this.lookupService.downloadList()
      .subscribe(res => {
        this.loaderService.hide();
        const splitFileName = this.lookupService.fileName.split('.');
        importedSaveAs(res, splitFileName[0] + '_unidentified.' + splitFileName[1]);
        this.copyLinkService.showMessage('Your list has been downloaded.', false);
        this.activeModal.close('Close click');
      });
  }

}
