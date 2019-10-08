import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {StorageService} from '../../../../services/storage.service';
import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {MemberService} from '../../../../services/member.service';
import {DialogService} from 'ngx-weui';

@Component({
  selector: 'app-admin-setting-name',
  templateUrl: './name.component.html',
  styleUrls: ['./name.component.scss']
})
export class AdminSettingNameComponent implements OnInit {

  appKey;
  userInfo;
  settingForm: FormGroup;
  loading: boolean = false;

  constructor(private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private dialogSvc: DialogService,
              private memberSvc: MemberService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.settingForm = new FormGroup({
      // id: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(8)])
    });

    this.settingForm.get('key').setValue(this.appKey);

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });
  }

  onSubmit() {
    if (this.loading || this.settingForm.invalid) {
      return false;
    }
    this.loading = true;

    this.memberSvc.changeName(this.settingForm.value).then(res => {
      this.loading = false;
      if (res.code === '0000') {
        this.dialogSvc.show({content: res.result, cancel: '', confirm: '我知道了'}).subscribe(data => {
          window.history.back();
        });
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
