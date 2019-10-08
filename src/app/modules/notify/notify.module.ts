import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotifyComponent} from './notify.component';
import {NotifyService} from './notify.service';
import {NotifyConfig} from './notify.config';

@NgModule({
  imports: [CommonModule],
  declarations: [NotifyComponent],
  exports: [NotifyComponent],
  providers: [NotifyService],
  entryComponents: [NotifyComponent]
})
export class NotifyModule {
  public static forRoot(): ModuleWithProviders {
    return {ngModule: NotifyModule, providers: [NotifyConfig]};
  }
}
