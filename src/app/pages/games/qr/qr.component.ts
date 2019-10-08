import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

import {Config} from '../../../config';
import {DialogService} from 'ngx-weui';
import {AuthService} from '../../../services/auth.service';
import {ProductService} from '../../../services/product.service';
import {EggService} from '../../../services/games/egg.service';
import {H2cService} from '../../../services/h2c.service';

declare var QRCode: any;
declare var html2canvas: any;

@Component({
  selector: 'app-games-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class GamesQrComponent implements OnInit, OnDestroy {
  config = Config;
  appKey;
  poster;

  qrcode;

  id;
  pid;

  product;

  likedNum;
  needNum;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private productSvc: ProductService,
              private eggSvc: EggService,
              private h2c: H2cService) {
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();
    this.id = this.route.snapshot.params['id'];
    this.pid = this.route.snapshot.queryParams['pid'];

    this.eggSvc.support(this.appKey, this.id, this.pid).then(res => {
      if (res.code === '0000' || res.code === '9991') {
        if (res.code === '0000') {
          this.likedNum = res.result.likedNum;
          this.needNum = res.result.needNum;
        }
        if (res.code === '9991') {
          this.dialogSvc.show({content: '当日未充值用户无法帮忙呦！', cancel: '', confirm: '我知道了'}).subscribe();
          this.likedNum = JSON.parse(res.msg).likedNum;
          this.needNum = JSON.parse(res.msg).needNum;
        }

        this.productSvc.getProduct(this.pid, this.appKey).then(_res => {
          if (_res.code === '0000') {
            this.product = _res.result.productMap;
            this.qrcode = new QRCode(document.getElementById('qrcode'), {
              text: Config.webHost + '/games/qr/' + this.id + '?pid=' + this.pid,
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
  }

  ngOnDestroy() {

  }

}
