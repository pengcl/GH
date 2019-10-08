import {Component, OnInit, ViewChild} from '@angular/core';

import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';

import {RechargeService} from '../../../../services/recharge.service';

import {Config} from '../../../../config';
import {DialogService, InfiniteLoaderComponent} from 'ngx-weui';
import {timer as observableTimer} from 'rxjs/index';

@Component({
  selector: 'app-admin-dashboard-records',
  templateUrl: './records.component.html',
  styleUrls: ['./records.component.scss']
})
export class AdminDashboardRecordsComponent implements OnInit {
  config = Config;

  appKey;

  records;
  page = 1;
  totalPages;

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private dialogSvc: DialogService,
              private rechargeSvc: RechargeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.rechargeSvc.find(this.appKey, this.page, 15).then(res => {
      if (res.code === '0000') {
        this.records = res.result.list;
        console.log(this.records);
        this.totalPages = res.result.totalPages;
      }
    });
  }

  cancel(no) {
    this.rechargeSvc.cancel(this.appKey, no).then(res => {
      if (res.code === '0000') {
        this.rechargeSvc.find(this.appKey, this.page, 15).then(data => {
          if (data.code === '0000') {
            this.page = 1;
            this.records = data.result.list;
            this.totalPages = data.result.totalPages;
            this.comp.restart();
          }
        });
      }
      this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      this.rechargeSvc.find(this.appKey, this.page, 15).then(res => {
        if (res.code === '0000') {
          this.records = this.records.concat(res.result.list);
          this.totalPages = res.result.totalPages;
        }
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }
      comp.resolveLoading();
    });
  }
}
