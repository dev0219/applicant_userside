import {Component, EventEmitter, OnInit, Output, Input} from '@angular/core';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-page-one',
  templateUrl: './page-one.component.html',
  styleUrls: ['./page-one.component.scss']
})
export class PageOneComponent implements OnInit {
  @Output() setCurrentCarrierData: EventEmitter<number> = new EventEmitter<number>();
  @Input('current_carrier') public current_carrier: number;
  selected_category: string = "";
  constructor(private commonService: CommonService) { }

  ngOnInit() {
  }

  selectCurrentCatregory(val){
    this.setCurrentCarrierData.emit(val);
  }

}
