import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WxComponent} from './wx.component';
import {WxService} from './wx.service';

@NgModule({
  imports: [CommonModule],
  declarations: [WxComponent],
  exports: [WxComponent],
  entryComponents: [WxComponent],
  providers: [WxService]
})
export class WxModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: WxModule, providers: []};
  }
}
