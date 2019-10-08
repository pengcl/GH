import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {LoaderService} from '../../../services/utils/loader.service';
import {DialogService} from 'ngx-weui';
import {Config} from '../../../config';
import {StorageService} from '../../../services/storage.service';

declare var initGeetest: any;

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {

  forgotForm: FormGroup;
  isSubmit = false;
  loading = false;

  captchaObj;
  randomValidUid = new Date().getTime();

  authHeight;

  activeText = '获取验证码';
  activeClass = true;
  second = 59;
  timePromise = undefined;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private dialog: DialogService,
              private loadSvc: LoaderService,
              private authSvc: AuthService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {

    this.forgotForm = new FormGroup({
      loginid: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      validCode: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]{4}$/)])
    });

    this.authSvc.getValidImg(this.randomValidUid).then(res => {
      const data = JSON.parse(res.result);
      initGeetest({
        gt: data.gt,
        challenge: data.challenge,
        product: 'popup', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
        offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
      }, (captchaObj) => {
        this.handlerPopup(captchaObj);
      });
    });
  }

  handlerPopup(captchaObj) {
    this.captchaObj = captchaObj;
    // 弹出式需要绑定触发验证码弹出按钮
    captchaObj.bindOn('#sendValidCode');

    // 将验证码加到id为captcha的元素里
    captchaObj.appendTo('#popup-captcha');
  }

  sendValidCode() {

    if (!this.activeClass) {
      return false;
    }

    if (this.forgotForm.get('loginid').invalid) {
      this.dialog.show({
        content: '请输入手机号！',
        cancel: '',
        confirm: '我知道了'
      }).subscribe(data => {
      });
    }

    const validate = this.captchaObj.getValidate();
    if (!validate) {
      alert('请先完成验证！');
      return false;
    }

    this.authSvc.sendValidCode({
      geetest_challenge: validate.geetest_challenge,
      geetest_validate: validate.geetest_validate,
      geetest_seccode: validate.geetest_seccode,
      randomValidUid: this.randomValidUid,
      phone: this.forgotForm.get('loginid').value,
      type: 2
    }).then(res => {
      if (res.code === '0000') {
        if (!this.activeClass) {
          return false;
        }
        this.activeClass = false;
        // $scope.loadingToast.open(false);
        this.timePromise = setInterval(() => {
          if (this.second <= 0) {
            clearInterval(this.timePromise);
            this.timePromise = undefined;

            this.second = 59;
            this.activeText = '重发验证码';
            this.activeClass = true;
            document.getElementById('sendValidCode').style.display = 'block';
            document.getElementById('origin_sendValidCode').style.display = 'none';
          } else {
            document.getElementById('sendValidCode').style.display = 'none';
            document.getElementById('origin_sendValidCode').style.display = 'block';
            this.activeText = '' + this.second + 's';
            this.activeClass = false;
            this.second = this.second - 1;
          }
        }, 1000);
      } else {
        this.dialog.show({
          content: res.msg,
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }

  forgot() {
    this.isSubmit = true;
    if (this.forgotForm.invalid) {
      return false;
    }

    this.authSvc.forgot(this.forgotForm.value).then(res => {
      if (res.code === '0000') {
        this.dialog.show({content: res.result, cancel: '', confirm: '我知道了'}).subscribe(data => {
          if (data.value) {
            this.router.navigate(['/auth/signIn']);
          }
        });
      } else {
        this.dialog.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }
}
