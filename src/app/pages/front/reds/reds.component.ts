import {Component, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {timer as observableTimer, Observable} from 'rxjs';

import {InfiniteLoaderComponent, InfiniteLoaderConfig} from 'ngx-weui';

import {Config} from '../../../config';
import {TabbarService} from '../../../modules/tabbar';
import {ProductService} from '../../../services/product.service';
import {AuthService} from '../../../services/auth.service';
import {SysService} from '../../../services/sys.service';
import {CartService} from '../../../services/cart.service';
import {DialogService} from 'ngx-weui';

@Component({
  selector: 'app-front-reds',
  templateUrl: './reds.component.html',
  styleUrls: ['./reds.component.scss']
})
export class FrontRedsComponent implements OnInit {

  loaderConfig: InfiniteLoaderConfig = {
    percent: 75
  };

  @ViewChild('comp') private il: InfiniteLoaderComponent;

  config = Config;
  typeList;
  cid = '';
  types = [];
  typeShow: boolean = false;
  typeSelectedCount: number = 0;
  goods;
  ord = 'soonOpen';
  page: number = 1;
  totalPages: number;

  cartForm: FormGroup;
  cartsForm: FormGroup;

  position = {
    x: -10,
    y: -10
  };
  size = {
    w: 1.25,
    h: 1.25
  };

  sysConfig;

  cartBallShow: boolean = false;
  sourceElement;

  constructor(private tabbarSvc: TabbarService,
              private authSvc: AuthService,
              private sysSvc: SysService,
              private cartSvc: CartService,
              private prodSvc: ProductService,
              private dialogSvc: DialogService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {

    this.cartForm = new FormGroup({
      spellbuyproductid: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.cartsForm = new FormGroup({
      types: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      pk_type: new FormControl(3, [Validators.required])
    });

    this.cartForm.get('qty').setValue(1);

    this.prodSvc.getTypeList(3).then(res => {
      if (res.code === '0000') {
        this.typeList = res.result;
      }
    });

    this.getProducts(this.ord, '', this.page);

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.sysConfig = res.result;
      }
      console.log(res);
    });
  }

  setOrder(ord) {
    this.page = 1;
    this.il.restart();
    if (ord === 'maxPrice') {
      if (this.ord === 'maxPrice') {
        this.ord = 'minPrice';
      } else {
        this.ord = 'maxPrice';
      }
    } else {
      this.ord = ord;
    }

    this.getProducts(this.ord, this.cid, this.page);
  }

  setType(type) {
    this.cid = type.typeid || '';
    this.page = 1;
    this.il.restart();
    this.getProducts(this.ord, this.cid, this.page);
    this.typeShow = false;
  }

  onSelectedType(type) {
    if (type.selected) {
      if (this.typeSelectedCount >= 200) {
        this.dialogSvc.show({content: '超过200件无法继续添加！', cancel: '', confirm: '我知道了'}).subscribe();
        return false;
      }
      this.typeSelectedCount = this.typeSelectedCount + type.num;
      this.types.push(type.typeid);
    } else {
      this.typeSelectedCount = this.typeSelectedCount - type.num;
      this.types.splice(this.types.indexOf(type.typeid), 1);
    }
  }

  addCarts() {
    this.cartsForm.get('types').setValue(this.types);
    this.cartsForm.get('key').setValue(this.authSvc.getKey());
    this.cartSvc.addCarts(this.cartsForm.value).then(res => {
      if (res.code === '0000') {
        this.typeShow = !this.typeShow;
        this.cartSvc.updateCount(res.result.goodsCount);
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  getProducts(ord, cid, page) {
    cid = cid || '';
    this.prodSvc.getRedProductList(ord, cid, page).then(res => {
      this.goods = res.result;
      console.log(this.goods);
      this.totalPages = res.result.totalPages;
    });
  }

  addCart(id, e) {
    const appKey = this.authSvc.getKey();
    this.cartForm.get('spellbuyproductid').setValue(id);
    this.cartForm.get('key').setValue(appKey);
    this.cartSvc.addCart(this.cartForm.value).then(res => {
      if (res.code === '0000') {
        this.toCart(e);
        this.cartSvc.updateCount(res.result.goodsCount);
      }
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1000).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      this.prodSvc.getRedProductList(this.ord, this.cid, this.page).then(res => {
        if (res.code === '0000') {
          this.goods.list = this.goods.list.concat(res.result.list);
        }
      });

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  toCart(e) {
    // offsetParent
    // e.target.offsetParent.children[0]
    this.sourceElement = e.target.offsetParent.firstChild.firstChild;

    this.position = {
      x: e.x - e.layerX,
      y: e.y - e.layerY
    };
    this.size = {
      w: 0.75,
      h: 0.75
    };
    this.cartBallShow = true;
    observableTimer(100).subscribe(() => {
      this.position = {
        x: window.innerWidth / 10 * 7,
        y: window.innerHeight - 42
      };
      this.size = {
        w: 0.1,
        h: 0.1
      };
    });
    observableTimer(700).subscribe(() => {
      this.cartBallShow = false;
    });
  }

}
