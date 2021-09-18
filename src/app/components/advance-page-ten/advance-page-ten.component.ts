import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import * as carriers from "../../../resource/carriers";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-advance-page-ten',
  templateUrl: './advance-page-ten.component.html',
  styleUrls: ['./advance-page-ten.component.scss']
})
export class AdvancePageTenComponent implements OnInit {
  @Output() setInsurnaceType: EventEmitter<string> = new EventEmitter<string>();
  constructor(public commonService: CommonService) {
    console.log(carriers);
  }

  public insurances: object = carriers.data;

  ngOnInit() {
  }

  submitInsuranceType(event){
    this.setInsurnaceType.emit(event.target.value);
  }
}
