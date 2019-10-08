import {Component, Input, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';

import {MenuService} from "../../modules/menu/menu.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() title = '大牛管家';
  @Input() navBar;
  @Input() show;

  constructor(private titleService: Title,
              private menuSvc: MenuService) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }

  menu() {
    this.menuSvc.show();
  }

}
