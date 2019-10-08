import {CommonModule} from '@angular/common';
import {NgModule, ModuleWithProviders} from '@angular/core';
import {ChartF2Service} from './chart-f2.service';
import {ChartF2Directive} from './chart-f2.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ChartF2Directive],
  providers: [ChartF2Service],
  exports: [ChartF2Directive]
})
export class ChartF2Module {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: ChartF2Module, providers: []};
  }
}
