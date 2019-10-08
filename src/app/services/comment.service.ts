import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class CommentService {

  constructor(private http: HttpClient) {
  }

  getComments(id?, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=shareProduct' + '&id=' + (id ? id : '') + '&page=' + (page ? page : 1))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
