import {Injectable} from '@angular/core';
import {Router, ActivatedRouteSnapshot, CanActivate} from '@angular/router';
import {Observable} from 'rxjs';
import {StorageService} from '../services/storage.service';
import {Config} from '../config';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private storage: StorageService) {
  }

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    if (this.storage.get('appKey')) {// 如果localStorage中存在appKey;
      return true;
    } else {// 如果localStorage中不存在userId;
      this.router.navigate(['/auth/signIn'], {queryParams: {callbackUrl: this.router.url}});
      return false;
    }
  }
}
