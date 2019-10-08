import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  EventEmitter,
  Output,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  fromEvent as observableFromEvent,
  interval as observableInterval,
  Subscription
} from 'rxjs';

import {SInfiniteLoaderConfig} from './infiniteloader.config';

@Component({
  selector: 'app-infiniteloader',
  template: `
    <div class="app-infiniteloader__content has-footer">
      <ng-content></ng-content>
      <div *ngIf="_loading || _finished">
        <div *ngIf="_loading" [innerHTML]="config.loading"></div>
        <div *ngIf="_finished" [innerHTML]="config.finished"></div>
      </div>
    </div>
  `,
  styleUrls: ['./infiniteloader.component.scss']
})
export class SInfiniteLoaderComponent implements OnChanges, OnInit, OnDestroy {
  private didScroll = false;
  private scrollEvent: any = null;
  private scrollTime: any = null;
  private disposeScroller: Subscription;

  _loading: boolean = false;
  _finished: boolean = false;

  _arrived: boolean = false;

  /**
   * 配置项
   */
  @Input() config: SInfiniteLoaderConfig;
  @Input() scrollTo: number;

  /**
   * 加载更多回调
   */
  @Output() loadmore = new EventEmitter<SInfiniteLoaderComponent>();
  @Output() arrived = new EventEmitter<any>();

  constructor(
    private el: ElementRef,
    private DEF: SInfiniteLoaderConfig,
  ) {
  }

  /** 设置本次加载完成 */
  resolveLoading() {
    this._loading = false;
    this._finished = false;
  }

  /** 设置结束 */
  setFinished() {
    this._loading = false;
    this._finished = true;
  }

  /** 设置重新开始 */
  restart() {
    this._finished = false;
  }

  _arrive() {
    if (window.scrollY >= this.scrollTo) {
      if (this._arrived) return;
      this._arrived = true;
    } else {
      if (!this._arrived) return;
      this._arrived = false;
    }
    this.arrived.emit(this._arrived);
  }

  _onScroll() {
    if (this._loading || this._finished) return;

    /*alert(window.scrollY + ',' + window.innerHeight + ',' + window.document.body.clientHeight);*/

    const scrollPercent = (window.scrollY + window.innerHeight) / window.document.body.clientHeight * 100;

    if (scrollPercent > this.config.percent) {
      this._loading = true;
      this.loadmore.emit(this);
    }
  }

  ngOnInit() {
    this.parseConfig();
    this.scrollTime = observableInterval(this.config.throttle).subscribe(event => {
      if (this.didScroll) {
        this.didScroll = false;
        this._onScroll();
        this._arrive();
      }
    });

    this.disposeScroller = observableFromEvent(window, 'scroll').subscribe((event) => {
      this.scrollEvent = event;
      this.didScroll = true;

      /*const scrollTop = this.el.nativeElement.querySelector('.weui-infiniteloader__content').scrollTop;
      const offsetTop = this.el.nativeElement.querySelector('.goods').offsetTop;
      const $target = this.el.nativeElement.querySelector('.goods-menu');

      if (scrollTop >= offsetTop) {
        $target.className = 'goods-menu fixed';
      } else {
        $target.className = 'goods-menu';
      }*/
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ('config' in changes) this.parseConfig();
  }

  ngOnDestroy(): void {
    if (this.scrollTime) clearTimeout(this.scrollTime);
    if (this.disposeScroller) this.disposeScroller.unsubscribe();
  }

  private parseConfig() {
    this.config = Object.assign({}, this.DEF, this.config);
  }
}
