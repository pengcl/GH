import {Component, ViewEncapsulation} from '@angular/core';
import {LogService} from '../../services/utils/log.service';
import {UaService} from '../../services/utils/ua.service';

@Component({

  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AdminComponent {

  constructor(private logSvc: LogService,
              private uaSvc: UaService) {
  }
}
