import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formDataToUrl} from '../utils/utils';

import {AuthService} from "./auth.service";
import {Subject, Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class CartService {

  private subject = new Subject<any>();

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getCount(): Observable<number> {
    return this.subject.asObservable();
  }

  updateCount(count: number) {
    this.subject.next(count);
  }


  getCarts(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getCarts&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getCartCount(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=cartCount&key=' + key)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  addCart(body): Promise<any> {
    const prams = formDataToUrl(body, false);
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=addCart' + prams)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  addCarts(body): Promise<any> {
    const prams = formDataToUrl(body, false);
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=addCarts' + prams)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  updateCarts(body): Promise<any> {
    const prams = formDataToUrl(body, false);
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=updateCarts' + prams)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  removeCart(body): Promise<any> {
    const prams = formDataToUrl(body, false);
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=removeCart' + prams)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  clearCart(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=clearCart&key=' + key)
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
