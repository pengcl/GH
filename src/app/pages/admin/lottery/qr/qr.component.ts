import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Config} from '../../../../config';
import {DialogService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {ProductService} from '../../../../services/product.service';
import {LotteryService} from '../../../../services/lottery.service';
import {H2cService} from '../../../../services/h2c.service';
import {timer as observableTimer} from 'rxjs';

import {WxService} from '../../../../modules/wx';
import {LocationStrategy} from '@angular/common';

declare var QRCode: any;
declare var html2canvas: any;

@Component({
  selector: 'app-admin-lottery-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class AdminLotteryQrComponent implements OnInit, OnDestroy {
  config = Config;
  appKey;
  poster;

  qrcode;

  id;
  pid;

  product;

  likedNum;
  needNum;

  topBarShow = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private productSvc: ProductService,
              private lotterySvc: LotteryService,
              private h2c: H2cService,
              private wxSvc: WxService) {
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();
    this.id = this.route.snapshot.params['id'];
    this.pid = this.route.snapshot.queryParams['pid'];

    this.lotterySvc.support(this.appKey, this.id, this.pid).then(res => {
      console.log(res);
      if (res.code === '0000' || res.code === '9991' || res.code === '9992') {
        if (res.code === '0000') {
          this.likedNum = res.result.likedNum;
          this.needNum = res.result.needNum;
          this.dialogSvc.show({content: '您已成功帮助朋友扫码', cancel: '', confirm: '我也要抽奖'}).subscribe(() => {
            this.router.navigate(['/admin/lottery']);
          });
        }
        if (res.code === '9991') {
          this.dialogSvc.show({content: '当日未充值用户无法帮忙呦！', cancel: '', confirm: '我知道了'}).subscribe(() => {
            this.router.navigate(['/admin/lottery']);
          });
          this.likedNum = JSON.parse(res.msg).likedNum;
          this.needNum = JSON.parse(res.msg).needNum;
        }
        if (res.code === '9992') {
          this.likedNum = res.result ? res.result.likedNum : JSON.parse(res.msg).likedNum;
          this.needNum = res.result ? res.result.needNum : JSON.parse(res.msg).needNum;
        }

        this.productSvc.getProduct(this.pid, this.appKey).then(_res => {
          console.log(_res);
          if (_res.code === '0000') {
            this.product = _res.result.productMap;
            this.qrcode = new QRCode(document.getElementById('qrcode'), {
              text: Config.webHost + '/admin/lottery/qr/' + this.id + '?pid=' + this.pid,
              width: 256,
              height: 256,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });

            this.h2c.get().then(data => {
              if (data) {
                setTimeout(() => {
                  html2canvas(document.querySelector('.canvas-source')).then(canvas => {
                    this.poster = canvas.toDataURL();
                  });
                }, 1000);
              }
            });
          }
        });
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });

    observableTimer(1000).subscribe(() => {
      this.wxSvc.config({
        title: '【广惠商城】好运转盘，100%中奖，实物好礼每天送！',
        desc: '新用户注册后分享即送一次转盘机会哦，转盘礼品等着您！',
        link: Config.webHost + '/admin/lottery/qr/' + this.id + '?pid=' + this.pid + '&referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
        imgUrl: Config.webHost + '/assets/images/lottery.jpg'
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
      }).catch((err: string) => {
        console.log(err);
        // this.status = `注册失败，原因：${err}`;
      });
    });
  }

  ngOnDestroy() {

  }

}
