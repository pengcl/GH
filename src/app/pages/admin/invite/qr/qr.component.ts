import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';

import {Config} from '../../../../config';
import {AuthService} from '../../../../services/auth.service';
import {H2cService} from '../../../../services/h2c.service';

declare var QRCode: any;
declare var html2canvas: any;

@Component({
  selector: 'app-admin-invite-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.scss']
})
export class AdminInviteQrComponent implements OnInit, OnDestroy {
  config = Config;
  appKey;
  poster;

  qrcode;

  constructor(private router: Router,
              private authSvc: AuthService,
              private h2c: H2cService) {
  }

  ngOnInit() {

    this.appKey = this.authSvc.getKey();

    this.qrcode = new QRCode(document.getElementById('qrcode'), {
      text: Config.webHost + '/index?referee=' + this.authSvc.getUid(),
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });

    this.h2c.get().then(res => {
      if (res) {
        setTimeout(() => {
          html2canvas(document.querySelector('.canvas-source')).then(canvas => {
            this.poster = canvas.toDataURL();
          });
        }, 1000);
      }
    });
  }

  ngOnDestroy() {

  }

}
