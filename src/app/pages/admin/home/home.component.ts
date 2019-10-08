import {Component, OnInit, ViewChild} from '@angular/core';

import {Router} from '@angular/router';
import {StorageService} from '../../../services/storage.service';
import {TabbarService} from '../../../modules/tabbar';
import {DialogService, MaskComponent} from 'ngx-weui';
import {AuthService} from '../../../services/auth.service';
import {MemberService} from '../../../services/member.service';
import {SysService} from '../../../services/sys.service';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class AdminHomeComponent implements OnInit {
  config = Config;

  @ViewChild('mask') mask: MaskComponent;

  appKey;
  userInfo;

  customerQrCode;

  constructor(private router: Router,
              private storageSvc: StorageService,
              private dialogSvc: DialogService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private sysSvc: SysService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
        // 打地鼠领奖逻辑
        /*console.log(this.userInfo);
        if (res.result.isWinGame === 1) {
          this.dialogSvc.show({content: '您在打地鼠游戏中获得了奖品，现在去领奖吗？', cancel: '不了', confirm: '是的'}).subscribe(data => {
            if (data.value) {
              this.router.navigate(['/games/receive']);
            }
          })
        }*/
      }
    });

  }

  contact() {
    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.customerQrCode = res.result.customerQrCode;
        this.mask.show();
      }
    });
  }

  sign() {
    this.memberSvc.sign(this.appKey).then(res => {
      let msg = '';
      if (res.code === '0000') {
        msg = '您本次签到获得' + res.result.point + '福分';
        this.userInfo = res.result.userInfo;
      } else {
        msg = res.msg;
      }
      this.dialogSvc.show({content: msg, cancel: '签到规则?', confirm: '我知道了'}).subscribe(data => {
        if (!data.value) {
          this.router.navigate(['/admin/article/rule/sign']);
        }
      });
    });
  }

  logout() {
    this.storageSvc.remove('accessToken');
    this.router.navigate(['/auth/signIn']);
  }

}
