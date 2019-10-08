import {Component, OnInit} from '@angular/core';
import {StorageService} from '../../services/storage.service';
import {DialogService} from 'ngx-weui';

@Component({
  selector: 'app-clear',
  template: ``,
})

export class ClearComponent implements OnInit {
  constructor(private storageSvc: StorageService,
              private dialogSvc: DialogService) {
    storageSvc.clear();
  }

  ngOnInit() {
    this.dialogSvc.show({content: '您已成功清除缓存', cancel: '', confirm: '我知道了'}).subscribe(() => {
      window.location.href = '/index';
    });
  }
}
