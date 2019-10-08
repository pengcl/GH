import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {fromEvent as observableFromEvent} from 'rxjs';

@Component({
  selector: 'app-fixed-nav',
  templateUrl: './fixedNav.component.html',
  styleUrls: ['./fixedNav.component.scss']
})
export class FixedNavComponent implements OnInit {

  showTop = false;

  constructor() {
  }

  ngOnInit() {
    observableFromEvent(window, 'scroll').subscribe((event) => {
      if (window.scrollY >= window.innerHeight) {
        this.showTop = true;
      } else {
        this.showTop = false;
      }
    });
  }

  refresh() {
    console.log(window);
    window.location.reload();
  }

  top() {
    window.scrollTo(0, 0);

  }

}
