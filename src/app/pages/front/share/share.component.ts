import {Component, OnInit, ViewChild} from '@angular/core';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../config';
import {TabbarService} from '../../../modules/tabbar';
import {CommentService} from '../../../services/comment.service';

@Component({
  selector: 'app-front-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class FrontShareComponent implements OnInit {

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  config = Config;

  page: number = 1;
  totalPages: number;

  items;

  constructor(private tabbarSvc: TabbarService,
              private commentSvc: CommentService) {
    this.tabbarSvc.setActive(0);
  }

  ngOnInit() {
    this.commentSvc.getComments().then(res => {
      this.items = res.result.shareList;
      console.log(this.items);
      this.totalPages = res.result.totalPages;
    });
  }

  onCancel(e) {
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    /*observableTimer(2000).subscribe(() => {

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
    });*/
  }

}
