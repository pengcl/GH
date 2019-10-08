import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router, NavigationStart} from '@angular/router';
import {filter} from 'rxjs/internal/operators';
import {MenuService} from '../../../modules/menu/menu.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminDashboardComponent implements OnInit {
  menuShow;

  constructor(private router: Router,
              private menuSvc: MenuService) {
    menuSvc.get().subscribe(res => {
      this.menuShow = res;
    });

    router.events.pipe(filter((event) => event instanceof NavigationStart))
      .subscribe((event: NavigationStart) => {
        this.menuSvc.hide();
      });
  }

  ngOnInit() {
  }

  menu() {
    this.menuSvc.hide();
  }
}
