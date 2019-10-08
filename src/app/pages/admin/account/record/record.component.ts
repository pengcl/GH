import {timer as observableTimer} from 'rxjs';
import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';

import {TabbarService} from '../../../../modules/tabbar';
import {AuthService} from '../../../../services/auth.service';
import {DialogService, InfiniteLoaderComponent} from 'ngx-weui';
import {AccountService} from '../../../../services/account.service';

import {Config} from '../../../../config';

@Component({
    selector: 'app-admin-account-record',
    templateUrl: './record.component.html',
    styleUrls: ['./record.component.scss']
})
export class AdminAccountRecordComponent implements OnInit {
    config = Config;

    appKey;

    totalPages: number;
    page: number = 1;

    records;

    constructor(private location: Location,
                private tabBarSvc: TabbarService,
                private dialogSvc: DialogService,
                private authSvc: AuthService,
                private accountSvc: AccountService) {
        this.tabBarSvc.setActive(4);
    }

    ngOnInit() {
        this.appKey = this.authSvc.getKey();
        this.accountSvc.getMyRecord(this.appKey, this.page).then(res => {
            console.log(res);
            if (res.code === '0000') {
                this.records = res.result;
                this.totalPages = res.result.totalPages;
            }
        });

    }

    onLoadMore(comp: InfiniteLoaderComponent) {
        observableTimer(500).subscribe(() => {

            this.page = this.page + 1;

            this.accountSvc.getMyRecord(this.appKey, this.page).then(res => {
                if (res.code === '0000') {
                    this.records.list = this.records.list.concat(res.result.list);
                }
            });

            if (this.page >= this.totalPages) {
                comp.setFinished();
                return;
            }
            comp.resolveLoading();
        });
    }

    onCancel(e) {
        if (e === 'cancel') {
            this.location.back();
        }
    }

}
