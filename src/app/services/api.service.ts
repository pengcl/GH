import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formDataToUrl} from '../utils/utils';

@Injectable({providedIn: 'root'})
export class IndexService {

  constructor(private http: HttpClient) {
  }

  /*api(name, body?, method?): Promise<any> {
    return this.http.request(Config.prefix.wApi + '/interface/call.html?action=index')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }*/

  api = {
    get: (name, body?) => {
      const prams = formDataToUrl(body, false);
      return this.http.get(Config.prefix.wApi + '/interface/call.html?action=' + name + prams)
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    },
    post: (name, body?) => {
      const prams = formDataToUrl(body, false);
      return this.http.post(Config.prefix.wApi + '/interface/call.html?action=' + name, body ? body : {})
        .toPromise()
        .then(response => response)
        .catch(this.handleError);
    }
  };

  getFastList(page): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getFastList&curPage=' + page)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
