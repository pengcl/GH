import {Injectable, ComponentFactoryResolver, ApplicationRef, Injector} from '@angular/core';
import {BaseService} from '../../services/utils/base.service';
import {NotifyComponent} from './notify.component';

@Injectable()
export class NotifyService extends BaseService {
  constructor(resolver: ComponentFactoryResolver, applicationRef: ApplicationRef, injector: Injector) {
    super(resolver, applicationRef, injector);
  }

  /**
   * 构建toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms），0 表示永久（可选）
   * @param [icon] icon图标Class名（可选）
   * @param [type] 类型（可选）
   */
  show(label?: string, text?: string, time?: number, type?: 'success' | 'warning' | 'news'): NotifyComponent {
    const componentRef = this.build(NotifyComponent);

    if (type) {
      componentRef.instance.type = type;
    }
    if (text) {
      componentRef.instance.text = text;
    }
    if (label) {
      componentRef.instance.label = label;
    }
    if (time) {
      componentRef.instance.time = time;
    }
    componentRef.instance.hide.subscribe(() => {
      setTimeout(() => {
        componentRef.destroy();
      }, 300);
    });
    return componentRef.instance.onShow();
  }

  /**
   * 关闭最新toast
   */
  hide() {
    this.destroy();
  }

  /**
   * 构建成功toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms）（可选）
   * @param [icon] icon图标Class名（可选）
   */
  success(label?, text?: string, time?: number): NotifyComponent {
    return this.show(label, text, time, 'success');
  }

  /**
   * 构建加载中toast并显示
   *
   * @param [text] 文本（可选）
   * @param [time] 显示时长后自动关闭（单位：ms）（可选）
   * @param [icon] icon图标Class名（可选）
   */
  warning(label?: string, text?: string, time?: number): NotifyComponent {
    return this.show(label, text, time, 'warning');
  }

  news(label?: string, text?: string, time?: number): NotifyComponent {
    return this.show(label, text, time, 'news');
  }
}
