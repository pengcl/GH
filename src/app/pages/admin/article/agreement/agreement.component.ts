import {Component, OnInit} from '@angular/core';


import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-article-agreement',
  templateUrl: './agreement.component.html',
  styleUrls: ['./agreement.component.scss']
})
export class AdminArticleAgreementComponent implements OnInit {

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
