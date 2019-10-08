import {Routes} from '@angular/router';
import {FrontIndexComponent} from './index/index.component';
import {FrontNewComponent} from './new/new.component';
import {FrontListComponent} from './list/list.component';
import {FrontRedsComponent} from './reds/reds.component';
import {FrontItemComponent} from './item/item.component';
import {FrontCalculationComponent} from './calculation/calculation.component';
import {FrontCashbackComponent} from './cashback/cashback.component';
import {FrontProcessComponent} from './process/process.component';

import {FrontShareComponent} from './share/share.component';
import {FrontMemberComponent} from './member/member.component';

import {FrontArticleListComponent} from './article/list/list.component';
import {FrontArticleItemComponent} from './article/item/item.component';
import {FrontArticleNoticesComponent} from './article/notices/notices.component';

export const appFrontRoutes: Routes = [
  {path: 'index', component: FrontIndexComponent},
  {path: 'new', component: FrontNewComponent},
  {path: 'list', component: FrontListComponent},
  {path: 'reds', component: FrontRedsComponent},
  {path: 'item/:id', component: FrontItemComponent},
  {path: 'calculation/:id', component: FrontCalculationComponent},
  {path: 'cashback/:id', component: FrontCashbackComponent},
  {path: 'process/:id', component: FrontProcessComponent},
  {path: 'share', component: FrontShareComponent},
  {path: 'member/:id', component: FrontMemberComponent},
  {path: 'article/list', component: FrontArticleListComponent},
  {path: 'article/item/:id', component: FrontArticleItemComponent},
  {path: 'article/notices', component: FrontArticleNoticesComponent},
  {
    path: '**', redirectTo: 'index'
  }
];
