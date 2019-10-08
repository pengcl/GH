import {Component, ErrorHandler} from '@angular/core';

import {UaService} from '../services/utils/ua.service';
import {LogService} from '../services/utils/log.service';

@Component({
  selector: 'app-error',
  template: '',
})
export class AppErrorComponent implements ErrorHandler {

  constructor(private uaSvc: UaService,
              private logSvc: LogService) {
  }

  handleError(error: any): void {
    const _error = {
      platform: this.uaSvc.getPlatform(),
      isWx: this.uaSvc.isWx(),
      wx_v: this.uaSvc.getWxVersion(),
      ua: this.uaSvc.getUa(),
      av: this.uaSvc.getAv(),
      url: window.location.href,
      error: error.toString()
    };
    console.log(_error);
    /*this.logSvc.log(_error).then(res => {
    });*/
  }
}
