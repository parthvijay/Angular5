import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

@Injectable()
export class QualifyDisqualifyService {

  constructor(private http: Http) { }

  // qualify reason codes
  getQualifyReasonCodes() {
    return this.http.get('assets/data/line-level/qualify-reason-code.json')
      .map(res => res.json());
  }

  // disqualify reason codes
  getDisqualifyReasonCodes() {
    return this.http.get('assets/data/line-level/disqualify-reason-code.json')
      .map(res => res.json());
  }

}
