import {Injectable} from '@angular/core';
import {CONFIG} from './tabbar.config';

import {StorageService} from '../../services/storage.service';
import {CartService} from '../../services/cart.service';

@Injectable()
export class TabbarService {
  config = CONFIG;

  constructor(private storageSvc: StorageService,
              private cartSvc: CartService) {
  }

  setActive(index) {
    this.config.forEach((item, i) => {
      this.config[i].selected = false;
    });
    this.config[index].selected = true;
  }

  updateCartNum() {
    if (this.storageSvc.get('accessToken')) {
      const accessToken = JSON.parse(this.storageSvc.get('accessToken'));

      this.cartSvc.getCartCount(accessToken.key).then(res => {
        if (res.code === '0000') {
          this.config[3].badge.badge = res.result;
        }
      });
    }
  }
}
