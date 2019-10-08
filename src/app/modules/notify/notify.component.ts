import {Component, Input, Output, EventEmitter, OnDestroy} from '@angular/core';
import {NotifyConfig} from './notify.config';

@Component({
  selector: 'notify',
  template: `
    <div class="notify">
      <div class="weui-cell">
        <div *ngIf="label" class="weui-cell__hd"><span>{{label}}</span></div>
        <div class="weui-cell__bd">
          {{text}}
        </div>
        <div class="weui-cell__ft"><img (click)="onHide()" class="icon" src="/assets/images/icons/close.png"/></div>
      </div>
    </div>
  `,

  styleUrls: ['./notify.component.scss'],
  host: {
    '[hidden]': '!_showd'
  }
})
export class NotifyComponent implements OnDestroy {

  /**
   * 类型
   */
  @Input() set type(_t: 'success' | 'warning' | 'news') {
    Object.assign(this, this.DEF[_t]);
  }

  /**
   * 标题
   */
  @Input() label: string;
  /**
   * 文本
   */
  @Input() text: string;
  /**
   * 显示时长后自动关闭（单位：ms），0 表示永久，默认：`2000`
   */
  @Input() time: number = 2000;
  /**
   * 隐藏后回调
   */
  @Output() hide = new EventEmitter();

  constructor(private DEF: NotifyConfig) {
    this.type = 'success';
  }

  _showd: boolean = false;
  private timer: any;

  /**
   * @docs-private
   */
  onShow() {
    this._showd = true;
    if (this.time > 0) {
      this.timer = setTimeout(() => {
        this.onHide();
      }, this.time);
    }
    return this;
  }

  /**
   * @docs-private
   */
  onHide() {
    this._showd = false;
    this.hide.emit();
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
