import { Component, OnInit } from '@angular/core';

import { CopyLinkService } from './copy-link.service';

@Component({
  selector: 'app-copy-link',
  templateUrl: './copy-link.component.html',
  styleUrls: ['./copy-link.component.css']
})
export class CopyLinkComponent implements OnInit {

  constructor(public copyLinkService: CopyLinkService) { }

  ngOnInit() {
  }

}
