import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {TabbarService} from '../../../../modules/tabbar/index';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';
import {TradeService} from '../../../../services/trade.service';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-trade-logistics',
  templateUrl: './logistics.component.html',
  styleUrls: ['./logistics.component.scss']
})
export class AdminTradeLogisticsComponent implements OnInit {
  config = Config;

  appKey;
  logistics;

  constructor(private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private tradeSvc: TradeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.tradeSvc.getLogistics(this.appKey, this.route.snapshot.params['id']).then(res => {
      this.logistics = res.result;
      console.log(this.logistics);
    });
  }

}
