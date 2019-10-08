import {Component, OnInit, ViewEncapsulation, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {WxComponent, WxService} from '../../../../modules/wx';

import {InfiniteLoaderComponent, DialogService} from 'ngx-weui';
import {Config} from '../../../../config';
import {StorageService} from '../../../../services/storage.service';
import {SysService} from '../../../../services/sys.service';
import {AuthService} from '../../../../services/auth.service';
import {MemberService} from '../../../../services/member.service';
import {InviteService} from '../../../../services/invite.service';
import {ShareService} from '../../../../services/share.service';
import {timer as observableTimer} from 'rxjs/index';

declare var QRCode: any;

@Component({
  selector: 'app-admin-invite-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminInviteIndexComponent implements OnInit, OnDestroy {

  appKey;
  userInfo;

  @ViewChild(WxComponent) private wc;

  invitees;
  invite;

  records;

  reds;
  pageSize: number = 6;
  currPage: number = 1;

  withdrawalForm: FormGroup;
  withdrawalStatus = {
    loading: false,
    submit: false
  };
  transferForm: FormGroup;
  transferStatus = {
    loading: false,
    submit: false
  };

  constructor(private router: Router,
              private storage: StorageService,
              private dialogSvc: DialogService,
              private wxSvc: WxService,
              private sysSvc: SysService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private inviteSvc: InviteService,
              private shareSvc: ShareService) {
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();

    observableTimer(1000).subscribe(() => {
      this.wxSvc.config({
        link: Config.webHost + '/index?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : '')
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
      }).catch((err: string) => {
        console.log(err);
        // this.status = `注册失败，原因：${err}`;
      });
    });

    this.withdrawalForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      money: new FormControl('', [Validators.required]),
      bankuser: new FormControl('', [Validators.required]),
      bankname: new FormControl('', [Validators.required]),
      banksubbranch: new FormControl('', [Validators.required]),
      bankno: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required])
    });

    this.withdrawalForm.get('key').setValue(this.appKey);

    this.transferForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
    });

    this.transferForm.get('key').setValue(this.appKey);

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });

    this.inviteSvc.getShareData(this.appKey).then(res => {
      if (res.code === '0000') {
        this.invite = res.result;
      }
    });

    this.inviteSvc.get(this.appKey).then(res => {
      if (res.code === '0000') {
        this.invitees = res.result.list;
      }
    });

    this.inviteSvc.getMyRecord(this.appKey).then(res => {
      if (res.code === '0000') {
        this.records = res.result.list;
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    /*Observable.timer(500).subscribe(() => {

      this.currPage = this.currPage + 1;
      this.currProducts = this.filterOfProducts.slice(0, this.pageSize * this.currPage); // 获取当前页数据

      if (this.currProducts.length >= this.filterOfProducts.length) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });*/
  }

  onShare(state) {
    this.wxSvc.show(state).subscribe();
  }

  withdrawal() {
    this.withdrawalStatus.submit = true;
    if (this.withdrawalStatus.loading || this.withdrawalForm.invalid) {
      return false;
    }

    this.withdrawalStatus.loading = true;

    this.inviteSvc.withdrawals(this.withdrawalForm.value).then(res => {
      this.withdrawalStatus.loading = false;
      if (res.code === '0000') {
        this.userInfo = res.result;
        this.dialogSvc.show({content: '申请成功', cancel: '', confirm: '我知道了'}).subscribe();
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  transfer() {
    this.transferStatus.submit = true;
    if (this.transferStatus.loading || this.transferForm.invalid) {
      return false;
    }

    this.transferStatus.loading = true;

    this.inviteSvc.transfer(this.transferForm.value).then(res => {
      this.transferStatus.loading = false;
      if (res.code === '0000') {
        this.userInfo = res.result;
        this.dialogSvc.show({content: '申请成功', cancel: '', confirm: '我知道了'}).subscribe();
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  ngOnDestroy() {
    this.wxSvc.destroy(this.wc);
  }

}
