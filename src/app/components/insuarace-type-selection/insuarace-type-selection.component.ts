import {Component, EventEmitter, OnInit, Output,Input} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AdvanceHomeComponent} from "../../advance-home/advance-home.component";

@Component({
  selector: 'app-insuarace-type-selection',
  templateUrl: './insuarace-type-selection.component.html',
  styleUrls: ['./insuarace-type-selection.component.scss']
})
export class InsuaraceTypeSelectionComponent implements OnInit {

  public insuarance_type: string;
  // introduceimageurl:any
  // isintrouceimage:any
    @Output() setHomeData: EventEmitter<object> = new EventEmitter<object>();
    @Input('introduceimageurl') public introduceimageurl: string;
    constructor(private commonService: CommonService, private advanceService:AdvanceHomeComponent) {
    }

  ngOnInit() {
  //   this.isintrouceimage = false;
  //  setTimeout(() => { 
  //    this.introduceimageurl = this.advanceService.gethouseUrl()
  //     this.isintrouceimage = true;
  //   }, 2000);
    
  }
  submitInsuaranceType(data)
  {
    this.insuarance_type =data;
    let type={'insuarance_type': data}
    this.setHomeData.emit(type);
  }
}
