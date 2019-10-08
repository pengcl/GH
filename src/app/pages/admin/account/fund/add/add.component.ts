import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {TabbarService} from '../../../../../modules/tabbar';
import {UaService} from '../../../../../services/utils/ua.service';
import {DialogService, ToastService, MaskComponent} from 'ngx-weui';
import {AuthService} from '../../../../../services/auth.service';
import {MemberService} from '../../../../../services/member.service';
import {PayService} from '../../../../../services/pay.service';
import {RechargeService} from '../../../../../services/recharge.service';

import {Config} from '../../../../../config';

@Component({
  selector: 'app-admin-account-fund-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AdminAccountFundAddComponent implements OnInit, OnDestroy {
  config = Config;

  appKey;
  userInfo;

  payTypes;
  showType;
  payQrCode;
  qrCodeUrl;
  submitForm: FormGroup;
  @ViewChild('customForm') private customForm;
  @ViewChild('mask') mask: MaskComponent;
  loading = false;

  formData;
  isCustom = false;

  listenerTimer;

  constructor(private router: Router,
              private uaSvc: UaService,
              private tabBarSvc: TabbarService,
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

    this.submitForm = new FormGroup({
      amount: new FormControl('', [Validators.required, Validators.min(21)]),
      payType: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      returnUrl: new FormControl('', [Validators.required])
    });

    this.submitForm.get('key').setValue(this.appKey);
    this.submitForm.get('returnUrl').setValue(Config.webHost + '/msg/success?type=fund');

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });

    this.paySvc.get(1, this.appKey).then(res => {
      if (res.code === '0000') {
        this.payTypes = res.result;
        res.result.forEach(payType => {
          if (payType.isdefault) {
            this.submitForm.get('payType').setValue(payType.paytype);
          }
        });
      }
    });
  }

  setAmount(amount) {
    this.isCustom = false;
    this.submitForm.get('amount').setValue(amount);
  }

  custom() {
    this.isCustom = true;
  }

  setPayType(type) {
    this.submitForm.get('payType').setValue(type.paytype);
  }

  submit() {
    if (this.loading) {
      return false;
    }

    if (this.submitForm.get('amount').invalid) {
      this.dialogSvc.show({content: '请选择充值金额！', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }

    if (this.submitForm.get('payType').invalid) {
      this.dialogSvc.show({content: '请选择支付方式！', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }

    if (this.submitForm.get('payType').value === 'pali_6023' && this.submitForm.get('amount').value < 100) {
      this.dialogSvc.show({title: '', content: '需要充值大于等于100，充值成功后约30秒到账。', cancel: '', confirm: '我知道了'}).subscribe();
      return false;
    }

    this.loading = true;
    this.toastSvc.show('结算中', 100000, '', 'loading');
    this.rechargeSvc.recharge(this.submitForm.value).then(res => {
      if (res.code === '0000') {
        this.showType = res.result.showType;
        if (res.result.showType === 0) {
          this.loading = false;
          this.listenerTimer = observableInterval(3000).subscribe(() => {
            this.paySvc.listener(this.appKey, res.result.orderNo).then(_res => {
              if (_res.code === '0000') {
                if (_res.result.consume.paystatus !== 0) {
                  this.userInfo.balance = _res.result.userInfo.balance;
                  this.listenerTimer.unsubscribe();
                  if (_res.result.consume.paystatus === 1) {
                    this.toastSvc.hide();
                    this.router.navigate(['/msg/success'], {queryParams: {type: 'fund'}});
                  }
                  if (_res.result.consume.paystatus === 2) {
                    this.toastSvc.success('充值失败', 3000);
                  }
                  this.mask.hide();
                }
              }
            });
          });
        }
        if (res.result.showType === 1) {
          this.loading = false;
          this.toastSvc.hide();
          this.qrCodeUrl = res.result.showMsg;
          this.mask.show();
          this.listenerTimer = observableInterval(3000).subscribe(() => {
            this.paySvc.listener(this.appKey, res.result.orderNo).then(_res => {
              if (_res.code === '0000') {
                if (_res.result.consume.paystatus !== 0) {
                  this.userInfo.balance = _res.result.userInfo.balance;
                  this.listenerTimer.unsubscribe();
                  if (_res.result.consume.paystatus === 1) {
                    // this.toastSvc.success('充值成功', 3000);
                    this.router.navigate(['/msg/success'], {queryParams: {type: 'fund'}});
                  }
                  if (_res.result.consume.paystatus === 2) {
                    this.toastSvc.success('充值失败', 3000);
                  }
                  this.mask.hide();
                }
              }
            });
          });
        }
        if (res.result.showType === 2) {
        }
        if (res.result.showType === 3) {
          window.location.href = res.result.showMsg;
        }
        if (res.result.showType === 4) {
          if (this.uaSvc.isWx()) {
            window.location.href = '/redirect?redirect=' + encodeURIComponent(res.result.showMsg);
          } else {
            window.location.href = res.result.showMsg;
          }
        }
        if (res.result.showType === 5) {
          this.loading = true;
          this.toastSvc.show('结算中', 0, '', 'loading');
          this.formData = res.result.formData;
          observableTimer(1000).subscribe(() => {
            this.customForm.nativeElement.submit();
          });
        }
        if (res.result.showType === 7) {
          this.loading = false;
          this.toastSvc.hide();
          this.payQrCode = res.result.showMsg;
          this.mask.show();
        }
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
        this.loading = false;
        this.toastSvc.hide();
      }
    });
  }

  ngOnDestroy() {
    this.loading = false;
    this.toastSvc.hide();
    if (this.listenerTimer) {
      this.listenerTimer.unsubscribe();
    }
  }

}
