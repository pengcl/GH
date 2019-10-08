import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class ArticleService {

  constructor(private http: HttpClient) {
  }

  getNews(page): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getNewsList&page=' + page)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getNew(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getNewsDetail&newsId=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getNotices(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getNoticeList')
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
