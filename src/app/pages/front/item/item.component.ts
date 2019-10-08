import {Component, OnInit, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';

import {map} from 'rxjs/operators';
import {interval as observableInterval, timer as observableTimer} from 'rxjs/index';

import {Config} from '../../../config';
import {WxService} from '../../../modules/wx';
import {ProductService} from '../../../services/product.service';
import {CommentService} from '../../../services/comment.service';
import {ChartF2Service} from '../../../modules/chart-f2';
import {getIndex} from '../../../utils/utils';
import {CollectService} from '../../../services/collect.service';
import {AuthService} from '../../../services/auth.service';
import {TabbarService} from '../../../modules/tabbar';
import {CartService} from '../../../services/cart.service';
import {InfiniteLoaderComponent, DialogService} from 'ngx-weui';

@Component({
  selector: 'app-front-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FrontItemComponent implements OnInit {

  appKey;

  config = Config;
  ssConfig = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: false,
    autoplay: false
  };
  sConfig = {
    grabCursor: true,
    slidesPerView: 'auto',
    pagination: false,
    autoplay: {
      delay: 5000,
    }
  };

  id;
  prod;
  spellBuyProductList;
  spellBuyProductIndex;
  productMap;
  productImgs;
  charts;
  busLatestlottery;
  lastBusLatestlottery;
  // status; // 0:未开奖,1:已开奖,2:正在开奖

  count = 10; // 为避免服务器过载，最多刷10次开奖
  disabled: boolean = true;
  loading: boolean = false;
  statusText = '等待揭晓';

  timerFinished;

  comment;
  commentPage = 1;
  commentTotalPages;
  record;
  recordPage = 1;
  recordTotalPages;

  productImgIndex = 1;

  collectForm: FormGroup;
  collecting = false;
  cartForm: FormGroup;

  liked: boolean = false;

  @ViewChild('content') private content: ElementRef;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private F2Svc: ChartF2Service,
              private dialogSvc: DialogService,
              private wxSvc: WxService,
              private prodSvc: ProductService,
              private commentSvc: CommentService,
              private collectSvc: CollectService,
              private tabbarSvc: TabbarService,
              private authSvc: AuthService,
              private cartSvc: CartService) {
    this.tabbarSvc.setActive(1);
  }

  ngOnInit() {

    this.appKey = this.authSvc.getStorageKey();

    this.route.paramMap.pipe(map(params => this.id = params.get('id'))).subscribe(id => {
      this.top();

      this.collectForm = new FormGroup({
        key: new FormControl('', [Validators.required]),
        productId: new FormControl('', [Validators.required])
      });

      this.cartForm = new FormGroup({
        spellbuyproductid: new FormControl('', [Validators.required]),
        qty: new FormControl('', [Validators.required]),
        key: new FormControl('', [Validators.required])
      });

      this.cartForm.get('qty').setValue(1);

      this.getProduct(id);
    });
  }

  getProduct(id) {
    this.prodSvc.getProduct(id, this.appKey).then(res => {
      this.prod = res.result;
      console.log(this.prod);
      this.liked = res.result.isCollect;
      this.spellBuyProductList = res.result.spellBuyProductList;
      this.productMap = res.result.productMap;
      this.productMap.productdetail = this.productMap.productdetail.replace(/\/scripts\//gi, Config.prefix.wApi + '/scripts/');
      this.productImgs = res.result.productImgs;
      this.charts = res.result.charts;
      this.busLatestlottery = res.result.busLatestlottery || null;
      this.lastBusLatestlottery = res.result.lastBusLatestlottery || null;
      this.spellBuyProductIndex = getIndex(this.spellBuyProductList, 'spellbuyProductId', id);

      this.collectForm.get('productId').setValue(this.productMap.productid);
      this.prodSvc.getRecords(this.id).then(_res => {
        if (_res.code === '0000') {
          this.record = _res.result;
          console.log(this.record);
          this.recordTotalPages = _res.result.totalPages;
        }
      });
      this.commentSvc.getComments(this.productMap.productid).then(_res => {
        if (_res.code === '0000') {
          this.comment = _res.result;
          this.commentTotalPages = _res.result.totalPages;
        }
      });

      this.wxSvc.config({}).then(() => {
        // 其它操作，可以确保注册成功以后才有效
        // this.status = '注册成功';
      }).catch((err: string) => {
        console.log(`注册失败，原因：${err}`);
        // this.status = `注册失败，原因：${err}`;
      });
    });
  }

  getTimer(end, now) {
    return Date.parse(end.split('.')[0].replace(/\-/g, '/')) - now;
  }

  onFinished() {
    this.loading = true;
    this.statusText = '正在揭晓';
    this.timerFinished = observableInterval(1000).subscribe(() => {
      this.count = this.count - 1;
      this.prodSvc.open(this.id).then(res => res).then((res) => {
        if (res.code === '0000' && res.result) {
          observableTimer(1500).subscribe(() => {
            this.statusText = '已经揭晓';
            this.getProduct(this.id);
            this.loading = false;
          });
          this.timerFinished.unsubscribe();
        }
        if (this.count === 0) {
          this.timerFinished.unsubscribe();
        }
      });
    });
  }

  onIndexChange(e) {
    this.productImgIndex = e + 1;
  }

  collect() {
    if (this.collecting) {
      return false;
    }
    const appKey = this.authSvc.getKey();
    this.collectForm.get('key').setValue(appKey);

    this.collecting = true;
    if (this.prod.isCollect) {
      this.collectSvc.remove(this.collectForm.value).then(res => {
        this.collecting = false;
        if (res.code === '0000') {
          this.prod.isCollect = !this.prod.isCollect;
        }
      });
    } else {
      this.collectSvc.add(this.collectForm.value).then(res => {
        this.collecting = false;
        if (res.code === '0000') {
          this.prod.isCollect = !this.prod.isCollect;
        }
      });
    }
  }

  more(type) {
    if (type === 'record') {
      this.recordPage = this.recordPage + 1;
      this.prodSvc.getRecords(this.id, this.recordPage).then(res => {
        if (res.code === '0000') {
          if (this.recordPage <= this.recordTotalPages) {
            this.record.list = this.record.list.concat(res.result.list);
          }
        }
      });
    }
    if (type === 'comment') {
      this.commentPage = this.commentPage + 1;
      this.commentSvc.getComments(this.productMap.productid, this.commentPage).then(res => {
        if (res.code === '0000') {
          if (this.commentPage <= this.commentTotalPages) {
            this.comment.list = this.comment.list.concat(res.result.list);
          }
        }
      });
    }
  }

  addCart(id, go?) {
    this.cartForm.get('spellbuyproductid').setValue(id);
    const appKey = this.authSvc.getKey();
    this.cartForm.get('key').setValue(appKey);
    this.cartSvc.addCart(this.cartForm.value).then(res => {
      if (res.code === '0000') {
        this.cartSvc.updateCount(res.result.goodsCount);
        if (go) {
          this.router.navigate(['/admin/cart']);
        } else {
          this.dialogSvc.show({content: '已成功加入购物车', cancel: '', confirm: '我知道了'}).subscribe();
        }
      }
    });
  }

  top() {
    window.scrollTo(0, 0);
  }

}
