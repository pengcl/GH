import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map} from 'rxjs/operators';

import {Config} from '../../../config';
import {ProductService} from '../../../services/product.service';
import {TabbarService} from '../../../modules/tabbar';
import {InfiniteLoaderComponent, DialogService} from 'ngx-weui';

@Component({
  selector: 'app-front-cashback',
  templateUrl: './cashback.component.html',
  styleUrls: ['./cashback.component.scss']
})
export class FrontCashbackComponent implements OnInit {

  appKey;

  id;
  results;
  total = 0;

  constructor(private route: ActivatedRoute,
              private dialogSvc: DialogService,
              private prodSvc: ProductService,
              private tabbarSvc: TabbarService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {

    this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
      this.prodSvc.getProduct(this.id).then(res => {
        this.total = res.result.productMap.spellbuyprice / 100;
      });
      this.prodSvc.cashBack(this.id).then(res => {
        this.results = res.result;
      });
    });
  }

}
