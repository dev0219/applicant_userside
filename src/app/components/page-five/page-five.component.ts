import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-page-five',
  templateUrl: './page-five.component.html',
  styleUrls: ['./page-five.component.scss']
})
export class PageFiveComponent implements OnInit {

  @Output() setDiscountData: EventEmitter<object> = new EventEmitter<object>();
  @Input('addressData') public addressData: object;

  constructor(public commonService: CommonService) {
  }

  // if roof_shape is set to true, roof is peaked. otherwise flat.
  public discountsData = {
    roof_shape: '',
    security_system: '',
    dog: '',
    pool: '',
    alarm: '',
    bundle: '',
    claim_free: '',
    life_ins: '',
    smoke_detector: '',
    good_credit: ''
  };

  ngOnInit() {
  }


  next() {
    if(typeof this.discountsData.claim_free !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the basement option!');
      return;
    }
    if(typeof this.discountsData.security_system !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the security system option!');
      return;
    }
    if(typeof this.discountsData.dog !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the dog option!');
      return;
    }
    if(typeof this.discountsData.roof_shape !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the roof shape option!');
      return;
    }
    /*if(typeof this.discountsData.pool !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the pool option!');
      return;
    }*/
    this.setDiscountData.emit(this.discountsData);
  }
}
