import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {AdvanceHomeComponent} from "../../advance-home/advance-home.component";

@Component({
  selector: 'app-insuarace-type-selection',
  templateUrl: './insuarace-type-selection.component.html',
  styleUrls: ['./insuarace-type-selection.component.scss']
})
export class InsuaraceTypeSelectionComponent implements OnInit {

  public insuarance_type: string;
  introduceimageurl:any
    @Output() setHomeData: EventEmitter<object> = new EventEmitter<object>();

    constructor(private commonService: CommonService, private advanceService:AdvanceHomeComponent) {
    }

  ngOnInit() {
  
   setTimeout(() => { this.introduceimageurl = this.advanceService.gethouseUrl()}, 1000);
    
  }

  submitInsuaranceType(data)
  {
    this.insuarance_type =data;
    let type={'insuarance_type': data}
    this.setHomeData.emit(type);
  }
}
