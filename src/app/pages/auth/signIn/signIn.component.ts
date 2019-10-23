import {Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {interval as observableInterval, Observable} from 'rxjs';
import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {SysService} from '../../../services/sys.service';
import {LoaderService} from '../../../services/utils/loader.service';
import {DialogService} from 'ngx-weui';
import {Config} from '../../../config';
import {StorageService} from '../../../services/storage.service';

declare var initGeetest: any;

@Component({
    selector: 'app-signIn',
    templateUrl: './signIn.component.html',
    styleUrls: ['./signIn.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SignInComponent implements OnInit, OnDestroy {
    @ViewChild('container') private container: any;
    @ViewChild('userinfo') private userinfo: any;
    @ViewChild('auth') private auth: any;

    config = Config;
    callbackUrl;
    sysConfig;

    signInForm: FormGroup;
    signUpForm: FormGroup;
    isSignInFormSubmit = false;
    isSignUpFormSubmit = false;
    loading = false;

    captchaObj;
    randomValidUid;

    authHeight;

    activeText = '获取验证码';
    activeClass = true;
    second = 59;
    timePromise;

    constructor(private router: Router,
                private route: ActivatedRoute,
                private storageSvc: StorageService,
                private tabBarSvc: TabbarService,
                private sysSvc: SysService,
                private dialog: DialogService,
                private loadSvc: LoaderService,
                private authSvc: AuthService) {
        this.tabBarSvc.setActive(4);
    }

    ngOnInit() {
        this.storageSvc.remove('accessToken');
        this.callbackUrl = this.route.snapshot.queryParams['callbackUrl'];

        this.signInForm = new FormGroup({
            loginid: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
            pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
            openid: new FormControl('', [])
        });

        this.signUpForm = new FormGroup({
            loginid: new FormControl('', [Validators.required, Validators.min(10000000000), Validators.max(19999999999)]),
            pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
            validCode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(4)]),
            openid: new FormControl('', []),
            usid: new FormControl('', []),
            referee: new FormControl('', []),
            sourceChannel: new FormControl('', []),
            agree: new FormControl('', [Validators.required, Validators.requiredTrue])
        });

        const openid = this.storageSvc.get('openid') ? this.storageSvc.get('openid') : '';
        const referee = this.storageSvc.get('referee') ? this.storageSvc.get('referee') : '';
        const sourceChannel = this.storageSvc.get('sourceChannel') ? this.storageSvc.get('sourceChannel') : '';

        this.signInForm.get('openid').setValue(openid);
        this.signUpForm.get('referee').setValue(referee);
        this.signUpForm.get('sourceChannel').setValue(sourceChannel);

        this.authHeight = (this.container.nativeElement.clientHeight - this.userinfo.nativeElement.clientHeight) + 'px';

        this.randomValidUid = new Date().getTime();
        this.authSvc.getValidImg(this.randomValidUid).then(res => {
            const data = JSON.parse(res.result);
            initGeetest({
                gt: data.gt,
                challenge: data.challenge,
                product: 'popup', // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
                offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
            }, captchaObj => {
                this.handlerPopup(captchaObj);
            });
        });

        this.sysSvc.getSysConfig().then(res => {
            this.sysConfig = res.result;
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

        if (this.signUpForm.get('loginid').invalid) {
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
            phone: this.signUpForm.get('loginid').value,
            type: 1
        }).then(res => {
            if (res.code === '0000') {
                if (!this.activeClass) {
                    return false;
                }
                this.activeClass = false;
                // $scope.loadingToast.open(false);
                this.timePromise = observableInterval(1000).subscribe(() => {
                    if (this.second <= 0) {
                        this.timePromise.unsubscribe();

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
                });
            } else {
                this.dialog.show({
                    content: res.msg,
                    cancel: '',
                    confirm: '我知道了'
                }).subscribe();
            }
        });
    }

    signUp() {
        this.isSignUpFormSubmit = true;
        if (this.signUpForm.invalid) {
            if (this.signUpForm.get('loginid').valid && this.signUpForm.get('pwd').valid && this.signUpForm.get('validCode').valid && this.signUpForm.get('agree').invalid) {
                this.dialog.show({content: '请勾选用户协议', confirm: '我知道了', cancel: ''}).subscribe();
            }
            return false;
        }

        this.authSvc.signUp(this.signUpForm.value).then(res => {
            if (res.code === '0000') {
                this.storageSvc.remove('referee');
                this.storageSvc.remove('sourceChannel');
                this.storageSvc.set('accessToken', JSON.stringify({
                    id: res.result.id,
                    key: res.result.key,
                    expires_time: Date.parse(String(new Date())) + 144000000
                }));
                if (this.callbackUrl && (this.callbackUrl.indexOf('signIn') === -1 && this.callbackUrl.indexOf('signUp') === -1)) {
                    this.router.navigate([decodeURIComponent(this.callbackUrl)]);
                } else {
                    this.router.navigate(['/admin/home']);
                }
            } else {
                this.dialog.show({content: res.msg, confirm: '我知道了'}).subscribe();
            }
        });
    }

    signIn() {
        this.isSignInFormSubmit = true;
        if (this.signInForm.invalid) {
            return false;
        }

        this.authSvc.signIn(this.signInForm.value).then(res => {
            if (res.code === '0000') {
                this.storageSvc.set('accessToken', JSON.stringify({
                    id: res.result.id,
                    key: res.result.key,
                    expires_time: Date.parse(String(new Date())) + 144000000
                }));

                if (this.callbackUrl && (this.callbackUrl.indexOf('signIn') === -1 && this.callbackUrl.indexOf('signUp') === -1)) {
                    this.router.navigateByUrl(decodeURIComponent(this.callbackUrl));
                } else {
                    this.router.navigate(['/admin/home']);
                }
            } else if (res.code === '9999') {
                this.dialog.show({content: res.msg, confirm: '我知道了'}).subscribe();
            }
        });
    }

    ngOnDestroy() {
        if (this.timePromise) {
            this.timePromise.unsubscribe();
        }
    }
}
