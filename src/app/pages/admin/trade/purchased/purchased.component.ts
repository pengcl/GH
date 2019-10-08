import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

import {StorageService} from '../../../../services/storage.service';
import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {TradeService} from '../../../../services/trade.service';
import {DialogService} from 'ngx-weui';
import {NotifyService} from '../../../../modules/notify';

import {InfiniteLoaderComponent, PickerService} from 'ngx-weui';

import {Config} from '../../../../config';
import {AddressService} from '../../../../services/address.service';
import {LotteryService} from "../../../../services/lottery.service";
import {WxService, WxComponent} from '../../../../modules/wx';
import {getIndex} from '../../../../utils/utils';

@Component({
  selector: 'app-admin-trade-purchased',
  templateUrl: './purchased.component.html',
  styleUrls: ['./purchased.component.scss']
})
export class AdminTradePurchasedComponent implements OnInit, OnDestroy {
  config = Config;

  appKey;
  uid;

  @ViewChild('comp') private il: InfiniteLoaderComponent;
  @ViewChild(WxComponent) private wc;

  totalPages: number;
  page: number = 1;

  purchased;
  tradeForm: FormGroup;

  addresses;

  constructor(private storageSvc: StorageService,
              private router: Router,
              private location: Location,
              private wxSvc: WxService,
              private tabBarSvc: TabbarService,
              private notifySvc: NotifyService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private tradeSvc: TradeService,
              private addressSvc: AddressService,
              private lotterySvc: LotteryService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.uid = this.authSvc.getUid();

    this.tradeForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      pid: new FormControl('', [Validators.required]),
      addrId: new FormControl('', [Validators.required])
    });

    this.tradeForm.get('key').setValue(this.appKey);

    this.tradeSvc.getShoppingList(this.appKey, 1).then(res => {
      console.log(res);
      this.purchased = res.result;
      this.totalPages = res.result.totalPages;
      if (res.result.list.length > 0) {
        /*this.notifySvc.news('', '该页面只保存2个月内订单记录，请您及时完善地址', 5000);*/
      }
    });

    this.addressSvc.get(this.appKey).then(res => {
      const addresses = [];
      res.result.list.forEach(item => {
        item.label = item.consignee + ' ' + item.province + item.city + item.district + item.street + item.address;
        item.value = item.id;
        addresses.push(item);
      });
      this.addresses = addresses;
    });
  }

  saveProdAddr(prod) {
    if (this.addresses.length === 0) {
      this.router.navigate(['/admin/setting/address/add'], {queryParams: {callbackUrl: '/admin/trade/purchased'}});
      return false;
    }
    this.tradeForm.get('pid').setValue(prod.spellbuyproductidEnc);
    const index = getIndex(this.purchased.list, 'spellbuyproductidEnc', prod.spellbuyproductidEnc);
    this.pickerSvc.show([this.addresses], [], [], {cancel: '取消', confirm: '确定'}).subscribe(data => {
      this.dialogSvc.show({title: '温馨提示', content: '您一旦确认，将无法修改订单地址', cancel: '取消', confirm: '确认'}).subscribe(_res => {
        if (_res.value) {
          this.tradeForm.get('addrId').setValue(data.value);
          this.addressSvc.saveProdAddr(this.tradeForm.value).then(res => {
            if (res.code === '0000') { // 更新状态
              this.purchased.list[index].status = res.result.status;
              this.purchased.list[index].isshare = res.result.isshare;
              this.purchased.list[index].sharestatus = res.result.sharestatus;
              this.purchased.list[index].isautocontact = res.result.isautocontact;
              this.purchased.list[index].isshareorder = res.result.isshareorder;
            } else {
              this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
            }
          });
        }
      });
    });
  }

  confirmProd(prod) {
    this.tradeForm.get('pid').setValue(prod.spellbuyproductidEnc);
    const index = getIndex(this.purchased.list, 'spellbuyproductidEnc', prod.spellbuyproductidEnc);
    this.tradeSvc.confirmReceipt(this.tradeForm.value).then(res => {
      if (res.code === '0000') { // 更新状态
        // this.purchased.list[index] = res.result;
        this.purchased.list[index].status = res.result.status;
        this.purchased.list[index].isshare = res.result.isshare;
        this.purchased.list[index].sharestatus = res.result.sharestatus;
        this.purchased.list[index].isautocontact = res.result.isautocontact;
        this.purchased.list[index].isshareorder = res.result.isshareorder;
        console.log({
          status: res.result.status,
          isshare: res.result.isshare,
          sharestatus: res.result.sharestatus,
          isautocontact: res.result.isautocontact,
          isshareorder: res.result.isshareorder
        });
      } else {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      }
    });
  }

  onShare(item) {
    console.log(item);
    this.wxSvc.config({
      title: '我又得到幸运码啦！',
      desc: '我在广惠商城花' + item.buynumbercount + '元获得' + item.productname + '商品，快一起来参与吧！',
      link: Config.webHost + '/index?referee=' + this.uid,
      imgUrl: Config.prefix.wApi + item.productimg
    }).then(() => {
      console.log('注册成功');
      // 其它操作，可以确保注册成功以后才有效
      // this.status = '注册成功';
    }).catch((err: string) => {
      console.log(`注册失败，原因：${err}`);
      // this.status = `注册失败，原因：${err}`;
    });
    this.wxSvc.show({targetTips: '继续邀请好友吧！'}).subscribe(res => {
      console.log(res);
    });
  }

  invite(item) {
    const qrRouter = item.orderno.split('')[0] === 'T' ? '/admin/lottery/qr' : '/games/qr';
    this.lotterySvc.getLottery(this.appKey, item.spellbuyproductid).then(res => {
      this.router.navigate([qrRouter, res.result.id], {queryParams: {pid: item.spellbuyproductid}});
    });
  }

  onLoadMore(comp: InfiniteLoaderComponent) {
    this.page = this.page + 1;

    // 获取当前页数据
    this.tradeSvc.getShoppingList(this.appKey, this.page).then(res => {
      if (res.code === '0000') {
        this.purchased.list = this.purchased.list.concat(res.result.list);
      }
    });

    if (this.page >= this.totalPages) {
      comp.setFinished();
      return;
    }

    comp.resolveLoading();
  }

  onCancel(e) {
    if (e === 'cancel') {
      this.location.back();
    }
  }

  ngOnDestroy() {
    this.wxSvc.destroy(this.wc);
    this.notifySvc.destroyAll();
  }

}
