import {timer as observableTimer} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {DialogService, InfiniteLoaderComponent} from 'ngx-weui';
import {MemberService} from '../../../services/member.service';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-commissions',
  templateUrl: './commissions.component.html',
  styleUrls: ['./commissions.component.scss']
})
export class AdminCommissionsComponent implements OnInit {
  config = Config;

  appKey;

  totalPages: number;
  page: number = 1;

  commissions;

  constructor(private location: Location,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private memberSvc: MemberService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.memberSvc.getCommissions(this.appKey).then(res => {
      if (res.code === '0000') {
        this.commissions = res.result;
        this.totalPages = res.result.totalPages;
      }
    });

  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      this.memberSvc.getCommissions(this.appKey, this.page).then(res => {
        if (res.code === '0000') {
          this.commissions.list = this.commissions.list.concat(res.result.list);
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
