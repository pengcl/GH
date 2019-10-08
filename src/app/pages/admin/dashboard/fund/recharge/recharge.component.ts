import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';


import {TabbarService} from '../../../../../modules/tabbar';
import {DialogService, ToastService} from 'ngx-weui';
import {AuthService} from '../../../../../services/auth.service';
import {MemberService} from '../../../../../services/member.service';
import {PayService} from '../../../../../services/pay.service';
import {RechargeService} from '../../../../../services/recharge.service';

import {Config} from '../../../../../config';

@Component({
  selector: 'app-admin-dashboard-fund-recharge',
  templateUrl: './recharge.component.html',
  styleUrls: ['./recharge.component.scss']
})
export class AdminDashboardFundRechargeComponent implements OnInit {
  config = Config;

  appKey;
  userInfo;

  rechargeForm: FormGroup;
  isSubmit = false;
  loading = false;

  phonesShow = false;
  phones;

  constructor(private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private paySvc: PayService,
              private rechargeSvc: RechargeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
        this.rechargeForm.get('amount').setValidators(Validators.max(this.userInfo.balance));
      }
    });

    this.rechargeForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
      payType: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required])
    });

    this.rechargeForm.get('key').setValue(this.appKey);
    this.rechargeForm.get('payType').setValue('recharge_offline');
  }

  inputChange(e) {
    this.phonesShow = true;
    this.rechargeSvc.getPhones(this.appKey, e).then(res => {
      this.phones = res.result;
    });
  }

  setPhone(phone) {
    this.rechargeForm.get('phone').setValue(phone);
    this.phonesShow = false;
  }

  doRecharge() {
    this.loading = true;
    this.toastSvc.show('结算中', 100000, '', 'loading');
    this.rechargeSvc.recharge(this.rechargeForm.value).then(res => {
      this.loading = false;
      this.toastSvc.hide();
      let msg;
      if (res.code === '0000') {
        this.rechargeForm.get('phone').setValue('');
        this.rechargeForm.get('amount').setValue('');
        msg = '您已充值成功';
        this.isSubmit = false;
        this.memberSvc.getMember(this.appKey).then(_res => {
          if (res.code === '0000') {
            this.userInfo = _res.result;
          }
        });
      } else {
        msg = res.msg;
      }
      this.dialogSvc.show({content: msg, cancel: '', confirm: '我知道了'}).subscribe();
    });
  }

  recharge() {
    this.isSubmit = true;
    if (this.rechargeForm.invalid) {
      return false;
    }
    this.dialogSvc.show({
      content: '请您确认给' + this.rechargeForm.get('phone').value + '号码充值，充值金额' + this.rechargeForm.get('amount').value,
      cancel: '取消',
      confirm: '确认'
    }).subscribe(res => {
      if (res.value) {
        this.doRecharge();
      }
    });
  }
}
