import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {map} from 'rxjs/operators';

import {Config} from '../../../config';
import {ProductService} from '../../../services/product.service';
import {TabbarService} from '../../../modules/tabbar';
import {InfiniteLoaderComponent, DialogService} from 'ngx-weui';

@Component({
  selector: 'app-front-calculation',
  templateUrl: './calculation.component.html',
  styleUrls: ['./calculation.component.scss']
})
export class FrontCalculationComponent implements OnInit {

  appKey;

  id;
  results;

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  constructor(private route: ActivatedRoute,
              private dialogSvc: DialogService,
              private prodSvc: ProductService,
              private tabbarSvc: TabbarService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {

    this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
      this.prodSvc.compute(this.id).then(res => {
        this.results = res.result;
      });
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    /*observableTimer(1000).subscribe(() => {
      if (this.tab === 1) {
        this.recordPage = this.recordPage + 1;

        // 获取当前页数据
        this.prodSvc.getRecords(this.id).then(res => {
          if (res.code === '0000') {
            console.log(this.record);
            this.record.list = this.record.list.concat(res.result.list);
          }
        });

        if (this.recordPage >= this.recordTotalPages) {
          comp.setFinished();
          return;
        }

        comp.resolveLoading();
      }
    });*/
  }

}
