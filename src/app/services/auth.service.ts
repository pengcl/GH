import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Router, ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {Config} from '../config';

import {formData} from '../utils/utils';
import {StorageService} from './storage.service';
import {UaService} from './utils/ua.service';

@Injectable({providedIn: 'root'})
export class AuthService {

  private redirectUrl = '';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private http: HttpClient,
              private storageSvc: StorageService,
              private ua: UaService) {
  }

  requestAuth() {
    if (this.router.url.indexOf('signIn') !== -1) {
      return false;
    }
    if (this.redirectUrl) {
      return false;
    }

    this.redirectUrl = this.router.url;
    window.location.href = Config.webHost + '/auth/signIn?callbackUrl=' + encodeURIComponent(this.redirectUrl);
  }

  getUid() {
    if (this.storageSvc.get('accessToken')) {
      return JSON.parse(this.storageSvc.get('accessToken')).id;
    }
  }

  getOid() {
    if (this.storageSvc.get('openid')) {
      return JSON.parse(this.storageSvc.get('openid'));
    } else {
      return '';
    }
  }

  getKey() {
    // this.redirectUrl = this.router.url;
    let accessToken, openid, key, id;

    // 判断accessToken是否在存并是否过期
    if (this.storageSvc.get('accessToken') && JSON.parse(this.storageSvc.get('accessToken')).expires_time > Date.parse(String(new Date()))) {
      accessToken = JSON.parse(this.storageSvc.get('accessToken'));
      return accessToken.key;
    } else {// accessToken不存在或已过期
      /*if (this.ua.isWx()) {// 微信环境
        if (this.route.snapshot.queryParams['key']) {
          key = this.route.snapshot.queryParams['key'];
          id = this.route.snapshot.queryParams['id'];
          openid = this.route.snapshot.queryParams['openid'];
          this.storageSvc.set('accessToken', JSON.stringify({
            id: id,
            key: key,
            expires_time: Date.parse(String(new Date())) + 144000000
          }));
          this.storageSvc.set('openid', openid);
          return key;
          /!*this.router.navigate([this.location.path().split('?')[0]]);*!/
        } else if (this.route.snapshot.queryParams['openid']) {// url中存在openId;
          openid = this.route.snapshot.queryParams['openid'];
          this.storageSvc.set('openid', openid);
          return this.router.navigateByUrl('/auth/signIn' + window.location.search);
        } else {// url中不存在openId;
          window.location.href = Config.prefix.wApi + '/interface/comm/auth.html?callbackUrl=' + encodeURIComponent(window.location.href);
        }
      } else {// 非微信环境
        this.router.navigate(['/auth/signIn'], {queryParams: {callbackUrl: this.router.url}});
      }*/
      this.router.navigate(['/auth/signIn'], {queryParams: {callbackUrl: this.router.url}});
    }
  }

  getStorageKey() {
    let accessToken;

    // 判断accessToken是否在存并是否过期
    if (this.storageSvc.get('accessToken')) {
      accessToken = JSON.parse(this.storageSvc.get('accessToken'));
      return accessToken.key;
    } else {
      return '';
    }
  }

  signIn(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=login', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  signUp(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=register', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  forgot(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=findMyPwd', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getValidImg(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getValidImg&randomValidUid=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  sendValidCode(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=sendValidCode', body)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
