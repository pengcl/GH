import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Config} from '../../../config';
import {SysService} from '../../../services/sys.service';
import {AuthService} from '../../../services/auth.service';
import {OrderService} from '../../../services/order.service';

@Component({
  selector: 'app-msg-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class MsgSuccessComponent implements OnInit {

  config = Config;
  sysConfig;
  type;
  appKey;
  orderNo;
  orders;

  constructor(private route: ActivatedRoute,
              private sysSvc: SysService,
              private authSvc: AuthService,
              private orderSvc: OrderService) {
  }

  ngOnInit() {
    this.type = this.route.snapshot.queryParams['type'];
    this.orderNo = this.route.snapshot.queryParams['orderNo'];
    this.appKey = this.authSvc.getStorageKey();
    this.sysSvc.getSysConfig().then(res => {
      this.sysConfig = res.result;
    });

    if (this.type === 'cart') {
      this.orderSvc.get(this.appKey, this.orderNo).then(res => {
        if (res.code === '0000') {
          this.orders = res.result;
          console.log(this.orders);
        }
      });
    }
  }

}
