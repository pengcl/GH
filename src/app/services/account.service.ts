import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData} from '../utils/utils';
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AccountService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  withdrawals(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=withdrawalsWallet', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  transfer(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=transferWall', body)
        .toPromise()
        .then(response => this.handleExpire(response))
        .catch(this.handleError);
  }

  getMyRecord(key, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getMyApplymentionData' + '&key=' + key + '&type=1' + '&page=' + (page || 1))
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
