import {Component, Input, OnInit, Output, EventEmitter, OnDestroy} from '@angular/core';
import {interval as observableInterval, Observable} from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input() leftTime: number;
  @Output() finished = new EventEmitter();

  timer;
  count;
  s;
  u;

  constructor() {
  }

  ngOnInit() {
    let count = this.leftTime * 100;
    let _count;
    this.timer = observableInterval(10).subscribe(() => {
      if (count < 1) {
        this.finished.emit(0);
        this.timer.unsubscribe();
      } else {
        count = count - 1;
        if (count < 10) {
          _count = '000' + count;
        } else if (count < 100) {
          _count = '00' + count;
        } else if (count < 1000) {
          _count = '0' + count;
        } else if (count === 0) {
          _count = '0000';
        } else {
          _count = count.toString();
        }
      }

      this.s = _count.substring(0, 2);
      this.u = _count.substring(2, 4);
    });
  }

  ngOnDestroy() {
    this.timer.unsubscribe();
  }

}
