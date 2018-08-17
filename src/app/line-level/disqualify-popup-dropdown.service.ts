import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DisqualifyPopupDropdownService {

  constructor(private http: Http) { }

  getGames() {
    return this.http.get('assets/data/disqualify-reason-code.json')
      .map(res => res.json());
  }

}
