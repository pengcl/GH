import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {TabbarService} from '../../../../modules/tabbar/index';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';
import {TradeService} from '../../../../services/trade.service';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-trade-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss']
})
export class AdminTradePreviewComponent implements OnInit {
  config = Config;

  appKey;
  id = this.route.snapshot.params['id'];
  logistics;
  returnMoney = 0;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private tradeSvc: TradeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.tradeSvc.getLogistics(this.appKey, this.id).then(res => {
      this.logistics = res.result;
    });
    this.tradeSvc.returnInfo(this.appKey, this.id).then(res => {
      if (res.code === '0000') {
        console.log(res);
        this.returnMoney = res.result;
      }
    });
  }

  back() {
    this.location.back();
  }

  submit() {
    this.tradeSvc.sysReturn(this.appKey, this.id).then(res => {
      if (res.code === '0000') {
        this.dialogSvc.show({content: '系统已经成功回收', confirm: '我知道了'}).subscribe(() => {
          this.back();
        });
      }
    });
  }

}
