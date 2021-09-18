import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
    selector: 'app-buy-home',
    templateUrl: './buy-home.component.html',
    styleUrls: ['./buy-home.component.scss']
})
export class BuyHomeComponent implements OnInit {
    public buying_date: Date;
    public isBuyingHome: any;
    @Output() setHomeData: EventEmitter<object> = new EventEmitter<object>();

    constructor(private commonService: CommonService) {
    }

    ngOnInit() {
    }

    emitInfo(is_buying_home) {
        const data = {
            buying_date: this.buying_date,
            is_buying_home
        };
        if (is_buying_home) {
            const d = new Date(this.buying_date);
            if (Object.prototype.toString.call(d) === "[object Date]") {
                if (!isNaN(d.getTime())) {
                    if (d.getFullYear() != 2020) {
                        this.commonService.modalOpen('warning', 'Please select the current year.');
                        return;
                    }
                } else {
                    this.commonService.modalOpen('warning', 'Please select the valid date.');
                    return;
                }
            }
        }
        this.setHomeData.emit(data);
    }
}
