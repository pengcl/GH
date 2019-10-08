import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

import {Config} from '../config';

import {StorageService} from "./storage.service";

@Injectable({providedIn: 'root'})
export class IndexService {

  constructor(private http: HttpClient,
              private router: Router,
              private storageSvc: StorageService) {
  }

  getIndex(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=index')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getFastList(page, key?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getFastList&page=' + page + '&key=' + (key || ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getSoonOpensProduct(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getSoonOpensProduct&date=' + new Date().getTime())
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  spellbuyProductDel(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=spellbuyproductid&date=' + new Date().getTime())
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  isQrShow(): Boolean {
    const NOW = Date.parse(String(new Date()));
    const QR_EXPIRES_TIME = this.storageSvc.get('QR_EXPIRES_TIME'); // Date.parse(String(new Date())) + 86400000;

    if (!QR_EXPIRES_TIME) {
      this.storageSvc.set('QR_EXPIRES_TIME', NOW + 86400000);
      return true;
    } else if (NOW > parseInt(QR_EXPIRES_TIME, 10)) {
      this.storageSvc.set('QR_EXPIRES_TIME', NOW + 86400000);
      return true;
    } else {
      return false;
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
