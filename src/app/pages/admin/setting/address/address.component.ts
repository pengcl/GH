import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {StorageService} from '../../../../services/storage.service';
import {TabbarService} from "../../../../modules/tabbar";
import {AuthService} from '../../../../services/auth.service';
import {AddressService} from '../../../../services/address.service';

@Component({
  selector: 'app-admin-setting-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AdminSettingAddressComponent implements OnInit {

  appKey;

  settingForm: FormGroup;
  loading: boolean = false;

  addresses;

  constructor(private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private authSvc: AuthService,
              private addressSvc: AddressService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();

    this.settingForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      addrId: new FormControl('', [Validators.required])
    });

    this.settingForm.get('key').setValue(this.appKey);

    this.getAddresses();
  }

  getAddresses() {
    this.addressSvc.get(this.appKey).then(res => {
      if (res.code === '0000') {
        this.addresses = res.result.list;
      }
    });
  }

  del(id) {
    this.settingForm.get('addrId').setValue(id);
    this.addressSvc.del(this.settingForm.value).then(res => {
      if (res.code === '0000') {
        this.getAddresses();
      }
    });
  }

}
