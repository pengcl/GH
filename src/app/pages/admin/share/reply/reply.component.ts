import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {DialogService} from 'ngx-weui';

import {Config} from '../../../../config';
import {ShareService} from '../../../../services/share.service';

@Component({
  selector: 'app-admin-share-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.scss']
})
export class AdminShareReplyComponent implements OnInit {
  config = Config;

  appKey;

  replyForm: FormGroup;
  loading = false;

  constructor(private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private shareSvc: ShareService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.replyForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required])
    });

    this.replyForm.get('key').setValue(this.appKey);
    this.replyForm.get('id').setValue(this.route.snapshot.params['id']);
  }

  onSubmit() {
    if (this.loading) {
      return false;
    }
    this.loading = true;
    this.shareSvc.reply(this.replyForm.value).then(res => {
      this.loading = false;
      if (res.code === '0000') {
        window.history.back();
      } else {
        this.dialogSvc.show({
          title: '系统提示',
          content: res.msg,
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }

}
