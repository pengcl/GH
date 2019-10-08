import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {StorageService} from '../../../../../services/storage.service';
import {TabbarService} from '../../../../../modules/tabbar';
import {AuthService} from '../../../../../services/auth.service';
import {AddressService} from '../../../../../services/address.service';
import {DialogService, PickerService} from 'ngx-weui';

import {DATA} from '../../../../../utils/cn';

@Component({
  selector: 'app-admin-setting-address-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss']
})
export class AdminSettingAddressAddComponent implements OnInit, OnDestroy {

  appKey;
  callbackUrl;

  settingForm: FormGroup;
  loading: boolean = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private storageSvc: StorageService,
              private tabBarSvc: TabbarService,
              private dialogSvc: DialogService,
              private pickerSvc: PickerService,
              private authSvc: AuthService,
              private addressSvc: AddressService) {
    this.tabBarSvc.setActive(4);
  }

  ngOnInit() {
    this.appKey = this.authSvc.getKey();
    this.callbackUrl = this.route.snapshot.queryParams['callbackUrl'];

    this.settingForm = new FormGroup({
      // id: new FormControl('', [Validators.required]),
      key: new FormControl('', [Validators.required]),
      lnker: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(4)]),
      mobile: new FormControl('', [Validators.required]),
      rgnpro: new FormControl('', [Validators.required]),
      rgncity: new FormControl('', [Validators.required]),
      rgnarea: new FormControl('', []),
      rgndtl: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(40)]),
      areaCode: new FormControl('', [Validators.required])
    });

    this.settingForm.get('key').setValue(this.appKey);
  }

  showPicker() {
    this.pickerSvc.showCity(DATA).subscribe((res: any) => {
      this.settingForm.get('rgnpro').setValue(res.items[0].name);
      this.settingForm.get('rgncity').setValue(res.items[1].name);
      if (res.items[2]) {
        this.settingForm.get('rgnarea').setValue(res.items[2].name);
      } else {
        this.settingForm.get('rgnarea').setValue('');
      }
      this.settingForm.get('areaCode').setValue(res.value);
    });
  }

  onSubmit() {
    if (this.loading || this.settingForm.invalid) {
      return false;
    }
    this.loading = true;
    this.addressSvc.save(this.settingForm.value).then(res => {
      if (res.code === '0000') {
        if (this.callbackUrl) {
          this.router.navigate([this.callbackUrl]);
        } else {
          window.history.back();
        }
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

  ngOnDestroy() {
    this.dialogSvc.destroyAll();
    this.pickerSvc.destroyAll();
  }

}
