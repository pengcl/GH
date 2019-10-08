import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from './utils/loader.service';

@Injectable({providedIn: 'root'})
export class H2cService {

  constructor(private http: HttpClient, private load: LoaderService) {
  }

  get(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.load.loadScript('/assets/js/html2canvas.min.js').then((res) => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    });
  }
}
