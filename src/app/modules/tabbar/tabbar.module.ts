import {NgModule, ModuleWithProviders} from '@angular/core';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {TabbarComponent} from './tabbar.component';
import {TabbarService} from './tabbar.service';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [TabbarComponent],
  exports: [TabbarComponent],
  providers: [TabbarService],
  entryComponents: [TabbarComponent]
})
export class TabbarModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: TabbarModule, providers: []};
  }
}
