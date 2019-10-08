import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {OrderService} from '../../../../services/order.service';
import {RechargeService} from '../../../../services/recharge.service';

@Component({
  selector: 'app-admin-dashboard-index',
  templateUrl: './index.component.html'
})
export class AdminDashboardIndexComponent implements OnInit {

  appKey;

  constructor(private authSvc: AuthService,
              private orderSvc: OrderService,
              private rechargeSvc: RechargeService) {
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.rechargeSvc.getPhones(this.appKey, '').then(res => {
    });
  }

}
