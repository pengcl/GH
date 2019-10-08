import {timer as observableTimer, Observable} from 'rxjs';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Location} from '@angular/common';

import {TabbarService} from '../../../modules/tabbar';
import {AuthService} from '../../../services/auth.service';
import {CartService} from '../../../services/cart.service';
import {CollectService} from '../../../services/collect.service';
import {DialogService} from 'ngx-weui';

import {InfiniteLoaderComponent} from 'ngx-weui';

import {Config} from '../../../config';

@Component({
  selector: 'app-admin-collect',
  templateUrl: './collect.component.html',
  styleUrls: ['./collect.component.scss']
})
export class AdminCollectComponent implements OnInit {
  config = Config;

  appKey;
  goods;

  tmpNum = '';

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  page: number = 1;
  totalPages: number;

  collectForm: FormGroup;
  toCartsForm: FormGroup;

  keyboardShow: boolean = false;

  loading: boolean = false;

  constructor(private router: Router,
              private location: Location,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private cartSvc: CartService,
              private collectSvc: CollectService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.collectForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      collectId: new FormControl('', [Validators.required])
    });

    this.toCartsForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      nums: new FormControl('', [Validators.required])
    });

    this.collectForm.get('key').setValue(this.appKey);
    this.toCartsForm.get('key').setValue(this.appKey);
    this.toCartsForm.get('nums').setValue(1);

    this.getCollects();
  }

  getCollects() {
    this.collectSvc.get(this.appKey).then(res => {
      if (res.code === '0000') {
        this.goods = res.result;
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(500).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      /*this.indexSvc.getFastList(this.currPage).then(res => {
        if (res.code === '0000') {
          this.goods = res.result;
          this.totalPages = res.result.totalPages;
        }
      });*/

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  del(e, id) {
    e.stopPropagation();
    this.collectForm.get('collectId').setValue(id);
    this.collectSvc.del(this.collectForm.value).then(res => {
      if (res.code === '0000') {
        this.getCollects();
      } else {
        this.dialogSvc.show({
          title: '系统提示',
          content: res.msg,
          cancel: '',
          confirm: '我知道了'
        }).subscribe();
      }
    });
  }

  onCancel(e) {
    if (e === 'cancel') {
      this.location.back();
    }
  }

  showKeyboard() {
    this.keyboardShow = !this.keyboardShow;
  }

  num(num) {
    if (this.tmpNum.length === 0 && num === '0') {
      return false;
    }
    this.tmpNum = this.tmpNum + num;
  }

  delete() {
    this.tmpNum = this.tmpNum.slice(0, -1);
  }

  sure() {
    if (!this.tmpNum) {
      this.showKeyboard();
      return false;
    }
    const num = parseInt(this.tmpNum, 10);
    this.toCartsForm.get('nums').setValue(num);
    this.showKeyboard();
  }

  submit() {
    if (this.loading) {
      return false;
    }

    if (this.goods.length === 0) {
      this.dialogSvc.show({content: '您的收藏并没有商品', cancel: '不了', confirm: '去首页逛逛'}).subscribe(data => {
        if (data.value) {
          this.router.navigate(['/index']);
        }
      });
      return false;
    }
    this.collectSvc.addToCarts(this.toCartsForm.value).then(res => {
      if (res.code === '0000') {
        this.cartSvc.updateCount(res.result.goodsCount);
        this.dialogSvc.show({content: '批量添加购物车成功！', cancel: '不了', confirm: '去购物车看看'}).subscribe(data => {
          if (data.value) {
            this.router.navigate(['/admin/cart']);
          }
        });
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

}
