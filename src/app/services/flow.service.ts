import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class FlowService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key, type, page): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=myAccFlowList&key=' + key + '&type=' + type + '&page=' + page)
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
