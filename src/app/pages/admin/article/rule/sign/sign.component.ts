import {Component, OnInit} from '@angular/core';


import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';

@Component({
  selector: 'app-admin-article-rule-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss']
})
export class AdminArticleRuleSignComponent implements OnInit {

  appKey;

  constructor(private tabBarSvc: TabbarService,
              private authSvc: AuthService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
  }

  back() {
    window.history.back();
  }

}
