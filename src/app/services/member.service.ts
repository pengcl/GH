import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';
import {formData, formDataToUrl} from '../utils/utils';

import {AuthService} from './auth.service';

@Injectable({providedIn: 'root'})
export class MemberService {

  constructor(private http: HttpClient,
              private authSvc: AuthService) {
  }

  getLotteryMember(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getMember&key=' + key)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getMember(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getMember&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getCommissions(key, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getMyCommissionList&key=' + key + '&page=' + (page ? page : 1))
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  sign(key): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=memberSign&key=' + key)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  changeName(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=changeUsername', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  changePwd(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=changePwd', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getMobiles(body): Promise<any> {
    const params = formDataToUrl(body, false);
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getPhoneBinds' + params)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getMobile(key, id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getPhoneBindDetail&key=' + key + '&id=' + id)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  bindMobile(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=addPhoneBind', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  editMobile(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=editPhoneBind', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  removeMobile(body): Promise<any> {
    body = formData(body);
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=removePhoneBind', body)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  changeShowRecord(key, type): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=changeShowRecord&key=' + key + '&showRecord=' + type)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  changeShowGoods(key, type): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=changeShowGoods&key=' + key + '&showGoods=' + type)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getRecords(user): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=userRecords&user_flag=' + user)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getWinners(user): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=userLuckies&user_flag=' + user)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getShares(user): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=userShows&user_flag=' + user)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  getUser(user): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=userHeadInfo&user_flag=' + user)
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
