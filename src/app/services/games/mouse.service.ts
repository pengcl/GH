import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable} from 'rxjs/index';
import {map} from 'rxjs/internal/operators';

import {AuthService} from '../auth.service';
import {WebSocketService} from '../webSocket.service';

import {Config} from '../../config';

@Injectable({providedIn: 'root'})
export class MouseService {

  serverMsg;

  constructor(private http: HttpClient,
              private authSvc: AuthService,
              private wsSvc: WebSocketService) {
  }

  tops(key, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getRankingList&key=' + key + '&page=' + page)
      .toPromise()
      .then(response => this.handleExpire(response))
      .catch(this.handleError);
  }

  send(body): void {
    this.wsSvc.create()
      .pipe(map((response: MessageEvent): string => {
        const data = response.data;
        return data;
      }))
      .subscribe(msg => {
        this.serverMsg.push(msg);
      });
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
