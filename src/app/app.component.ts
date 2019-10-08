import {Component, ViewEncapsulation} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {Config} from './config';
import {StorageService} from './services/storage.service';
import {SysService} from './services/sys.service';
import {WxService} from './modules/wx';
import {isUpdateReferee} from './utils/utils';
import {UaService} from './services/utils/ua.service';
import {DialogService} from 'ngx-weui';
import {AuthService} from './services/auth.service';
import {LogService} from './services/utils/log.service';
import {CartService} from './services/cart.service';
import {ShareService} from './services/share.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  referee;
  sysConfig = {
    title: '',
    desc: '',
    link: Config.webHost + '/index',
    imgUrl: '',
    success: () => {
    }
  };

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageSvc: StorageService,
              private uaSvc: UaService,
              private logSvc: LogService,
              private sysSvc: SysService,
              private wxSvc: WxService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private cartSvc: CartService,
              private shareSvc: ShareService) {

    this.route.queryParams.subscribe(queryParams => {// 分析地址栏参数
      if (queryParams.referee) {// 地址栏有referee
        this.referee = queryParams.referee;
        // 处理推荐人
        const paramsReferee = this.referee;
        const storageReferee = this.storageSvc.get('referee'); // 缓存中是否有referee

        if (isUpdateReferee(paramsReferee, storageReferee)) {// 比较地址栏和缓存中的referee优先级,如果地址栏的优先级高的话更新缓存
          this.storageSvc.set('referee', paramsReferee);
        }
      }

      if (queryParams.sourceChannel && !this.storageSvc.get('sourceChannel')) {// 地址栏有referee
        // 处理推荐人
        this.storageSvc.set('sourceChannel', queryParams.sourceChannel);
      }
    });

    sysSvc.getSysConfig().then(res => {
      if (!res) {
        this.router.navigate(['/msg/info']);
        return false;
      }
      if (res.code === '0000') {
        this.sysConfig.title = res.result.shareTitle;
        this.sysConfig.desc = res.result.shareDesc;
        this.sysConfig.link = Config.webHost + '/index?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : '');
        this.sysConfig.imgUrl = Config.prefix.wApi + res.result.shareImage;
        this.sysConfig.success = () => {
          this.shareSvc.give(this.authSvc.getStorageKey()).then();
        };
        wxSvc.defaultConfig(this.sysConfig);

        wxSvc.config({}).then(() => {
          // 其它操作，可以确保注册成功以后才有效
          // this.status = '注册成功';
        }).catch((err: string) => {
          console.log(`注册失败，原因：${err}`);
          // this.status = `注册失败，原因：${err}`;
        });


        /*const now = Date.parse(new Date().toString());
        if (res.result.eventEmit && now > res.result.eventEmit.start && now < res.result.eventEmit.end) {
          const eventEmit = res.result.eventEmit;
          this.dialogSvc.show({
            title: eventEmit.title,
            content: eventEmit.content,
            cancel: '不了',
            confirm: '马上行动'
          }).subscribe(e => {
            if (e.value) {
              this.router.navigate([eventEmit.url]);
            }
          });
        }*/
      }
    });

    if (storageSvc.get('accessToken')) {
      const key = JSON.parse(storageSvc.get('accessToken')).key;
      this.cartSvc.getCartCount(key).then(res => {
        let count = 0;
        if (res.code === '0000') {
          count = res.result;
        }
        this.cartSvc.updateCount(count);
      });
    }
  }

  getState(outlet) {
    return outlet.activatedRouteData.state;
  }
}
