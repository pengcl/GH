import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from "../auth.service";

import {Config} from '../../config';
import {formData} from '../../utils/utils';

@Injectable({providedIn: 'root'})
export class ReceiveService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  save(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=saveActivityAddr', body)
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
