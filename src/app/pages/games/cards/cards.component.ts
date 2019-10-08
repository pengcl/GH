import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {LocationStrategy} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {timer as observableTimer} from 'rxjs';

import {DialogService} from 'ngx-weui';

import {SysService} from '../../../services/sys.service';
import {WxService} from '../../../modules/wx';
import {RemakeService} from '../../../services/games/remake.service';
import {Config} from '../../../config';
import {MemberService} from '../../../services/member.service';
import {getIndex} from '../../../utils/utils';
import {OverlayService} from '../../../modules/overlay';

declare var wx: any;

@Component({
  selector: 'app-games-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})
export class GamesCardsComponent implements OnInit, OnDestroy {

  appKey;
  sysConfig;

  lotteries;
  lottery;

  turnItem: number = null;
  turned: boolean = false;

  times: number;
  disabled = true;

  constructor(private router: Router,
              private location: LocationStrategy,
              private dialogSvc: DialogService,
              private overlaySvc: OverlayService,
              private authSvc: AuthService,
              private wxSvc: WxService,
              private sysSvc: SysService,
              private memberSvc: MemberService,
              private eggSvc: RemakeService) {
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.times = res.result.smashGoldEggsNum;
      }
    });

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.sysConfig = res.result;
      }
    });

    observableTimer(1000).subscribe(res => {
      this.wxSvc.config({
        title: '【广惠商城】双12『欢乐翻翻翻』正在进行中，翻牌拿大奖！',
        desc: '翻牌拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
        link: Config.webHost + '/games/card?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
        imgUrl: Config.webHost + '/assets/game/card/2.png'
      }).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
      }).catch((err: string) => {
        console.log(err);
        // this.status = `注册失败，原因：${err}`;
      });
    });

    this.eggSvc.get(this.appKey).then(res => {
      if (res.code === '0000') {
        const _item = res.result[getIndex(res.result, 'id', '00130350a3874709aca0a50b53a655bb')];
        const items = [];

        res.result.forEach(item => {
          if (item.stock < 1) {
            items.push(_item);
          } else {
            items.push(item);
          }
        });

        this.lotteries = items;
        console.log(this.lotteries);
      }
    });

    this.eggSvc.getLottery(this.appKey).then(res => {
      if (res.code === '0000') {
        this.lottery = res.result;
      }
    });
  }

  restart() {
    if (!this.turned) {
      return false;
    }
    this.turned = false;
    this.turnItem = null;
  }

  showOverlay() {
    this.location.pushState('', 'gameRule', this.location.path(), '');
    this.overlaySvc.show();
  }

  onShare(state) {
    this.wxSvc.show(state).subscribe();
    this.wxSvc.config({
      title: '小伙伴们，我翻牌获得了' + this.lottery.productName,
      desc: '【广惠商城】翻牌拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
      link: Config.webHost + '/games/card?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
      imgUrl: Config.webHost + '/assets/game/card/2.png'
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(err);
      // this.status = `注册失败，原因：${err}`;
    });
  }

  /*hit(e, index) {
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
        /!*this.userInfo.smashGoldEggsNum = this.userInfo.smashGoldEggsNum - 1;*!/
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
  }*/

  /*eggsProductId: "0212e1a0456844ee89edc23df352ec8c"
  id: "0212e1a0456844ee89edc23df352ec8c"
  logId: "2c92de216783f7360167842bac370005"
  needNum: null
  productImage: "/productImg/turnTable//1811201511411709894.jpg"
  productName: "8元商城充值券"
  productNum: 1
  productType: "product"
  remainingTimes: -1
  spellProudctId: 2773762
  stock: 2*/

  turn(index, lottery) {
    if (this.turnItem !== null) {
      return false;
    }

    this.eggSvc.lottery(this.appKey).then(res => {
      if (res.code === '0000') {
        this.lottery = res.result;
        const _index = getIndex(this.lotteries, 'id', this.lottery.id);
        const item = this.lotteries[index];
        /*this.lotteries[_index]*/
        this.lotteries[_index] = item;
        this.lotteries[index] = {
          id: this.lottery.id,
          name: this.lottery.productName,
          pic: this.lottery.productImage,
          seq: 0,
          stock: this.lottery.stock,
          type: this.lottery.productType
        };
        this.times = this.times > 0 ? this.times - 1 : this.times;
        this.turnItem = index;
        if (this.lottery.productType === 'product') {
          // this.router.navigate(['/games/qr', this.lottery.id], {queryParams: {pid: this.lottery.spellProudctId}});
        } else {
          // this.location.pushState('', 'gameRule', this.location.path(), '');
          // this.resultBoxShow = true;
        }

        observableTimer(2000).subscribe(() => {
          this.turned = true;
        });
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  back() {
    this.location.back();
  }

  ngOnDestroy() {
  }
}
