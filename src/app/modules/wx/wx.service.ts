import {throwError as observableThrowError} from 'rxjs';
import {Injectable, ComponentFactoryResolver, ApplicationRef, Injector} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {WxComponent} from './wx.component';
import {ActivatedRoute} from '@angular/router';
import {Config} from '../../config';
import {HttpClient} from '@angular/common/http';

import {JWeiXinService} from 'ngx-weui';
import {BaseService} from '../../services/utils/base.service';

declare const wx: any;

@Injectable()
export class WxService extends BaseService {

  private DEFAULTSHARE: any = {
    title: '',
    desc: '',
    link: Config.webHost,
    imgUrl: '',
  };

  private share: any;
  private jsApiList: string[] = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone'];

  constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector, private wxService: JWeiXinService, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    super(resolver, applicationRef, injector);
  }

  show(data): Observable<any> {
    const componentRef = this.build(WxComponent);

    componentRef.instance.state = data;
    componentRef.instance.close.subscribe(() => {
      // this.destroy(componentRef);
      setTimeout(() => {
        this.destroy(componentRef);
      }, 300);
    });
    return componentRef.instance.show();
  }

  hide() {
    const componentRef = this.build(WxComponent);
    componentRef.instance.hide();
  }

  defaultConfig(config) {
    this.DEFAULTSHARE = config;
  }

  config(shareData: any, jsApiList?: string[]): Promise<boolean> {
    this.share = shareData;
    if (jsApiList) {
      this.jsApiList = jsApiList;
    }
    return new Promise((resolve, reject) => {
      this.wxService.get().then(res => {
        if (!res) {
          reject('jweixin.js 加载失败');
          return;
        }

        /*this.http
          .get(Config.prefix.wApi + '/interface/call.html?action=getJsSdkAuth&url=' + encodeURIComponent(window.location.href))
          .pipe(
            catchError((error: Response | any) => {
              reject('无法获取签名数据');
              return observableThrowError('error');
            }),
          )
          .subscribe((ret: any) => {
            if (ret.code !== '0000') {
              reject('jsapi 获取失败');
              return;
            }
            ret.result.jsApiList = this.jsApiList;
            wx.config(ret.result);

            wx.ready(() => {
              this._onMenuShareTimeline()
                ._onMenuShareAppMessage()
                ._onMenuShareQQ()
                ._onMenuShareQZone()
                ._onMenuShareWeibo();

              resolve();
            });
            wx.error(() => {
              reject('config 注册失败');
            });
          });*/
      });
    });
  }

  private _onMenuShareTimeline() {
    wx.onMenuShareTimeline(Object.assign({}, this.DEFAULTSHARE, this.share));
    return this;
  }

  private _onMenuShareAppMessage() {
    wx.onMenuShareAppMessage(Object.assign({}, this.DEFAULTSHARE, this.share));
    return this;
  }

  private _onMenuShareQQ() {
    wx.onMenuShareQQ(Object.assign({}, this.DEFAULTSHARE, this.share));
    return this;
  }

  private _onMenuShareWeibo() {
    wx.onMenuShareWeibo(Object.assign({}, this.DEFAULTSHARE, this.share));
    return this;
  }

  private _onMenuShareQZone() {
    wx.onMenuShareQZone(Object.assign({}, this.DEFAULTSHARE, this.share));
    return this;
  }
}
