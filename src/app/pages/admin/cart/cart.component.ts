import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';

import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {TabbarService} from '../../../modules/tabbar';
import {UaService} from '../../../services/utils/ua.service';
import {DialogService, ToastService, MaskComponent} from 'ngx-weui';
import {AuthService} from '../../../services/auth.service';
import {MemberService} from '../../../services/member.service';
import {CartService} from '../../../services/cart.service';
import {PayService} from '../../../services/pay.service';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class AdminCartComponent implements OnInit, OnDestroy {
  config = Config;

  appKey;
  userInfo;

  goods;
  totalPrice;
  tmpNum = '';
  keyboardShow = false;

  cartForm: FormGroup;
  cartsForm: FormGroup;
  submitForm: FormGroup;
  @ViewChild('customForm') private customForm;
  @ViewChild('mask') private mask: MaskComponent;
  payQrCode;
  qrCodeUrl;

  payTypes;
  showType;

  formData;
  loading = false;
  listenerTimer;

  constructor(private router: Router,
              private uaSvc: UaService,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private cartSvc: CartService,
              private paySvc: PayService) {
    this.tabBarSvc.setActive(3);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.cartForm = new FormGroup({
      spellbuyproductid: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.cartsForm = new FormGroup({
      nums: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.submitForm = new FormGroup({
      payType: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      returnUrl: new FormControl('', [Validators.required]),
    });

    this.cartForm.get('key').setValue(this.appKey);
    this.cartsForm.get('key').setValue(this.appKey);
    this.submitForm.get('key').setValue(this.appKey);

    this.submitForm.get('returnUrl').setValue(Config.webHost + '/msg/success?type=cart');

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });

    this.cartSvc.getCarts(this.appKey).then(res => {
      if (res.code = '0000') {
        this.goods = res.result;
        console.log(this.goods);
        if (this.goods) {
          this.updateCount();
        }
      }
    });

    this.memberSvc.getMember(this.appKey).then(res => this.userInfo = res.result).then((userInfo) => {
      if (userInfo) {
        this.paySvc.get(2, this.appKey).then(res => {
          if (res.code = '0000') {
            const payTypes = [];
            res.result.forEach(payType => {
              if (payType.paytype === 'balance') {
                payType.balance = this.userInfo.balance;
              }
              if (payType.paytype === 'integral') {
                payType.balance = this.userInfo.commissionpoints;
              }
              payTypes.push(payType);
              this.payTypes = payTypes;
              if (payType.isdefault) {
                this.submitForm.get('payType').setValue(payType.paytype);
              }
            });
          }
        });
      }
    });
  }

  onChange(id, e) {
    this.cartForm.get('spellbuyproductid').setValue(id);
    this.cartForm.get('qty').setValue(e);
    this.cartSvc.addCart(this.cartForm.value).then((res) => {
      this.updateCount();
    });
  }

  onConfirm(e) {
    if (e === 'confirm') {
      this.router.navigate(['/index']);
    }
  }

  updateCount() {
    let totalPrice = 0;
    this.goods.forEach(item => {
      totalPrice = totalPrice + item.product_num * item.singleprice;
      this.totalPrice = totalPrice;
    });
  }

  remove(item) {
    this.cartSvc.removeCart({key: this.appKey, cartId: item.id}).then(res => {
      let msg;
      if (res.code === '0000') {
        this.goods = res.result.cartProducts;
        this.cartSvc.updateCount(res.result.goodsCount);
        this.updateCount();
        msg = '移除商品成功';
      } else {
        msg = res.msg;
      }
      this.dialogSvc.show({content: msg, cancel: '', confirm: '我知道了'}).subscribe();
    });
  }

  showKeyboard() {
    this.keyboardShow = !this.keyboardShow;
  }

  num(num) {
    if (this.tmpNum.length === 0 && num === '0') {
      return false;
    }
    this.tmpNum = this.tmpNum + num;
  }

  delete() {
    this.tmpNum = this.tmpNum.slice(0, -1);
  }

  sure() {
    if (!this.tmpNum) {
      this.showKeyboard();
      return false;
    }
    const num = parseInt(this.tmpNum, 10);
    this.cartsForm.get('nums').setValue(num);
    this.cartSvc.updateCarts(this.cartsForm.value).then(res => {
      if (res.code !== '0000') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else {
        this.goods = res.result.cartProducts;
        this.cartSvc.updateCount(res.result.goodsCount);
        this.updateCount();
      }
    });
    this.showKeyboard();
  }

  clear() {
    this.cartSvc.clearCart(this.appKey).then(res => {
      if (res.code === '0000') {
        this.goods = res.result.cartProducts;
        this.cartSvc.updateCount(res.result.goodsCount);
        this.updateCount();
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  setPayType(type) {
    this.submitForm.get('payType').setValue(type.paytype);
  }

  submit() {
    if (this.loading || this.submitForm.invalid) {
      return false;
    }

    this.loading = true;
    this.toastSvc.show('结算中', 100000, '', 'loading');
    this.paySvc.pay(this.submitForm.value).then(res => {
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
                    this.router.navigate(['/msg/success'], {queryParams: {type: 'cart', orderNo: res.result.orderNo}});
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
                    this.toastSvc.success('充值成功', 3000);
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
            window.location.href = '/redirect?redirect=' + res.result.showMsg;
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
        console.log(res);
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
        this.loading = false;
        this.toastSvc.hide();
      }
    });
  }

  ngOnDestroy() {
    this.loading = false;
    this.toastSvc.hide();
  }

}
