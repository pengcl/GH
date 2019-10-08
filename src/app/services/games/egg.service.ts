import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../../config';

import {AuthService} from '../auth.service';

@Injectable({providedIn: 'root'})
export class EggService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  get(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getEggProducts&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  lottery(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=eggsLottery&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getLottery(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getLottery&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  support(key, id, pid): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=likeGoods&key=' + key + '&spellbuyproductId=' + pid + '&eggsId=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getWinners(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getWinnerList')
      .toPromise()
      .then(response => response)
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
