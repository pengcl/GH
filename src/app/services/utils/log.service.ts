import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


import {Config} from '../../config';
import {formData} from '../../utils/utils';

@Injectable({providedIn: 'root'})
export class LogService {

  constructor(private http: HttpClient) {
  }

  /*log(path, body): Promise<any> {
    return this.http.post(Config.prefix.api + '/log/post?path=' + path, body, {})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }*/

  log(body): Promise<any> {
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=requestLog', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
