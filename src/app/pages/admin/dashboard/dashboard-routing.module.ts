import {Routes} from '@angular/router';
import {AdminDashboardIndexComponent} from './index/index.component';
import {AdminDashboardFundRechargeComponent} from './fund/recharge/recharge.component';
import {AdminDashboardSearchComponent} from './search/search.component';
import {AdminDashboardRecordsComponent} from './records/records.component';

import {AdminDashboardBindListComponent} from './bind/list/list.component';
import {AdminDashboardBindAddComponent} from './bind/add/add.component';
import {AdminDashboardBindEditComponent} from './bind/edit/edit.component';

import {AdminDashboardPricesComponent} from './prices/prices.component';

export const appAdminDashboardRoutes: Routes = [
  {path: 'index', component: AdminDashboardIndexComponent},
  {path: 'fund/recharge', component: AdminDashboardFundRechargeComponent},
  {path: 'bind/list', component: AdminDashboardBindListComponent},
  {path: 'bind/add', component: AdminDashboardBindAddComponent},
  {path: 'bind/edit/:id', component: AdminDashboardBindEditComponent},
  {path: 'search', component: AdminDashboardSearchComponent},
  {path: 'records', component: AdminDashboardRecordsComponent},
  {path: 'prices', component: AdminDashboardPricesComponent},
  {
    path: '**', redirectTo: 'index'
  }
];
