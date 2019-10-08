import {Component, OnInit, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import {LocationStrategy} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {Config} from '../../../config';
import {UaService} from '../../../services/utils/ua.service';
import {DialogService, MaskComponent} from 'ngx-weui';
import {OverlayService} from '../../../modules/overlay';
import {AuthService} from '../../../services/auth.service';
import {WebSocketService} from '../../../services/webSocket.service';
import {SysService} from '../../../services/sys.service';
import {WxService} from '../../../modules/wx';
import {MemberService} from '../../../services/member.service';
import {MouseService} from '../../../services/games/mouse.service';

declare var wx: any;

// 找出 show = false 的对象
let quantity = [];

function getRestIds(mouses) {
  const ids = [];
  mouses.forEach((item, i) => {
    if (!item.show) {
      ids.push(i);
    }
  });
  return ids;
}

function getType() {
  let a = 0;

  // 几率
  const r = [];
  quantity.forEach(function (item) {
    a = a + item;
  });

  // 计算几率
  quantity.forEach(function (item, i) {
    r[i] = quantity[i] / a;
  });

  const random = Math.random();

  let type = null;
  let _r = 0;
  r.forEach(function (item, i) {
    _r = _r + item;
    if (random < _r) {
      if (type === null) {
        type = i;
      }
    }
  });
  quantity[type] = quantity[type] - 1;
  return type;
}

function getMouses(mouses, showIds) {
  showIds.forEach((id) => {
    const type = getType();
    mouses[id] = {
      type: type,
      show: true,
      beat: type === 0 ? 2 : 1,
      score: (function () {
        if (type === 0) {
          return 1;
        }
        if (type === 1) {
          return 3;
        }
        if (type === 2) {
          return 2;
        }
        if (type === 3) {
          return -1;
        }
      })(),
      img: '/assets/game/mouse/images/' + type + '.png'
    };
  });
  return mouses;
}

function resetMouses(mouses, showIds) {
  showIds.forEach((id) => {
    mouses[id] = {
      type: mouses[id].type,
      show: false,
      beat: (function () {
        if (mouses[id] === 0) {
          return 2;
        } else {
          return 1;
        }
      })(),
      score: mouses[id].score,
      img: mouses[id].img
    };
  });
  return mouses;
}

// 从剩余数组中随机获取数据,组成新数组;
function getRandomFormIds(restIds) {
  const result = [];
  let len = 0;
  do {
    len = Math.floor(Math.random() * restIds.length);
  } while (len === 0 || len > 4);
  do {
    const index = Math.floor(Math.random() * restIds.length);
    if (result.indexOf(restIds[index]) === -1) {
      result.push(restIds[index]);
    }
  } while (result.length !== len);
  return result.sort((a, b) => {
    return a - b;
  });
}

@Component({
  selector: 'app-games-mouse',
  templateUrl: './mouse.component.html',
  styleUrls: ['./mouse.component.scss']
})

export class GamesMouseComponent implements OnInit, OnDestroy {

  appKey;
  uid;
  x = 0;
  y = 0;
  mouses = (() => {
    const mouses = [];
    for (let i = 0; i < 12; i++) {
      mouses.push({
        type: 0,
        show: false,
        beat: 1,
        score: 1,
        img: '/assets/game/mouse/images/0.png'
      });
    }
    return mouses;
  })();

  scores = (() => {
    const mouses = [];
    for (let i = 0; i < 12; i++) {
      mouses.push({
        s: false,
        n: 0
      });
    }
    return mouses;
  })();

  audioPlaying = true;

  gameRule; // 游戏规则
  id; // 游戏id

  // 总游戏时间
  time = 90;

  timer = null;
  setMousesTimer = null;
  resetMousesTimer = null;

  scoreForm: FormGroup;
  curScore = 0;
  curHit;
  scoreChanged = false;
  clicked = false;

  readyTimer = null;
  readyTime = 3;


  // 默认
  gameTipsShow = true; // 玩法介绍
  readyTimerShow = null; // 预备开始
  topBarShow = null; // topBar
  gameStatusShow = null; // 游戏得分
  startBtnShow = true; // 开始按钮
  restartBtnShow = null; // 重新开始按钮
  topShow = false; // 排行榜

  topResultShow = false;

  tops;

  gameNum: number = 0;

  @ViewChild('audio') private audio: ElementRef;
  @ViewChild('gameTop') private gameTop: MaskComponent;
  @ViewChild('topResult') private topResult: MaskComponent;

  constructor(private location: LocationStrategy,
              private domSanitizer: DomSanitizer,
              private overlaySvc: OverlayService,
              private wsSvc: WebSocketService,
              private dialogSvc: DialogService,
              private uaSvc: UaService,
              private authSvc: AuthService,
              private wxSvc: WxService,
              private sysSvc: SysService,
              private memberSvc: MemberService,
              private mouseSvc: MouseService) {
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.showTopResult();

    this.location.onPopState(state => {
      this.overlaySvc.hide();
    });

    this.uid = this.authSvc.getUid();

    this.scoreForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      score: new FormControl('', [Validators.required]),
      totalScore: new FormControl('', [Validators.required]),
      ranking: new FormControl('', [Validators.required])
    });

    this.scoreForm.get('key').setValue(this.appKey);
    this.scoreForm.get('score').setValue(0);

    this.scoreForm.get('score').valueChanges.subscribe((value) => {
      this.scoreChanged = true;
      observableTimer(300).subscribe(() => {
        this.scoreChanged = false;
      });
    });

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.gameRule = this.domSanitizer.bypassSecurityTrustHtml(res.result.gameRule);
      }
    });

    this.memberSvc.getMember(this.appKey).then(res => {
      if (res.code === '0000') {
        this.gameNum = res.result.gameNum ? res.result.gameNum : 0;
      }
    });

    this.wsSvc.create().subscribe(res => {
      res = JSON.parse(res);
      if (res.code === '0000') {
        if (res.result.action === 'molesGameStart') {
          this.gameNum = this.gameNum - 1;
          this.readyStart();
          this.id = res.result.id;
          quantity = res.result.quantity;
        }

        if (res.result.action === 'molesGameHit') {
          this.curScore = res.result.curScore;
          this.setScore(this.curHit, res.result.curScore);
          observableTimer(1300).subscribe(() => {
            this.curScore = 0;
          });
          this.scoreForm.get('score').setValue(res.result.totalScore);
        }

        if (res.result.action === 'molesGameEnd') {
          this.scoreForm.get('score').setValue(res.result.score);
          this.scoreForm.get('totalScore').setValue(res.result.totalScore);
          this.scoreForm.get('ranking').setValue(res.result.ranking);

          this.mouseSvc.tops(this.appKey, 1).then(tops => {
            this.tops = tops.result;
          });
        }
      } else if (res.code === '9998') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else if (res.code === '8888') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else if (res.code === '9999') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else {
        /*this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();*/
      }
    });

    this.mouseSvc.tops(this.appKey, 1).then(res => {
      this.tops = res.result;
    });

    observableTimer(1000).subscribe(res => {
      this.wxSvc.config({
        title: '【广惠商城】迎中秋打地鼠活动正在进行中，玩游戏拿大奖！',
        desc: '玩游戏拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
        link: Config.webHost + '/games/mouse?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
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

    document.addEventListener('WeixinJSBridgeReady', () => {
      this.audio.nativeElement.play();
    }, false);
    document.addEventListener('YixinJSBridgeReady', () => {
      this.audio.nativeElement.play();
    }, false);
  }

  setScore(index, score) {
    this.scores[index].s = true;
    this.scores[index].n = score;
    observableTimer(1000).subscribe(() => {
      this.scores[index].s = false;
      this.scores[index].n = 0;
    });
  }

  setMouses() {
    const restIds = getRestIds(this.mouses);
    const showIds = getRandomFormIds(restIds);
    this.mouses = getMouses(this.mouses, showIds);
    this.resetMousesTimer = observableTimer(3000).subscribe(() => {
      this.mouses = resetMouses(this.mouses, showIds);
    });
  }

  // 显示当前倒计时所剩时间
  timeShow() {
    this.timer = observableInterval(1000).subscribe(res => {
      this.time = this.time - 1;
      if (this.time === 0) {
        this.over();
      }
    });
  }

  checkStart() {
    this.wsSvc.send({key: this.appKey, action: 'molesGameStart'});
  }

  readyStart() {
    this.gameTipsShow = false;
    this.readyTimerShow = true;
    this.startBtnShow = false;
    this.topBarShow = true;
    this.readyTimer = observableInterval(1000).subscribe(() => {
      this.readyTime = this.readyTime - 1;
      if (this.readyTime === 0) {
        this.start();
        this.readyTimer.unsubscribe();
      }
    });
  }

  start() {
    this.readyTimerShow = false;
    this.timeShow();
    this.setMousesTimer = observableInterval(2000).subscribe(() => {
      this.setMouses();
    });
  }

  restart() {
    this.time = 90;
    this.restartBtnShow = false;
    this.readyTime = 3;
    this.gameStatusShow = false;
    this.gameTipsShow = true;
    this.mouses = (() => {
      const mouses = [];
      for (let i = 0; i < 12; i++) {
        mouses.push({
          type: 0,
          show: false,
          beat: 1,
          score: 1,
          img: '/assets/game/mouse/images/0.png'
        });
      }
      return mouses;
    })();
    this.scoreForm.get('score').setValue(0);
    this.wsSvc.send({key: this.appKey, action: 'molesGameStart'});
  }

  beat(mouse, index, e) {
    this.curHit = index;
    this.x = e.clientX;
    this.y = e.clientY;
    this.clicked = true;

    observableTimer(300).subscribe(() => {
      this.clicked = false;
    });
    if (mouse.beat > 0) {
      this.mouses[index].beat = this.mouses[index].beat - 1;
      this.mouses[index].img = mouse.img.replace('.png', '_hit.png');
      // webSocket
      this.wsSvc.send({key: this.appKey, action: 'molesGameHit', id: this.id, type: mouse.type});
    }
  }

  over() {
    this.gameStatusShow = true;
    this.restartBtnShow = true;
    this.topBarShow = false;
    if (this.timer) {
      this.timer.unsubscribe();
    }
    if (this.setMousesTimer) {
      this.setMousesTimer.unsubscribe();
    }
    if (this.resetMousesTimer) {
      this.resetMousesTimer.unsubscribe();
    }

    // webSocket
    this.wsSvc.send({key: this.appKey, action: 'molesGameEnd', id: this.id});
  }

  play() {
    if (this.audioPlaying) {
      this.audio.nativeElement.pause();
    } else {
      this.audio.nativeElement.play();
    }
    this.audioPlaying = !this.audioPlaying;
  }

  pause() {
    this.audio.nativeElement.pause();
  }

  showTop() {
    this.topShow = !this.topShow;
    if (this.topShow) {
      this.gameTop.show();
    } else {
      this.gameTop.hide();
    }
  }

  showTopResult() {
    this.topResultShow = !this.topResultShow;
    if (this.topResultShow) {
      this.topResult.show();
    } else {
      this.topResult.hide();
    }
  }

  showOverlay() {
    this.location.pushState('', 'gameRule', this.location.path(), '');
    this.overlaySvc.show();
  }

  back() {
    this.location.back();
  }

  next(currPage, totalPages) {
    if (currPage === totalPages) {
      return false;
    }
    this.mouseSvc.tops(this.appKey, currPage + 1).then(res => {
      this.tops = res.result;
    });
  }

  prev(currPage, totalPages) {
    if (currPage <= 1) {
      return false;
    }
    this.mouseSvc.tops(this.appKey, currPage - 1).then(res => {
      this.tops = res.result;
    });
  }

  onDefaultShare(state) {
    this.wxSvc.show(state).subscribe();
  }

  onShare(state) {
    this.wxSvc.show(state).subscribe();
    this.wxSvc.config({
      title: '我打地鼠获得了' + this.scoreForm.get('score').value + '分，距离第一名iphoneX更近了一步。',
      desc: '【广惠商城】玩游戏拿大奖，iPhone X、ipad、小米手机奖品多多等你来拿！',
      link: Config.webHost + '/games/mouse?referee=' + (this.authSvc.getUid() ? this.authSvc.getUid() : ''),
      imgUrl: Config.webHost + '/assets/game/mouse/img/logo.png'
    }).then(() => {
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(err);
      // this.status = `注册失败，原因：${err}`;
    });
  }

  ngOnDestroy() {
    if (this.setMousesTimer) {
      this.setMousesTimer.unsubscribe();
    }
    if (this.resetMousesTimer) {
      this.resetMousesTimer.unsubscribe();
    }
    if (this.readyTimer) {
      this.readyTimer.unsubscribe();
    }
  }
}
