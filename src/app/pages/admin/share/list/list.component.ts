import {timer as observableTimer, Observable} from 'rxjs';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';

import {TabbarService} from '../../../../modules/tabbar/index';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../../config';
import {ShareService} from '../../../../services/share.service';

@Component({
  selector: 'app-admin-share-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminShareListComponent implements OnInit {
  config = Config;

  appKey;

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  share;
  page: number = 1;
  totalPages: number;

  constructor(private tabBarSvc: TabbarService,
              private location: Location,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private shareSvc: ShareService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.shareSvc.get(this.appKey).then(res => {
      this.share = res.result;
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      /*this.indexSvc.getFastList(this.currPage).then(res => {
        if (res.code === '0000') {
          this.goods = res.result;
          this.totalPages = res.result.totalPages;
        }
      });*/

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
