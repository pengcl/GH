import {Component, OnInit, ViewChild} from '@angular/core';

import {timer as observableTimer} from "rxjs";
import {SInfiniteLoaderComponent} from "../../../modules/infiniteloader";

@Component({
  selector: 'app-front-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})

export class FrontIndexComponent implements OnInit {

  items: any[] = Array(50)
    .fill(0)
    .map((v: any, i: number) => i);

  position = {
    x: -10,
    y: -10
  };

  cartBallShow: boolean = false;

  constructor() {
    // this.navBarConfig.navigationBarTitleText = '大牛管家';
  }

  ngOnInit() {
  }

  toCart(e) {
    this.position = {
      x: e.x,
      y: e.y
    };
    this.cartBallShow = true;
    observableTimer(100).subscribe(() => {
      this.position = {
        x: 300,
        y: 620
      };
    });
    observableTimer(400).subscribe(() => {
      this.cartBallShow = false;
    });
  }
}
