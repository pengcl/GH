import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData} from '../utils/utils';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class TradeService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key, type, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=myTradeList&key=' + key + '&type=' + type + '&page=' + page)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getDetail(key, id, type): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=myTradeDetail&key=' + key + '&type=' + type + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getShoppingList(key, page): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=myShoppingList&key=' + key + '&page=' + page)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getLogistics(key, id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=orderLogisticsDetail&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  returnInfo(key, id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=recoveryGoodsPre&key=' + key + '&id=' + id)
        .toPromise()
        .then(response => this.handleExpire(response))
        .catch(this.handleError);
  }
  sysReturn(key, id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=recoveryGoods&key=' + key + '&id=' + id)
        .toPromise()
        .then(response => this.handleExpire(response))
        .catch(this.handleError);
  }

  confirmReceipt(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=saveConfirmReceipt', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleExpire(response: any): Promise<any> {
    if (response.code === '1001') {
      this.authSvc.requestAuth();
      return Promise.resolve(response);
    } else {
      return Promise.resolve(response);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
