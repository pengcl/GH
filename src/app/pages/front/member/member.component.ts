import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LocationStrategy} from "@angular/common";

import {Config} from '../../../config';
import {TabbarService} from '../../../modules/tabbar/index';

import {MemberService} from '../../../services/member.service';

@Component({
  selector: 'app-front-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class FrontMemberComponent implements OnInit {

  config = Config;
  id;
  userInfo;

  records;
  shares;
  winners;

  constructor(private route: ActivatedRoute,
              private location: LocationStrategy,
              private tabbarSvc: TabbarService,
              private memberSvc: MemberService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.memberSvc.getUser(this.id).then(res => {
      if (res.code === '0000') {
        this.userInfo = res.result;
        console.log(this.userInfo);
      }
    });

    this.memberSvc.getRecords(this.id).then(res => {
      if (res.code === '0000') {
        this.records = res.result;
      }
    });

    this.memberSvc.getShares(this.id).then(res => {
      if (res.code === '0000') {
        this.shares = res.result;
        console.log(this.shares);
      }
    });

    this.memberSvc.getWinners(this.id).then(res => {
      if (res.code === '0000') {
        this.winners = res.result;
      }
    });
  }

  back() {
    this.location.back();
  }

}
