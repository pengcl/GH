import {Routes} from '@angular/router';
import {AdminHomeComponent} from './home/home.component';
import {AdminCartComponent} from './cart/cart.component';
import {AdminCollectComponent} from './collect/collect.component';
import {AdminFlowComponent} from './flow/flow.component';

import {AdminAccountIndexComponent} from './account/index/index.component';
import {AdminAccountRecordComponent} from './account/record/record.component';
import {AdminAccountFundAddComponent} from './account/fund/add/add.component';

import {AdminTradeListComponent} from './trade/list/list.component';
import {AdminTradeItemComponent} from './trade/item/item.component';
import {AdminTradePurchasedComponent} from './trade/purchased/purchased.component';
import {AdminTradeLogisticsComponent} from './trade/logistics/logistics.component';
import {AdminTradePreviewComponent} from './trade/preview/preview.component';

import {AdminShareListComponent} from './share/list/list.component';
import {AdminShareItemComponent} from './share/item/item.component';
import {AdminShareAddComponent} from './share/add/add.component';
import {AdminShareReplyComponent} from './share/reply/reply.component';

import {AdminInviteIndexComponent} from './invite/index/index.component';
import {AdminInviteQrComponent} from './invite/qr/qr.component';

import {AdminSettingComponent} from './setting/setting.component';
import {AdminSettingNameComponent} from './setting/name/name.component';
import {AdminSettingPasswordComponent} from './setting/password/password.component';
import {AdminSettingAddressComponent} from './setting/address/address.component';
import {AdminSettingAddressAddComponent} from './setting/address/add/add.component';
import {AdminSettingAddressEditComponent} from './setting/address/edit/edit.component';
import {AdminSettingBindListComponent} from './setting/bind/list/list.component';
import {AdminSettingBindAddComponent} from './setting/bind/add/bind.component';

import {AdminLotteryComponent} from './lottery/lottery.component';
import {AdminLotteryQrComponent} from './lottery/qr/qr.component';

import {AdminArticleAgreementComponent} from './article/agreement/agreement.component';
import {AdminArticleRuleSignComponent} from './article/rule/sign/sign.component';

import {AdminCommissionsComponent} from './commissions/commissions.component';

import {AdminDashboardComponent} from './dashboard/dashboard.component';
import {appAdminDashboardRoutes} from './dashboard/dashboard-routing.module';

export const appAdminRoutes: Routes = [
  {path: 'home', component: AdminHomeComponent},
  {path: 'cart', component: AdminCartComponent},
  {path: 'collect', component: AdminCollectComponent},
  {path: 'flow', component: AdminFlowComponent},

  {path: 'account/index', component: AdminAccountIndexComponent},
  {path: 'account/record', component: AdminAccountRecordComponent},
  {path: 'account/fund/add', component: AdminAccountFundAddComponent},

  {path: 'trade/list', component: AdminTradeListComponent},
  {path: 'trade/item/:id', component: AdminTradeItemComponent},
  {path: 'trade/purchased', component: AdminTradePurchasedComponent},
  {path: 'trade/preview/:id', component: AdminTradePreviewComponent},
  {path: 'trade/logistics/:id', component: AdminTradeLogisticsComponent},

  {path: 'share/list', component: AdminShareListComponent},
  {path: 'share/item/:id', component: AdminShareItemComponent},
  {path: 'share/add/:id', component: AdminShareAddComponent},
  {path: 'share/reply/:id', component: AdminShareReplyComponent},

  {path: 'invite/index', component: AdminInviteIndexComponent},
  {path: 'invite/qr', component: AdminInviteQrComponent},

  {path: 'setting', component: AdminSettingComponent},
  {path: 'setting/name', component: AdminSettingNameComponent},
  {path: 'setting/password', component: AdminSettingPasswordComponent},
  {path: 'setting/address', component: AdminSettingAddressComponent},
  {path: 'setting/address/add', component: AdminSettingAddressAddComponent},
  {path: 'setting/address/edit/:id', component: AdminSettingAddressEditComponent},
  {path: 'setting/bind/list', component: AdminSettingBindListComponent},
  {path: 'setting/bind/add', component: AdminSettingBindAddComponent},

  {path: 'lottery', component: AdminLotteryComponent},
  {path: 'lottery/qr/:id', component: AdminLotteryQrComponent},

  {path: 'article/agreement', component: AdminArticleAgreementComponent},
  {path: 'article/rule/sign', component: AdminArticleRuleSignComponent},

  {path: 'commissions', component: AdminCommissionsComponent},
  {
    path: 'dashboard',
    component: AdminDashboardComponent,
    children: appAdminDashboardRoutes
  },
  {
    path: '**', redirectTo: 'home'
  }
];
