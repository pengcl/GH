import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {TabbarService} from '../../../modules/tabbar';

@Component({
  selector: 'app-agreement',
  templateUrl: './agreement.component.html'
})
export class AgreementComponent implements OnInit {

  constructor(private router: Router,
              private location: Location,
              private tabBarSvc: TabbarService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
  }

  back() {
    this.location.back();
  }

}
