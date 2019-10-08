import {timer as observableTimer, Observable} from 'rxjs';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';

import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {FlowService} from '../../../services/flow.service';
import {DialogService, InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-flow',
  templateUrl: './flow.component.html',
  styleUrls: ['./flow.component.scss']
})
export class AdminFlowComponent implements OnInit {
  config = Config;

  appKey;

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  totalPages: number;
  page: number = 1;
  tab = 1;

  flow;

  constructor(private tabBarSvc: TabbarService,
              private location: Location,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private flowSvc: FlowService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.getData(this.tab, 1);
  }

  onSelect(tab) {
    this.tab = tab;
    this.il.restart();
    this.getData(tab, 1);
  }

  getData(type, page) {
    this.flowSvc.get(this.appKey, type, page).then(res => {
      if (res.code === '0000') {
        this.flow = res.result;
        this.page = page;
        this.totalPages = res.result.totalPages;
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      this.flowSvc.get(this.appKey, this.tab, this.page).then(res => {
        if (res.code === '0000') {
          this.flow.list = this.flow.list.concat(res.result.list);
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
