import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from "./auth.service";

import {Config} from '../config';
import {formData} from '../utils/utils';

@Injectable({providedIn: 'root'})
export class AddressService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key, id?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=' + (id ? 'getMyAddr' : 'getMyAddrList') + '&key=' + key + '&id=' + (id ? id : ''))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  save(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=saveMyAddr', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  saveProdAddr(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=saveLuckyAddress', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  del(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=delMyAddr', body)
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
