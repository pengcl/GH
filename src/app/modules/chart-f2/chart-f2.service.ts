import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LoaderService} from '../../services/utils/loader.service';

@Injectable()
export class ChartF2Service {

  constructor(private http: HttpClient, private load: LoaderService) {
  }

  get(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.load.loadScript('https://gw.alipayobjects.com/os/antv/assets/f2/3.0.1/f2.min.js').then((res) => {
        resolve(res.loaded === true);
      }).catch(() => {
        resolve(false);
      });
    });
  }
}
