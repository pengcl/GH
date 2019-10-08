import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData} from '../utils/utils';

import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class ShareService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key, id?): Promise<any> {
    let url = Config.prefix.wApi + '/interface/call.html?action=myShare&key=' + key;
    if (id) {
      url = Config.prefix.wApi + '/interface/call.html?action=shareDetail&key=' + key + '&id=' + id;
    }
    return this.http.get(url)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  save(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=saveShareInfo', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  add(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=replyInfo', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  like(key, id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=replyLike&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  reply(body) {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=replyInfo', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  give(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=shareGive&key=' + key)
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
