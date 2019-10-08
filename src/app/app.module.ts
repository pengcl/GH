// modules
import {BrowserModule} from '@angular/platform-browser';
import {NgModule, ErrorHandler} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';

import {WeUiModule} from 'ngx-weui';
import {NgxQRCodeModule} from 'ngx-qrcode2';
import {SInfiniteLoaderModule} from './modules/infiniteloader';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {WxModule} from './modules/wx';
import {NotifyModule} from './modules/notify';
import {OverlayModule} from './modules/overlay';
import {CountdownModule} from './modules/countdown/countdown.module';
import {ChartF2Module} from './modules/chart-f2';
import {TabbarModule} from './modules/tabbar';
import {MenuModule} from './modules/menu/menu.module';

// pipes
import {PIPES_DECLARATIONS} from './pipes';

// components
import {AppComponent} from './app.component';
import {COMPONENTS_DECLARATIONS} from './components';
import {FRONT_PAGES_DECLARATIONS} from './pages/front';
import {ADMIN_PAGES_DECLARATIONS} from './pages/admin';
import {GAMES_PAGES_DECLARATIONS} from './pages/games';
import {IndexComponent} from './pages/index/index.component';
import {IconsComponent} from './pages/icons/icons.component';
import {SignInComponent} from './pages/auth/signIn/signIn.component';
import {ForgotComponent} from './pages/auth/forgot/forgot.component';
import {AgreementComponent} from './pages/auth/agreement/agreement.component';
import {AppErrorComponent} from './class/error.class';
import {RedirectComponent} from './pages/redirect/redirect.component';
import {MsgSuccessComponent} from './pages/msg/success/success.component';
import {MsgInfoComponent} from './pages/msg/info/info.component';
import {MsgErrorComponent} from './pages/msg/error/error.component';
import {MsgRedComponent} from './pages/msg/red/red.component';


// directives
import {DIRECTIVES_DECLARATIONS} from './directives';

import {ClearComponent} from "./pages/clear/clear.component";

@NgModule({
  declarations: [
    AppComponent,
    AppErrorComponent,
    IndexComponent,
    IconsComponent,
    SignInComponent,
    ForgotComponent,
    AgreementComponent,
    RedirectComponent,
    MsgSuccessComponent,
    MsgInfoComponent,
    MsgErrorComponent,
    MsgRedComponent,
    ClearComponent,
    ...COMPONENTS_DECLARATIONS,
    ...FRONT_PAGES_DECLARATIONS,
    ...ADMIN_PAGES_DECLARATIONS,
    ...DIRECTIVES_DECLARATIONS,
    ...GAMES_PAGES_DECLARATIONS,
    ...PIPES_DECLARATIONS
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SwiperModule,
    CountdownModule,
    NgxQRCodeModule,
    WxModule.forRoot(),
    NotifyModule.forRoot(),
    ChartF2Module.forRoot(),
    WeUiModule.forRoot(),
    OverlayModule.forRoot(),
    TabbarModule.forRoot(),
    SInfiniteLoaderModule.forRoot(),
    MenuModule.forRoot()
  ],
  providers: [
    ...PIPES_DECLARATIONS,
    {provide: ErrorHandler, useClass: AppErrorComponent}
  ],
  bootstrap: [AppComponent],
  entryComponents: [...COMPONENTS_DECLARATIONS]
})
export class AppModule {
}
