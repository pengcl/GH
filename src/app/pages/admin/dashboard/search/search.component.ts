import {Component, OnInit} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {PickerService, InfiniteLoaderComponent} from 'ngx-weui';
import {TabbarService} from '../../../../modules/tabbar';
import {DialogService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {OrderService} from '../../../../services/order.service';
import {RechargeService} from '../../../../services/recharge.service';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-dashboard-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class AdminDashboardSearchComponent implements OnInit {
  config = Config;

  appKey;
  phones;

  params = {
    key: '',
    page: 1,
    rows: 15,
    word: '',
    beginDate: '',
    endDate: ''
  };

  orders;
  totalPages;
  statistics;

  phonesShow = false;

  exportUrl;

  constructor(private pickerSvc: PickerService,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private orderSvc: OrderService,
              private rechargeSvc: RechargeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.params.key = this.appKey;

    const now = new Date();
    const nowDate = now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate());
    this.params.beginDate = this.params.endDate = nowDate;
  }

  inputChange(e) {
    this.phonesShow = true;
    this.rechargeSvc.getPhones(this.appKey, e).then(res => {
      this.phones = res.result;
    });
    /*observableTimer(1500).subscribe(() => {
      if (this.params.word === e) {
        this.orderSvc.find(this.params).then(res => {
          console.log(res);
        });
      }
    });*/
  }

  selectedPhone(phone) {
    this.params.word = phone;
    this.phonesShow = false;
  }

  onShow(target) {
    this.pickerSvc.showDateTime('date').subscribe((res: any) => {
      this.params[target] = res.formatValue;
    });
  }

  search() {
    this.orderSvc.find(this.params).then(res => {
      if (res.code === '0000') {
        this.orders = res.result.list;
        this.params.page = 1;
        this.totalPages = res.result.totalPages;
      }
    });
    this.orderSvc.getStatistics(this.params).then(res => {
      if (res.code === '0000') {
        this.statistics = res.result;
      }
    });
    this.orderSvc.export(this.params).then(res => {
      if (res.code === '0000') {
        this.exportUrl = res.result;
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.params.page = this.params.page + 1;

      this.orderSvc.find(this.params).then(res => {
        if (res.code === '0000') {
          this.orders = this.orders.concat(res.result.list);
          this.totalPages = res.result.totalPages;
        }
      });

      if (this.params.page >= this.totalPages) {
        comp.setFinished();
        return;
      }
      comp.resolveLoading();
    });
  }
}
