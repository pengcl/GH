import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData} from '../utils/utils';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class RechargeService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  recharge(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=recharge', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  find(key, page, row): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getMmRechargeMoney&key=' + key + '&page=' + page + '&row=' + row)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getPhones(key, phone): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getPhones&key=' + key + '&phone=' + phone)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  cancel(key, no): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=resetOfflineCharge&key=' + key + '&outTradeNo=' + no)
      .toPromise()
      .then(response => this.handleExpire(response))
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
