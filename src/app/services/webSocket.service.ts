import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Observable, Observer, Subject} from 'rxjs/index';

import {Config} from '../config';

@Injectable({providedIn: 'root'})

export class WebSocketService {

  ws: WebSocket;

  constructor() {
  }

  close() {
    this.ws.close();
  }

  create(): Observable<any> {
    this.ws = new WebSocket('ws://www.ap-mall.cn:8080/game');
    return new Observable<any>(observer => {
      this.ws.onmessage = (event) => observer.next(event.data);
      this.ws.onerror = (event) => observer.error(event);
      this.ws.onclose = (event) => observer.complete();
    });
  }

  send(body: any) {
    this.ws.send(JSON.stringify(body));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
