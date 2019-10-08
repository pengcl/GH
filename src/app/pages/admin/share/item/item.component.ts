import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';

import {Config} from '../../../../config';
import {ShareService} from '../../../../services/share.service';

@Component({
  selector: 'app-admin-share-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class AdminShareItemComponent implements OnInit {
  config = Config;

  appKey;

  shareId;
  share;

  liked = false;

  constructor(private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private shareSvc: ShareService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.shareId = this.route.snapshot.params['id'];
    this.shareSvc.get(this.appKey, this.shareId).then(res => {
      this.share = res.result;
    });
  }

  like() {
    if (this.liked) {
      this.dialogSvc.show({content: '请不要重复点赞！', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }
    this.shareSvc.like(this.appKey, this.shareId).then(res => {
      if (res.code === '0000') {
        this.share.share.upcount = res.result;
      }
    });
  }

}
