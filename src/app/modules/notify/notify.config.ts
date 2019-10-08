import {Injectable} from '@angular/core';

// tslint:disable-next-line:interface-over-type-literal
export type ToastConfigType = { label: string, text: string, time: number };

@Injectable()
export class NotifyConfig {

  /**
   * 成功配置项
   */
  success?: ToastConfigType = {label: '广惠商城', text: '已完成', time: 2000};

  /**
   * 警告配置项
   */
  warning?: ToastConfigType = {label: '广惠商城', text: '加载中…', time: 2000};

  /**
   * 普通消息
   */
  news?: ToastConfigType = {label: '广惠商城', text: '加载中…', time: 2000};

}
