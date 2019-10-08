import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

import {AuthService} from '../../../services/auth.service';
import {DialogService} from 'ngx-weui';
import {WebSocketService} from '../../../services/webSocket.service';
import {OverlayService} from '../../../modules/overlay';
import {timer as observableTimer} from 'rxjs/index';
import {Config} from '../../../config';
import {SysService} from '../../../services/sys.service';
import {WxService} from '../../../modules/wx';
import {EggService} from '../../../services/games/egg.service';
import {MemberService} from '../../../services/member.service';

declare var wx: any;

@Component({
  selector: 'app-games-egg',
  templateUrl: './egg.component.html',
  styleUrls: ['./egg.component.scss']
})

export class GamesEggComponent implements OnInit, OnDestroy {

  appKey;
  /*userInfo;*/

  audioPlaying: boolean = true;
  clicked: boolean = false;

  x = 0;
  y = 0;

  lottery;
  hasLottery: Boolean = false;
  prizeNum: number;
  resultBoxShow;
  eggBroken = false;

  sysConfig;

  @ViewChild('audio') private audio: ElementRef;

  constructor(private domSanitizer: DomSanitizer,
              private router: Router,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private wsSvc: WebSocketService,
              private overlaySvc: OverlayService,
              private wxSvc: WxService,
              private sysSvc: SysService,
              private authSvc: AuthService,
              private memberSvc: MemberService,
              private eggSvc: EggService) {
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.sysConfig = res.result;
      }
    });

    observableTimer(1000).subscribe(res => {
      this.wxSvc.config({
        title: '【广惠商城】迎中秋打地鼠活动正在进行中，玩游戏拿大奖！',
        desc: '玩游戏拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
        link: Config.webHost + '/games/egg?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
        imgUrl: Config.webHost + '/assets/game/mouse/img/logo.png'
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
        wx.ready(() => {
          this.audio.nativeElement.play();
        });
      }).catch((err: string) => {
        console.log(err);
        // this.status = `注册失败，原因：${err}`;
      });
    });

    this.eggSvc.getLottery(this.appKey).then(res => {
      if (res.code === '0000') {
        this.hasLottery = true;
        this.lottery = res.result;
      }
    });

    /*this.memberSvc.getMember(this.appKey).then(res => { // 拒绝跳转至登录页
      if (res.code === '0000') {
        this.userInfo = res.result;
      }
    });*/

    document.addEventListener('WeixinJSBridgeReady', () => {
      this.audio.nativeElement.play();
    }, false);
    document.addEventListener('YixinJSBridgeReady', () => {
      this.audio.nativeElement.play();
    }, false);
  }

  onShare(state) {
    this.wxSvc.show(state).subscribe();
    this.wxSvc.config({
      title: '小伙伴们，我砸金蛋获得了' + this.lottery.productName,
      desc: '【广惠商城】玩游戏拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
      link: Config.webHost + '/games/egg?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
      imgUrl: Config.webHost + '/assets/game/egg/egg2.png'
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(err);
      // this.status = `注册失败，原因：${err}`;
    });
  }

  play() {
    if (this.audioPlaying) {
      this.audio.nativeElement.pause();
    } else {
      this.audio.nativeElement.play();
    }
    this.audioPlaying = !this.audioPlaying;
  }

  showOverlay() {
    this.location.pushState('', 'gameRule', this.location.path(), '');
    this.overlaySvc.show();
  }

  hit(e, index) {
    this.x = e.clientX;
    this.y = e.clientY;

    if (this.clicked) {
      return false;
    }

    this.clicked = true;

    observableTimer(300).subscribe(() => {
      this.clicked = false;
    });

    if (!this.appKey) {
      this.appKey = this.authSvc.getKey();
      return false;
    }
    this.eggSvc.lottery(this.appKey).then(res => {
      if (res.code === '0000') {
        /*this.userInfo.smashGoldEggsNum = this.userInfo.smashGoldEggsNum - 1;*/
        this.lottery = res.result;
        this.prizeNum = index;
        this.eggBroken = true;
        if (this.lottery.productType === 'product') {
          this.router.navigate(['/games/qr', this.lottery.id], {queryParams: {pid: this.lottery.spellProudctId}});
        } else {
          this.location.pushState('', 'gameRule', this.location.path(), '');
          this.resultBoxShow = true;
        }
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  getRecords() {
    if (this.lottery.productType === 'product') {
      this.router.navigate(['/games/qr', this.lottery.id], {queryParams: {pid: this.lottery.spellProudctId}});
    } else {
      this.location.pushState('', 'gameRule', this.location.path(), '');
      this.resultBoxShow = true;
    }
  }

  restart() {
    this.resultBoxShow = false;
    this.eggBroken = false;
    this.lottery = null;
    this.prizeNum = null;
    this.location.back();
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
  }
}

// todo https://i.hd.fkw.com/version2/?_reg=true
