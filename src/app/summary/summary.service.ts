import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { UtilitiesService } from '../shared/services/utilities.service';
import { ApiDispacherService } from '../shared/services/apiDispacher.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of } from 'rxjs/observable/of';

@Injectable()
export class SummaryService {
  constructor(private http: Http,
    private utilitiesService: UtilitiesService,
    private apiDispatcherServ: ApiDispacherService,
    private httpClient: HttpClient
  ) {
  }

  getSummaryData(pLoad) {
    const payload = {
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'customerName': pLoad.customerName,
      'taskedCustomers': (pLoad.taskedCustomers) ? 'Y' : 'N',
      'nodeName': this.getSalesData(), // stringify array(getting it from user call)
      'offset': pLoad.offSet, // for pagination
      'amYorn': this.utilitiesService.userInfo.amYorn
    };
    return this.apiDispatcherServ.doAPICall('summary-view', 'POST', payload);
  }

  getSalesData() {
    const nodeData = [];
    let sales = this.utilitiesService.getUserInformation();
    sales = (sales === undefined) ? {} : sales.salesData;
    if (Object.keys(sales).length > 0 && sales.constructor === Object) {
      let salesItem = '';
      for (salesItem in sales) {}
      nodeData.push(sales[salesItem]);
    }
    return JSON.stringify(nodeData);
  }

  getCustomerCount(isSelected) {
    const payload = {
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'taskedCustomers': isSelected ? 'Y' : 'N',
      'amYorn': this.utilitiesService.userInfo.amYorn
    };
    return this.apiDispatcherServ.doAPICall('customer-count', 'POST', payload);
  }

  getTaskCount() {
    const payload = {
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N'
    };
    return this.apiDispatcherServ.doAPICall('task-count', 'POST', payload);
  }

  saveCustomerToMyTask(flagged: number, customerName: string) {
    const taskValue = (flagged === 1) ? 'ADD' : 'REMOVE';
    const payload = {
      'customerName': customerName,
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView(),
      'taskAction': taskValue
    };
    return this.apiDispatcherServ.doAPICall('save-task', 'POST', payload);
  }

  search(term: string) {
    if (term === '' || term.length <= 2) {
      return of([]);
    }
    const payload = {
      'globalCustomerView': this.utilitiesService.getGlobalCustomerView() ? this.utilitiesService.getGlobalCustomerView() : 'N',
      'nodeName' : this.getSalesData(), // stringified array(get it from user call)
      'searchStr' : term
    };
    return this.apiDispatcherServ.doAPICall('search-customer', 'POST', payload).map(response => response.customer);
  }

}
