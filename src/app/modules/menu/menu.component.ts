import {Component, OnInit} from '@angular/core';
import {MenuService} from './menu.service';

import {AuthService} from '../../services/auth.service';
import {MemberService} from '../../services/member.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  show: boolean = false;
  member;

  constructor(private menuSvc: MenuService,
              private authSvc: AuthService,
              private memberSvc: MemberService) {
    menuSvc.get().subscribe(res => {
      this.show = res;
    });
    memberSvc.getMember(this.authSvc.getKey()).then(res => {
      if (res.code === '0000') {
        this.member = res.result;
        console.log(this.member);
      }
    });
  }

  ngOnInit() {
  }
}
