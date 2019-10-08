import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {TabbarService} from '../../../../modules/tabbar/index';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';
import {TradeService} from '../../../../services/trade.service';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-trade-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class AdminTradeItemComponent implements OnInit {
  config = Config;

  appKey;
  trade;

  nums = [];

  constructor(private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private tradeSvc: TradeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.tradeSvc.getDetail(this.appKey, this.route.snapshot.params['id'], this.route.snapshot.queryParams['type']).then(res => {
      this.trade = res.result;
      console.log(this.trade);
      const nums = [];
      res.result.list.forEach(item => {
        item.randomnumber.split(',').forEach(num => {
          nums.push({
            num: num,
            isNum: num === item.max_number
          });
        });
      });
      this.nums = nums;
    });
  }

}
