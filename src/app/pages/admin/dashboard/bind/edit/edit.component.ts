import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {TabbarService} from '../../../../../modules/tabbar/index';
import {AuthService} from '../../../../../services/auth.service';
import {DialogService} from 'ngx-weui';
import {MemberService} from '../../../../../services/member.service';

@Component({
  selector: 'admin-setting-bind-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class AdminDashboardBindEditComponent implements OnInit {

  appKey;
  distributor;

  bindForm: FormGroup;
  loading = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialog: DialogService,
              private authSvc: AuthService,
              private memberSvc: MemberService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();

    this.bindForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      id: new FormControl('', [Validators.required]),
      remark: new FormControl('', [Validators.required]),
      isCanRecharge: new FormControl('', [Validators.required]),
    });

    this.bindForm.get('key').setValue(this.appKey);
    this.memberSvc.getMobile(this.appKey, this.route.snapshot.params['id']).then(res => {
      if (res.code === '0000') {
        console.log(res.result);
        this.distributor = res.result;
        this.bindForm.get('id').setValue(res.result.id);
        this.bindForm.get('remark').setValue(res.result.remark);
        this.bindForm.get('isCanRecharge').setValue(res.result.isCanRecharge);
        console.log(this.bindForm.value);
      }
    });

    this.bindForm.get('key').setValue(this.appKey);
    this.bindForm.get('isCanRecharge').setValue(0);
  }

  setCanRecharge() {
    const value = this.bindForm.get('isCanRecharge').value ? 0 : 1;
    this.bindForm.get('isCanRecharge').setValue(value);
    console.log(this.bindForm.value);
  }

  edit() {
    if (this.bindForm.invalid) {
      return false;
    }

    this.memberSvc.editMobile(this.bindForm.value).then(res => {
      if (res.code === '0000') {
        this.dialog.show({content: '修改成功', cancel: '', confirm: '我知道了'}).subscribe(data => {
          window.history.back();
        });
      } else {
        this.dialog.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }
}
