import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Config} from '../../../../config';
import {TabbarService} from '../../../../modules/tabbar';

import {ArticleService} from '../../../../services/article.service';

@Component({
  selector: 'app-front-article-notices',
  templateUrl: './notices.component.html',
  styleUrls: ['./notices.component.scss']
})
export class FrontArticleNoticesComponent implements OnInit {

  config = Config;

  notices;

  selected;

  constructor(private route: ActivatedRoute,
              private tabbarSvc: TabbarService,
              private articleSvc: ArticleService) {
    this.tabbarSvc.setActive(0);
  }

  ngOnInit() {
    this.articleSvc.getNotices().then(res => {
      this.notices = res.result;
      this.selected = res.result[0] || '';
    });
  }

  onSelected(selected) {
    this.selected = selected;
  }

}
