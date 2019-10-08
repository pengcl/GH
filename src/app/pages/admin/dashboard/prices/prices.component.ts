import {Component, OnInit, ViewChild} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent, PickerService} from 'ngx-weui';
import {TabbarService} from '../../../../modules/tabbar';
import {DialogService} from 'ngx-weui';
import {AuthService} from '../../../../services/auth.service';
import {ProductService} from '../../../../services/product.service';

import {Config} from '../../../../config';

@Component({
  selector: 'app-admin-dashboard-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class AdminDashboardPricesComponent implements OnInit {
  config = Config;

  appKey;

  params = {
    key: '',
    productName: '',
    productTypeId: '',
  };

  types;
  type;
  goods;
  totalPages;
  pageSize = 15;
  page = 1;

  @ViewChild('comp') private comp: InfiniteLoaderComponent;

  constructor(private pickerSvc: PickerService,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private productSvc: ProductService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.params.key = this.appKey;

    this.productSvc.getTypeList().then(res => {
      const types = [{label: '全部', value: ''}];
      if (res.code === '0000') {
        res.result.forEach(item => {
          types.push({
            label: item.typename,
            value: item.typeid
          });
        });
      }
      this.types = types;
      this.type = this.types[0];
    });

    this.getProducts();
  }

  getProducts() {
    this.page = 1;
    this.comp.restart();
    this.productSvc.search(this.params).then(res => {
      if (res.code === '0000') {
        this.goods = res.result;
        this.totalPages = Math.ceil(this.goods.length / this.pageSize);
      }
    });
  }

  inputChange(e) {
    observableTimer(1500).subscribe(() => {
      if (this.params.productName === e) {
        this.getProducts();
      }
    });
  }

  showPicker() {
    this.pickerSvc.show([this.types], '', [0], {cancel: '返回', confirm: '确定'}).subscribe(data => {
      this.type = data.items[0];
      this.params.productTypeId = data.items[0].value;

      this.getProducts();
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1000).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  search() {
  }
}
