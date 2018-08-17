import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-external-redirect',
  templateUrl: './external-redirect.component.html',
  styleUrls: ['./external-redirect.component.css']
})
export class ExternalRedirectComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route
      .data
      .subscribe(function (v) {
        window.open(v.externalUrl, '_self');
      });
  }

}
