import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';
import {take} from "rxjs/operators";

import {InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../config';
import {TabbarService} from '../../../modules/tabbar';
import {ProductService} from '../../../services/product.service';

@Component({
  selector: 'app-front-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class FrontNewComponent implements OnInit, OnDestroy {

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  config = Config;
  lotteries;
  soonOpens;
  soonItems = [];

  page: number = 1;
  totalPages: number;

  timer;

  constructor(private tabbarSvc: TabbarService,
              private prodSvc: ProductService) {
    this.tabbarSvc.setActive(2);
  }

  ngOnInit() {
    this.prodSvc.getLotteries(1).then(res => {
      if (res.code === '0000') {
        this.lotteries = res.result.list;
        this.totalPages = res.result.totalPages;
      }
    });

    this.prodSvc.getSoonOpens().then(res => {
      if (res.code === '0000') {
        this.soonOpens = res.result;
      }
    });

    this.timer = observableInterval(10000).subscribe(() => {
      this.prodSvc.getSoonOpens().then(res => {
        if (res.code === '0000') {
          this.soonOpens = res.result;
        }
      });
    });
  }

  getTimer(end, now) {
    return Date.parse(end.split('.')[0].replace(/\-/g, '/')) - now;
  }

  onFinished(item) {
    // this.soonItem = item;
    this.soonItems.push(item.lotteryid);
    const timerFinished = observableInterval(2000).pipe(take(5)).subscribe(() => {
      this.prodSvc.open(item.lotteryproductid).then(res => res).then((res) => {
        if (res.code === '0000' && res.result) {
          this.lotteries.unshift(res.result);
          timerFinished.unsubscribe();
        }
      });
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(2000).subscribe(() => {

      this.page = this.page + 1;

      this.prodSvc.getLotteries(this.page).then(res => {
        if (res.code === '0000') {
          this.lotteries = this.lotteries.concat(res.result.list);
        }
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  ngOnDestroy() {
    this.timer.unsubscribe();
  }

}
