import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {timer as observableTimer, Observable} from 'rxjs';
import {TabbarService} from '../../../../modules/tabbar/index';
import {AuthService} from '../../../../services/auth.service';
import {TradeService} from '../../../../services/trade.service';
import {DialogService, ToastService} from 'ngx-weui';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-trade-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminTradeListComponent implements OnInit {
  config = Config;

  appKey;

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  totalPages: number;
  page: number = 1;
  tab = 'ING';

  trade;

  constructor(private tabBarSvc: TabbarService,
              private location: Location,
              private toastSvc: ToastService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private tradeSvc: TradeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.tradeSvc.get(this.appKey, 'ING', 1).then(res => {
      this.trade = res.result;
      console.log(this.trade);
      this.totalPages = res.result.totalPages;
    });
  }

  onSelect(tab) {
    this.tab = tab;
    this.il.restart();
    this.getData(this.tab, 1);
  }

  getData(type, page) {
    this.tradeSvc.get(this.appKey, type, 1).then(res => {
      this.trade = res.result;
      this.totalPages = res.result.totalPages;
      this.page = page;
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {
      this.page = this.page + 1;

      // 获取当前页数据
      this.tradeSvc.get(this.appKey, this.tab, this.page).then(res => {
        if (res.code === '0000') {
          this.trade.list = this.trade.list.concat(res.result.list);
        }
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  onCancel(e) {
    if (e === 'cancel') {
      this.location.back();
    }
  }

}
