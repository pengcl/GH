import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {formData} from '../utils/utils';

import {Config} from '../config';

@Injectable({providedIn: 'root'})
export class ProductService {

  constructor(private http: HttpClient) {
  }

  getTypeList(type?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=typeList&pkType=' + (type || ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getProductList(ord: string, cid, page: number, key?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getProductList&ord=' + ord + '&cid=' + cid + '&page=' + page + '&key=' + (key || ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getRedProductList(ord: string, cid, page: number, key?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getProductList&pkType=3&ord=' + ord + '&cid=' + cid + '&page=' + page + '&key=' + (key || ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getProduct(id: string, key?: string): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=productInfo&spellbuyProductId=' + id + '&key=' + (key ? key : ''))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getRecords(id, page?): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getRecords&spellbuyProductId=' + id + '&page=' + (page ? page : 1))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getSoonOpens(): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getSoonOpens&date=' + new Date().getTime())
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getLotteries(page): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getLotterys&page=' + page + '&date=' + new Date().getTime())
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  open(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=spellbuyProductDel&spellbuyproductid=' + id + '&date=' + new Date().getTime())
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  compute(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=compute&spellbuyProductId=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  cashBack(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=getCutInfos&spellbuyProductId=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  getCharts(id: number, nums: number): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=charts&spellbuyProductId=' + id + '&nums=' + nums)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  search(body): Promise<any> {
    return this.http.post(Config.prefix.wApi + '/interface/call.html?action=queryPrice', formData(body))
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  userShare(id): Promise<any> {
    return this.http.get(Config.prefix.wApi + '/interface/call.html?action=userShare&userid=' + id)
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
