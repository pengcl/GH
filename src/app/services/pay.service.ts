import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData} from '../utils/utils';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class PayService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(type, key?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getPayTypes' + '&consumeType=' + type + '&key=' + (key || ''))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  customPay(body): Promise<any> {
    return this.http.post(body.action, formData(body))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  pay(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=pay', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  listener(key, orderNo): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getOrderInfo&key=' + key + '&orderNo=' + orderNo)
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
