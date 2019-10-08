import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SInfiniteLoaderComponent} from './infiniteloader.component';
import {SInfiniteLoaderConfig} from './infiniteloader.config';

@NgModule({
  imports: [CommonModule],
  declarations: [SInfiniteLoaderComponent],
  exports: [SInfiniteLoaderComponent],
  entryComponents: [SInfiniteLoaderComponent],
})
export class SInfiniteLoaderModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SInfiniteLoaderModule,
      providers: [SInfiniteLoaderConfig],
    };
  }
}
