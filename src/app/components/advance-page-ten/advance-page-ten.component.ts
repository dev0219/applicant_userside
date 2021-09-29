import {Component, EventEmitter, OnInit, Output,Input} from '@angular/core';
import * as carriers from "../../../resource/carriers";
import {CommonService} from "../../services/common.service";
import {AdvanceHomeComponent} from "../../advance-home/advance-home.component";

@Component({
  selector: 'app-advance-page-ten',
  templateUrl: './advance-page-ten.component.html',
  styleUrls: ['./advance-page-ten.component.scss']
})
export class AdvancePageTenComponent implements OnInit {
  // householdimageurl:any
  // ishouseholdimage:any
  @Input('householdimageurl') public householdimageurl: string;
  @Output() setInsurnaceType: EventEmitter<string> = new EventEmitter<string>();
  constructor(public commonService: CommonService,private advanceService:AdvanceHomeComponent) {
    console.log(carriers);
  }

  public insurances: object = carriers.data;

  ngOnInit() {
    // this.ishouseholdimage = false;
    // setTimeout(() => { 
    //   this.householdimageurl = this.advanceService.gethouseholdUrl()
    //    this.ishouseholdimage = true;
    //  }, 1000);
  }

  submitInsuranceType(event){
    this.setInsurnaceType.emit(event.target.value);
  }
}
