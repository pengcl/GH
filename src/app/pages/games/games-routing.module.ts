import {Routes} from '@angular/router';
import {GamesMouseComponent} from './mouse/mouse.component';
import {GamesEggComponent} from './egg/egg.component';
import {GamesReceiveComponent} from './receive/receive.component';
import {GamesQrComponent} from './qr/qr.component';
import {GamesCardsComponent} from "./cards/cards.component";

export const appGamesRoutes: Routes = [
  {path: 'mouse', component: GamesMouseComponent},
  {path: 'egg', component: GamesEggComponent},
  {path: 'card', component: GamesCardsComponent},
  {path: 'receive', component: GamesReceiveComponent},
  {path: 'qr/:id', component: GamesQrComponent},
  {
    path: '**', redirectTo: 'mouse'
  }
];
