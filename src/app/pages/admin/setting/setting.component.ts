import {Component, OnInit, ViewEncapsulation} from '@angular/core';

import {Router} from '@angular/router';
import {StorageService} from '../../../services/storage.service';
import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {MemberService} from '../../../services/member.service';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminSettingComponent implements OnInit {
  config = Config;

  appKey;
  userInfo;

  constructor(private router: Router,
              private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private memberSvc: MemberService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });
  }

  setShowRecord() {
    const type = this.userInfo.showRecord === 0 ? this.userInfo.showRecord = 1 : this.userInfo.showRecord = 0;
    this.memberSvc.changeShowRecord(this.appKey, type).then(res => {
      if (res.code === '0000') {
        this.userInfo.showRecord = type;
      }
    });
  }

  setShowGoods() {
    const type = this.userInfo.showGoods === 0 ? this.userInfo.showGoods = 1 : this.userInfo.showGoods = 0;
    this.memberSvc.changeShowGoods(this.appKey, type).then(res => {
      if (res.code === '0000') {
        this.userInfo.showGoods = type;
      }
    });
  }

  logout() {
    this.storageSvc.clear();
  }

}
