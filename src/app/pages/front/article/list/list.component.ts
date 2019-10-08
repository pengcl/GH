import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {timer as observableTimer} from 'rxjs';

import {Config} from '../../../../config';
import {TabbarService} from '../../../../modules/tabbar';

import {ArticleService} from '../../../../services/article.service';
import {InfiniteLoaderComponent} from 'ngx-weui';

@Component({
  selector: 'app-front-article-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class FrontArticleListComponent implements OnInit {

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  config = Config;
  news;

  page: number = 1;
  totalPages: number;

  constructor(private route: ActivatedRoute,
              private tabbarSvc: TabbarService,
              private articleSvc: ArticleService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {
    this.articleSvc.getNews(1).then(res => {
      this.news = res.result.list;
      this.totalPages = res.result.totalPages;
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      this.articleSvc.getNews(this.page).then(res => {
        this.news = this.news.concat(res.result.list);
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }
      comp.resolveLoading();
    });
  }

}
