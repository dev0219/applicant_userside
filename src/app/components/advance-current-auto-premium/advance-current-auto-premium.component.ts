import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-advance-current-auto-premium',
  templateUrl: './advance-current-auto-premium.component.html',
  styleUrls: ['./advance-current-auto-premium.component.scss']
})
export class AdvanceCurrentAutoPremiumComponent implements OnInit {

  public current_premium: any;
    
  @Output() setCurrentPremiumData: EventEmitter<object> = new EventEmitter<object>();

  constructor(private commonService: CommonService) {
  }

  ngOnInit() {
  }

  autoPremium(){
    this.current_premium = "I Don't Know";
    this.submitPremium();
  }

  submitPremium(){
    let data = {'current_auto_premium': this.current_premium};
    this.setCurrentPremiumData.emit(data);
  }
}
