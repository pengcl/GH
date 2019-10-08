import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {interval as observableInterval} from 'rxjs';

import {Config} from '../../../config';
import {DialogService} from 'ngx-weui';
import {ProductService} from '../../../services/product.service';
import {AuthService} from '../../../services/auth.service';
import {CartService} from '../../../services/cart.service';

@Component({
  selector: 'app-front-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class FrontProcessComponent implements OnInit {

  config = Config;
  id;
  prod;

  total = 20;
  qty = 1;

  cartForm: FormGroup;
  loading = false;

  timer;

  isMonitor = false;

  statistics;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private cartSvc: CartService,
              private prodSvc: ProductService) {
  }

  ngOnInit() {

    this.id = this.route.snapshot.params['id'];

    this.cartForm = new FormGroup({
      spellbuyproductid: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.cartForm.get('spellbuyproductid').setValue(this.id);
    this.cartForm.get('qty').setValue(this.qty);

    this.prodSvc.getCharts(this.id, this.total).then(res => {
      this.prod = res.result;
      this.analysis();
    });
  }

  analysis() {
    const statistics = [
      {
        label: '头部',
        value: 0
      }, {
        label: '前部',
        value: 0
      }, {
        label: '中部',
        value: 0
      }, {
        label: '后部',
        value: 0
      }, {
        label: '尾部',
        value: 0
      }];
    this.prod.charts.forEach(item => {
      statistics[item.side].value = statistics[item.side].value + 1;
    });

    this.statistics = statistics;
  }

  setNum(e) {
    this.prodSvc.getCharts(this.id, e).then(res => {
      this.prod = res.result;
    });
  }

  onChange(e) {
    this.cartForm.get('qty').setValue(e);
  }

  addCart() {
    const key = this.authSvc.getKey();
    this.cartForm.get('key').setValue(key);

    this.cartSvc.addCart(this.cartForm.value).then(res => {
      if (res.code === '0000') {
        this.router.navigate(['/admin/cart']);
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  start() {
    if (this.isMonitor) {
      return false;
    }
    this.isMonitor = true;
    this.timer = observableInterval(10000).subscribe(() => {
      this.prodSvc.getCharts(this.id, this.total).then(res => {
        this.prod = res.result;
      });
    });
  }

  stop() {
    this.isMonitor = false;
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
}
