import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';

import {FrontComponent} from './pages/front/front.component';
import {appFrontRoutes} from './pages/front/front-routing.module';

import {AdminComponent} from './pages/admin/admin.component';
import {appAdminRoutes} from './pages/admin/admin-routing.module';

import {GamesComponent} from './pages/games/games.component';
import {appGamesRoutes} from './pages/games/games-routing.module';

import {IndexComponent} from './pages/index/index.component';
import {IconsComponent} from './pages/icons/icons.component';
import {SignInComponent} from './pages/auth/signIn/signIn.component';
import {ForgotComponent} from './pages/auth/forgot/forgot.component';
import {AgreementComponent} from './pages/auth/agreement/agreement.component';
import {RedirectComponent} from './pages/redirect/redirect.component';
import {MsgSuccessComponent} from './pages/msg/success/success.component';
import {MsgInfoComponent} from './pages/msg/info/info.component';
import {MsgErrorComponent} from './pages/msg/error/error.component';
import {MsgRedComponent} from './pages/msg/red/red.component';

import {ClearComponent} from './pages/clear/clear.component';

export const routes: Routes = [

  {path: '', component: IndexComponent},
  {path: 'index', component: IndexComponent},
  {path: 'icons', component: IconsComponent},
  {path: 'clear', component: ClearComponent},
  {path: 'auth/signIn', component: SignInComponent},
  {path: 'auth/forgot', component: ForgotComponent},
  {path: 'auth/agreement', component: AgreementComponent},
  {path: 'redirect', component: RedirectComponent},

  {path: 'msg/success', component: MsgSuccessComponent},
  {path: 'msg/info', component: MsgInfoComponent},
  {path: 'msg/red', component: MsgRedComponent},
  {path: 'wApi/manager', component: MsgErrorComponent},
  {
    path: 'front',
    component: FrontComponent,
    children: appFrontRoutes
  },
  {
    path: 'admin',
    component: AdminComponent,
    children: appAdminRoutes
  },
  {
    path: 'games',
    component: GamesComponent,
    children: appGamesRoutes
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule {
}
