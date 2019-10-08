import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {UaService} from '../../services/utils/ua.service';

@Component({
  selector: 'app-redirect',
  templateUrl: './redirect.component.html',
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent {

  isWx = false;

  constructor(private route: ActivatedRoute, private uaSvc: UaService) {
    const redirect = decodeURIComponent(route.snapshot.queryParams['redirect']);

    this.isWx = uaSvc.isWx();
    if (!this.isWx) {
      window.location.href = redirect;
    }
  }

}
