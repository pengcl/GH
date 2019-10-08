import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Config} from '../../../../config';
import {TabbarService} from '../../../../modules/tabbar';
import {ArticleService} from '../../../../services/article.service';

@Component({
  selector: 'app-front-article-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class FrontArticleItemComponent implements OnInit {

  config = Config;
  title;
  article;

  constructor(private route: ActivatedRoute,
              private tabbarSvc: TabbarService,
              private articleSvc: ArticleService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {
    this.articleSvc.getNew(this.route.snapshot.params['id']).then(res => {
      this.article = res.result;
    });
  }

}
