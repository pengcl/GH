import {Component, OnInit, ViewChild, OnDestroy, ElementRef} from '@angular/core';
import {Router} from '@angular/router';
import {timer as observableTimer, interval as observableInterval, Observable} from 'rxjs';
import {take} from 'rxjs/operators';

import {FormControl, FormGroup, Validators} from '@angular/forms';

import {InfiniteLoaderComponent, MaskComponent, DialogService} from 'ngx-weui';
import {Config} from '../../config';

import {StorageService} from '../../services/storage.service';
import {TabbarService} from '../../modules/tabbar';
import {NotifyService} from '../../modules/notify/notify.service';
import {IndexService} from '../../services/index.service';
import {ProductService} from '../../services/product.service';
import {AuthService} from '../../services/auth.service';
import {CartService} from '../../services/cart.service';
import {SysService} from '../../services/sys.service';
import {CollectService} from '../../services/collect.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit, OnDestroy {

  appKey;
  config = Config;
  sConfig = {
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    pagination: true,
    autoplay: {
      delay: 3000,
    }
  };

  sysConfig;

  @ViewChild('comp') private il;
  @ViewChild('scrollTo') private scrollTo: ElementRef;
  @ViewChild('mask') mask: MaskComponent;
  /*@ViewChild('qrSite') qrSite: MaskComponent;*/

  indexData;
  lotteries;
  goods;
  ord = '';
  cid = '';
  types = [];
  typeList;
  typeSelectedCount: number = 0;
  typeShow: boolean = false;
  page: number = 1;
  totalPages: number;

  cartForm: FormGroup;
  cartsForm: FormGroup;
  addCollectForm: FormGroup;
  removeCollectForm: FormGroup;

  timer;
  timerFinished;
  soonItem;

  customerQrCode;
  scrollToOffsetTop;
  menuFixed: boolean = false;

  position = {
    x: -10,
    y: -10
  };
  size = {
    w: 1.25,
    h: 1.25
  };

  cartBallShow: boolean = false;
  sourceElement;

  constructor(private router: Router,
              private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private sysSvc: SysService,
              private authSvc: AuthService,
              private notifySvc: NotifyService,
              private dialogSvc: DialogService,
              private indexSvc: IndexService,
              private prodSvc: ProductService,
              private cartSvc: CartService,
              private collectSvc: CollectService) {
    this.tabBarSvc.setActive(0);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getStorageKey();

    /*if (this.indexSvc.isQrShow()) {
      this.qrSite.show();
    }*/

    this.indexSvc.getIndex().then(res => {
      this.indexData = res.result;
      if (res.result.indexImgs && res.result.indexImgs.length > 0) {
        const images = [];
        res.result.indexImgs.forEach((item) => {
          if (item.status !== 1) {
            images.push(item);
          }
        });
        this.indexData.indexImgs = images;
      }
      this.lotteries = res.result.latestLotterys;
      /*this.notifySvc.news('广惠商城', this.indexData.busNotice.describe, 5000);*/
      this.getSoonOpensProduct();
      observableTimer(2000).subscribe(() => {
        this.scrollToOffsetTop = this.scrollTo.nativeElement.offsetTop;
      });
      this.timer = observableInterval(10000).subscribe(() => {
        this.getSoonOpensProduct();
      });
    });

    this.cartForm = new FormGroup({
      spellbuyproductid: new FormControl('', [Validators.required]),
      qty: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.cartsForm = new FormGroup({
      types: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required])
    });

    this.addCollectForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required])
    });

    this.removeCollectForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      productId: new FormControl('', [Validators.required])
    });

    this.cartForm.get('qty').setValue(1);

    this.indexSvc.getFastList(this.page, this.appKey).then(res => {
      if (res.code === '0000') {
        this.goods = res.result;
        this.totalPages = res.result.totalPages;
      }
    });

    this.prodSvc.getTypeList().then(res => {
      if (res.code === '0000') {
        this.typeList = res.result;
      }
    });

    this.sysSvc.getSysConfig().then(res => {
      if (res.code === '0000') {
        this.sysConfig = res.result;
        this.customerQrCode = res.result.customerQrCode;
      }
    });

  }

  getSoonOpensProduct() {
    this.indexSvc.getSoonOpensProduct().then(data => {

      // 重新组装 lotteries
      data.result.forEach(item => {
        let isSame = false; // 是否重复标签
        item.animate = 'fadeInLeft';
        this.lotteries.forEach(lottery => { // 遍历lotteries
          if (lottery.lotteryid && lottery.lotteryid === item.lotteryid) { // 检查是否重复
            isSame = true;
          }
        });
        if (!isSame) { // 如果不重复删掉最后一个对象并在数组最前插入新对象
          this.lotteries.pop();
          this.lotteries.unshift(item);
        }
      });
    });
  }

  getTimer(end, now, id) { // 格式化时间并返回倒计时剩余时间
    if (end && now) {
      return Date.parse(end.split('.')[0].replace(/\-/g, '/')) - now;
    }
  }

  onFinished(item) { // 倒计时结束时执行
    this.soonItem = item; // 更新当前揭晓对象
    this.timerFinished = observableInterval(1000).pipe(take(5)).subscribe(() => { // 监听服务器揭晓是否完成
      this.prodSvc.open(item.lotteryproductid).then(res => res).then((res) => {
        if (res.code === '0000' && res.result) { // 返回 result不为空时为服务器完成揭晓
          res.result.animate = 'flipInY';
          this.lotteries.forEach((lottery, i) => { // 遍历 this.lotteries
            if (lottery.lotteryid && lottery.lotteryid === item.lotteryid) { // 找到当前完成揭晓对象并更新为已揭晓对象
              this.lotteries[i] = res.result; // 更新为已揭晓对象
            }
          });
          this.timerFinished.unsubscribe(); // 取消监听服务器
        }
      });
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

  getProducts(ord, cid, page) {
    cid = cid || '';
    this.prodSvc.getProductList(ord, cid, page, this.appKey).then(res => {
      this.goods = res.result;
      this.totalPages = res.result.totalPages;
    });
  }

  addCart(id, e, go?) {
    this.cartForm.get('spellbuyproductid').setValue(id);
    const appKey = this.authSvc.getKey();
    this.cartForm.get('key').setValue(appKey);
    this.cartSvc.addCart(this.cartForm.value).then(res => {
      if (res.code === '0000') {
        this.cartSvc.updateCount(res.result.goodsCount);
        if (go) {
          this.router.navigate(['/admin/cart']);
        } else {
          this.toCart(e);
        }
      }
    });
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

  onArrived(e) {
    this.menuFixed = e;
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    observableTimer(1500).subscribe(() => {

      this.page = this.page + 1;

      // 获取当前页数据
      if (this.ord || this.cid) {
        this.prodSvc.getProductList(this.ord, this.cid, this.page).then(res => {
          this.goods.list = this.goods.list.concat(res.result.list);
        });
      } else {
        this.indexSvc.getFastList(this.page, this.appKey).then(res => {
          if (res.code === '0000') {
            this.goods.list = this.goods.list.concat(res.result.list);
          }
        });
      }

      if (this.page >= this.totalPages) {
        comp.setFinished();
        return;
      }

      comp.resolveLoading();
    });
  }

  contact() {
    this.mask.show();
  }

  collect(item, e) {
    e.stopPropagation();
    const appKey = this.authSvc.getKey();
    this.addCollectForm.get('key').setValue(appKey);
    this.removeCollectForm.get('key').setValue(appKey);
    this.addCollectForm.get('productId').setValue(item.productid);
    this.removeCollectForm.get('productId').setValue(item.productid);

    if (item.incollect === 1) {
      this.collectSvc.add(this.addCollectForm.value).then();
    } else {
      this.collectSvc.remove(this.addCollectForm.value).then();
    }
  }

  toCart(e) {
    // offsetParent
    // e.target.offsetParent.children[0]
    this.sourceElement = e.target.offsetParent.firstChild.firstChild.firstChild;

    this.position = {
      x: e.x - e.layerX,
      y: e.y - e.layerY
    };
    this.size = {
      w: 1.25,
      h: 1.25
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

  close() {
    /*this.qrSite.hide();
    this.storageSvc.set('isQrHidden', true);*/
  }

  ngOnDestroy() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    if (this.timerFinished) {
      this.timerFinished.unsubscribe();
    }

    this.notifySvc.destroyAll();
  }

}
