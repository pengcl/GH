import {Component, OnInit, OnDestroy} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {CartService} from '../../services/cart.service';
import {TabbarService} from './tabbar.service';

@Component({
  selector: 'app-tabbar',
  templateUrl: './tabbar.component.html',
  styleUrls: ['./tabbar.component.scss']
})
export class TabbarComponent implements OnInit, OnDestroy {
  config;
  key;

  isChanged: boolean = false;

  constructor(private cartSvc: CartService,
              private tabBarSvc: TabbarService) {
  }

  ngOnInit() {
    this.config = this.tabBarSvc.config;
    this.tabBarSvc.updateCartNum();
    this.cartSvc.getCount().subscribe(res => {
      this.isChanged = false;
      this.isChanged = true;
      this.config[3].badge.badge = res;

      observableTimer(1000).subscribe(() => {
        this.isChanged = false;
      });
    });
  }

  ngOnDestroy() {
  }
}
