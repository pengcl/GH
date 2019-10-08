import {Injectable} from '@angular/core';


const av = navigator.appVersion; // window.navigator 对象包含有关访问者浏览器的信息。
const ua = navigator.userAgent;

@Injectable({providedIn: 'root'})
export class UaService {
  isWin = (navigator.platform === 'Win32') || (navigator.platform === 'Windows');
  isMac = (navigator.platform === 'Mac68K') || (navigator.platform === 'MacPPC') || (navigator.platform === 'Macintosh') || (navigator.platform === 'MacIntel');
  constructor() {
  }

  getPlatform() {
    if ((ua.indexOf('iPhone') > -1 || ua.indexOf('iPod') > -1)) {
      return 'iPhone';
    }
    return 'Android';
  }

  getWxVersion() {
    const str = ua;
    const v0 = [6, 3, 31];
    const regExp = /MicroMessenger\/([\d|\.]+)/;
    if (regExp.exec(str) === null) {
      return;
    }
    let v1: any = regExp.exec(str)[1].split('.');
    if (v1.length >= 4) {
      v1 = v1.slice(0, 3);
    }
    v1 = v1.map(function (v) {
      return parseInt(v, 10);
    });
    if (v1[0] > v0[0]) {
      return true;
    }
    if (v1[0] === v0[0] && v1[1] > v0[1]) {
      return true;
    }
    if (v1[0] === v0[0] && v1[1] === v0[1] && v1[2] >= v0[2]) {
      return true;
    }
    return false;
  }

  getAv() {
    return av;
  }

  getUa() {
    return ua;
  }

  isWx(): boolean {// 检查是否微信
    return String(ua.toLowerCase().match(/MicroMessenger/i)) === 'micromessenger';
  }

  isPc() {
    const agents = ['Android', 'iPhone',
      'SymbianOS', 'Windows Phone',
      'iPad', 'iPod'];
    let flag = true;
    for (let v = 0; v < agents.length; v++) {
      if (ua.indexOf(agents[v]) > 0) {
        flag = false;
        break;
      }
    }
    return flag;
  }
}
