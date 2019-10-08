import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Config} from '../../../config';
import {SysService} from '../../../services/sys.service';

@Component({
  selector: 'app-msg-red',
  templateUrl: './red.component.html',
  styleUrls: ['./red.component.scss']
})
export class MsgRedComponent implements OnInit {

  config = Config;
  sysConfig;
  type;

  constructor(private route: ActivatedRoute,
              private sysSvc: SysService) {
  }

  ngOnInit() {
    this.type = this.route.snapshot.queryParams['type'];
    this.sysSvc.getSysConfig().then(res => {
      this.sysConfig = res.result;
    });
  }

}
