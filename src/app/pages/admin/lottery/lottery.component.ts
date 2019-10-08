import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {timer as observableTimer} from 'rxjs/index';

import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {MemberService} from '../../../services/member.service';
import {LotteryService} from '../../../services/lottery.service';
import {DialogService, ToastService} from 'ngx-weui';
import {SysService} from '../../../services/sys.service';
import {ShareService} from '../../../services/share.service';
import {WxComponent, WxService} from '../../../modules/wx';

import {Config} from '../../../config';
import {getIndex} from '../../../utils/utils';

@Component({
  selector: 'app-admin-lottery',
  templateUrl: './lottery.component.html',
  styleUrls: ['./lottery.component.scss']
})
export class AdminLotteryComponent implements OnInit, OnDestroy {
  config = Config;

  appKey;
  userInfo;

  @ViewChild(WxComponent) private wc;

  lotteries;
  lottery;
  starting = false;

  count = 0;
  index = 0;
  prizeNum = 3;
  prize;

  winners;
  winner;
  sysConfig;

  constructor(private router: Router,
              private tabBarSvc: TabbarService,
              private sysSvc: SysService,
              private wxSvc: WxService,
              private dialogSvc: DialogService,
              private toastSvc: ToastService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private shareSvc: ShareService,
              private lotterySvc: LotteryService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getStorageKey();

    observableTimer(1000).subscribe(() => {
      this.wxSvc.config({
        title: '【广惠商城】好运转盘，100%中奖，实物好礼每天送！',
        desc: '新用户注册后分享即送一次转盘机会哦，转盘礼品等着您！',
        link: Config.webHost + '/admin/lottery?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
        imgUrl: Config.webHost + '/assets/images/lottery.jpg'
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
      }).catch((err: string) => {
        console.log(err);
        // this.status = `注册失败，原因：${err}`;
      });
    });

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.sysConfig = res.result;
      }
    });

    this.memberSvc.getMember(this.appKey).then(res => { // 拒绝跳转至登录页
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });

    this.lotterySvc.get().then(res => {
      if (res.code === '0000') {
        this.lotteries = res.result;
      }
    });

    /*this.lotterySvc.getLottery(this.appKey).then(res => {
      console.log('......getLottery');
      console.log(res);
    });*/

    this.lotterySvc.getWinners().then(res => {
      if (res.code === '0000') {
        this.winners = res.result;
        this.winner = this.winners[Math.floor(Math.random() * this.winners.length)];
        setInterval(() => {
          this.winner = this.winners[Math.floor(Math.random() * this.winners.length)];
        }, 2000);
      }
    });
  }

  rouletteStart() {
    if (this.index <= 7) {
      this.index = this.index + 1;
    } else if (this.index === 8 && this.count < 5) {
      this.index = 0;
      this.count = this.count + 1;
    } else {
      this.index = 0;
      this.rouletteEnd();
      return false;
    }
    setTimeout(() => {
      this.rouletteStart();
    }, 60);
  }

  rouletteEnd() {
    if (this.index <= this.prizeNum) {
      this.index = this.index + 1;
    } else {
      setTimeout(() => {
        let msg = this.lottery.productType === 'integral' ? '恭喜您，获得' + this.lottery.productName + '，福分已充值至您的账户，请您查收！' : '恭喜您，获得' + this.lottery.productName + '，请您在个人中心“获得商品”配置您的收货地址！现在马上分享出去，可以获得200福分哦！';
        this.starting = false;
        if (this.lottery.productName === '5元充值券') {
          msg = '恭喜您，获得' + this.lottery.productName + '，充值券已充值至您的账户，请您查收！'
        }
        if (this.lottery.productType === 'integral' || this.lottery.productName === '5元充值券') {
          this.wxSvc.config({
            title: '【广惠商城】好运转盘，100%中奖，实物好礼每天送！',
            desc: '新用户注册后分享即送一次转盘机会哦，转盘礼品等着您！',
            link: Config.webHost + '/admin/lottery?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
            imgUrl: Config.webHost + '/assets/images/lottery.jpg'
          }).then(() => {
            // 其它操作，可以确保注册成功以后才有效
            // this.status = '注册成功';
          }).catch((err: string) => {
            console.log(err);
            // this.status = `注册失败，原因：${err}`;
          });

          this.dialogSvc.show({
            content: msg,
            cancel: '',
            confirm: '我知道了'
          }).subscribe();
        } else {
          this.router.navigate(['/admin/lottery/qr', this.lottery.id], {queryParams: {pid: this.lottery.spellProudctId}});
          /*this.dialogSvc.show({
            content: msg,
            cancel: '不要了',
            confirm: '马上分享'
          }).subscribe(data => {
              if (data.value) {
                this.wxSvc.config({
                  title: '我抽到奖品啦！',
                  desc: '我在广惠商城大转盘里面抽到了' + this.lottery.productName + '，我邀请您，一起来转一转！',
                  link: Config.webHost + '/admin/lottery?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
                  imgUrl: Config.webHost + '/assets/images/lottery.jpg'
                }).then(() => {
                  // 其它操作，可以确保注册成功以后才有效
                  // this.status = '注册成功';
                  this.onShare({targetTips: '来邀请好友吧', targetContent: '从分享链接注册的用户都将成为您的好友'});
                }).catch((err: string) => {
                  console.log(err);
                  // this.status = `注册失败，原因：${err}`;
                });
              }
            }
          );*/
        }
      }, 500);
      this.count = 0;
      return false;
    }
    setTimeout(() => {
      this.rouletteEnd();
    }, 200);
  }

  start() {
    if (!this.appKey) {
      this.appKey = this.authSvc.getKey();
      return false;
    }
    if (this.starting) {
      return false;
    }
    this.starting = true;
    if (this.userInfo && this.userInfo.turntableNum > 0) {
      this.lotterySvc.lottery(this.appKey).then(res => {
        if (res.code === '0000') {
          this.userInfo.turntableNum = this.userInfo.turntableNum - 1;
          this.lottery = res.result;

          this.prizeNum = getIndex(this.lotteries, 'turntableproductid', this.lottery.id) - 1;
          this.rouletteStart();
        } else {
          this.starting = false;
          this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
        }
      });
    } else {
      this.starting = false;
      this.dialogSvc.show({
        content: '剩余转盘次数为零!',
        cancel: '',
        confirm: '我知道了'
      }).subscribe();
    }
  }

  onShare(state) {
    this.wxSvc.show(state).subscribe();
  }

  ngOnDestroy() {
    this.wxSvc.destroy(this.wc);
  }

}
