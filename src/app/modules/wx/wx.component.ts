import {Component, OnDestroy, Input, Output, EventEmitter} from '@angular/core';
import {Observer, Observable, Subscription} from 'rxjs';

@Component({
  selector: 'app-wx',
  templateUrl: './wx.component.html',
  styleUrls: ['./wx.component.scss']
})
export class WxComponent implements OnDestroy {
  @Input() state: any;
  _shown: boolean = false;

  /**
   * 打开动画结束后回调（唯一参数：对话框实例对象）
   */
  @Output() open = new EventEmitter<WxComponent>();

  /**
   * 关闭动画开始时回调（唯一参数：对话框实例对象）
   */
  @Output() close = new EventEmitter<WxComponent>();

  private observer: Observer<any>;

  constructor() {
  }

  /**
   * 显示，组件载入页面后并不会显示，显示调用 `show()` 并订阅结果。
   *
   * @returns {Observable<any>} 当 `type==='prompt'` 时会多一 `result` 属性表示结果值
   */
  show(): Observable<any> {
    this._shown = true;

    // 模拟动画结束后回调
    setTimeout(() => {
      this.open.emit(this);
    }, 300);
    return Observable.create((observer: Observer<any>) => {
      this.observer = observer;
      this.observer.next('show');
    });
  }

  /**
   * 隐藏
   *
   * @param {boolean} [is_backdrop] 是否从背景上点击
   */
  hide() {
    this._shown = false;
    this.close.emit(this);
  }

  ngOnDestroy() {
    if (this.observer && this.observer instanceof Subscription) {
      (<Subscription>this.observer).unsubscribe();
    }
  }
}
