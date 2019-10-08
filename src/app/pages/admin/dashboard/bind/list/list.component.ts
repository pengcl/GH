import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {TabbarService} from '../../../../../modules/tabbar/index';
import {AuthService} from '../../../../../services/auth.service';
import {MemberService} from '../../../../../services/member.service';
import {DialogService} from 'ngx-weui';
import {Config} from '../../../../../config';

@Component({
  selector: 'admin-setting-bind-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class AdminDashboardBindListComponent implements OnInit {

  appKey;
  mobiles;

  bindForm: FormGroup;
  isSubmit = false;
  loading = false;

  constructor(private router: Router,
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
    });
    this.bindForm.get('key').setValue(this.appKey);

    this.memberSvc.getMobiles({key: this.appKey, rows: 10, page: 1}).then(res => {
      if (res.code === '0000') {
        this.mobiles = res.result;
        console.log(this.mobiles);
      }
    });
  }

  remove(id) {
    this.bindForm.get('id').setValue(id);
    this.memberSvc.removeMobile(this.bindForm.value).then(res => {
    });
  }
}
