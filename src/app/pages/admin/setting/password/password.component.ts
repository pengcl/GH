import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {StorageService} from '../../../../services/storage.service';
import {DialogService} from 'ngx-weui';
import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {MemberService} from '../../../../services/member.service';

@Component({
  selector: 'app-admin-setting-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class AdminSettingPasswordComponent implements OnInit {

  appKey;

  settingForm: FormGroup;
  loading: boolean = false;

  constructor(private storageSvc: StorageService,
              private dialogSvc: DialogService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private memberSvc: MemberService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.settingForm = new FormGroup({
      // id: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      owd: new FormControl('', [Validators.required]),
      pwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPwd: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)])
    });

    this.settingForm.get('key').setValue(this.appKey);
  }

  onSubmit() {
    if (this.loading || this.settingForm.invalid) {
      return false;
    }

    if (this.settingForm.get('pwd').value !== this.settingForm.get('confirmPwd').value) {
      this.dialogSvc.show({content: '您两次输入的密码不一致', cancel: '', confirm: '我知道了'}).subscribe();
    }

    this.loading = true;

    this.memberSvc.changePwd(this.settingForm.value).then(res => {
      this.loading = false;
      if (res.code === '0000') {
        window.history.back();
      } else {
        this.dialogSvc.show({title: '系统提示', content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });

    /*this.userSvc.setting(this.settingForm.value).then(res => {
      console.log(res);
      this.loading = false;

      if (res.success) {
        this.userInfo = res.data;
      }

      this.dialog.show({
        content: res.msg,
        cancel: '',
        confirm: '我知道了'
      }).subscribe(data => {
        if (data.value) {
          window.history.back();
        }
      });
    });*/
  }
}
