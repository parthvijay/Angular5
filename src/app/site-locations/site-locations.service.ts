import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class SiteLocationsService {

  constructor(private http: Http) { }

  // get data
  getSiteLocationsData() {
    return this.http.get('assets/data/site-locations.json')
      .map(res => res.json());
  }

}
