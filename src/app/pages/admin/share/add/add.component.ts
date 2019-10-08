import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';

import {Config} from '../../../../config';
import {DialogService, UploaderOptions, Uploader} from 'ngx-weui';
import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {ShareService} from '../../../../services/share.service';
import {ProductService} from '../../../../services/product.service';
import {TradeService} from '../../../../services/trade.service';

@Component({
  selector: 'app-admin-share-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AdminShareAddComponent implements OnInit {
  config = Config;

  appKey;

  trade;
  shareForm: FormGroup;
  imageNames = [];
  loading = false;
  isSubmit = false;

  img: any;
  imgShow: boolean = false;

  uploader: Uploader = new Uploader(<UploaderOptions>{
    url: Config.prefix.wApi + '/interface/call.html?action=uploadInfoImage',
    headers: [],
    params: {
      key: ''
    },
    auto: true,
    onUploadSuccess: (file, res) => {
      const _res = JSON.parse(res);
      if (_res.code === '0000') {
        this.imageNames.push(_res.result);
      }
      this.shareForm.get('imageNames').setValue(this.imageNames);
    }
  });

  constructor(private route: ActivatedRoute,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private authSvc: AuthService,
              private shareSvc: ShareService,
              private productSvc: ProductService,
              private tradeSvc: TradeService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.shareForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      sproductId: new FormControl('', [Validators.required]),
      content: new FormControl('', [Validators.required]),
      imageNames: new FormControl('', [Validators.required])
    });

    this.tradeSvc.getDetail(this.appKey, this.route.snapshot.params['id'], 'OVER').then(res => {
      this.trade = res.result;
    });


    this.shareForm.get('key').setValue(this.appKey);
    this.uploader.options.params.key = this.appKey;
    this.shareForm.get('sproductId').setValue(this.route.snapshot.params['id']);
  }

  onGallery(item: any) {
    this.img = [{file: item._file, item: item}];
    this.imgShow = true;
  }

  onDel(item: any) {
    this.uploader.removeFromQueue(item.item);
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.loading || this.shareForm.invalid) {
      return false;
    }
    this.loading = true;
    this.shareSvc.save(this.shareForm.value).then(res => {
      this.loading = false;
      if (res.code !== '0000') {
        this.dialogSvc.show({content: res.msg, cancel: '', confirm: '我知道了'}).subscribe();
      } else {
        window.history.back();
      }
    });
  }

}
