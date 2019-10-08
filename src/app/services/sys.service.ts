import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class SysService {

  constructor(private http: HttpClient,
              private router: Router) {
  }

  getSysConfig(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getSysConfigure')
      .toPromise()
      .then(response => response)
      .catch(error => null);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
