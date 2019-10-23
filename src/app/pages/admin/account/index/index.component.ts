import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';

import {TabbarService} from '../../../../modules/tabbar';
import {UaService} from '../../../../services/utils/ua.service';
import {DialogService, ToastService, MaskComponent} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {MemberService} from '../../../../services/member.service';
import {AccountService} from '../../../../services/account.service';

import {Config} from '../../../../config';

@Component({
    selector: 'app-admin-account-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss']
})
export class AdminAccountIndexComponent implements OnInit, OnDestroy {
    config = Config;

    appKey;
    userInfo;
    form: FormGroup;
    transferForm: FormGroup;
    type: 'withdrawal' | 'transfer' = 'withdrawal';
    withdrawalStatus = {
        loading: false,
        submit: false
    };
    transferStatus = {
        loading: false,
        submit: false
    };

    constructor(private router: Router,
                private location: LocationStrategy,
                private uaSvc: UaService,
                private tabBarSvc: TabbarService,
                private dialogSvc: DialogService,
                private toastSvc: ToastService,
                private authSvc: AuthService,
                private memberSvc: MemberService,
                private accountSvc: AccountService) {
        this.tabBarSvc.setActive(4);
    }

    ngOnInit() {
        this.appKey = this.authSvc.getKey();
        this.form = new FormGroup({
            key: new FormControl(this.authSvc.getKey(), [Validators.required]),
            money: new FormControl('', [Validators.required]),
            bankuser: new FormControl('', [Validators.required]),
            bankname: new FormControl('', [Validators.required]),
            banksubbranch: new FormControl('', [Validators.required]),
            bankno: new FormControl('', [Validators.required]),
            phone: new FormControl('', [Validators.required])
        });
        this.transferForm = new FormGroup({
            key: new FormControl(this.authSvc.getKey(), [Validators.required]),
            amount: new FormControl('', [Validators.required])
        });
        this.getData();
    }

    getData() {
        this.memberSvc.getMember(this.appKey).then(res => {
            if (res.code === '0000') {
                this.userInfo = res.result;
            }
        });
    }

    setType() {
        this.type = this.type === 'withdrawal' ? 'transfer' : 'withdrawal';
    }

    withdrawal() {
        this.withdrawalStatus.submit = true;
        if (this.withdrawalStatus.loading || this.form.invalid) {
            return false;
        }

        this.withdrawalStatus.loading = true;

        this.accountSvc.withdrawals(this.form.value).then(res => {
            this.withdrawalStatus.loading = false;
            if (res.code === '0000') {
                this.getData();
                this.dialogSvc.show({content: '申请成功', cancel: '返回', confirm: '继续提现'}).subscribe(status => {
                    if (!status.value) {
                        this.location.back();
                    }
                });
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

        this.accountSvc.transfer(this.transferForm.value).then(res => {
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
        this.toastSvc.hide();
    }

}
