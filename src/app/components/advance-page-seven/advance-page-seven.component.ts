import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {carData, CarYearData, personData} from "../../home/models";
// import * as configs from "../../../../config";
//import * as configs from "../../../../config";
import * as config from "../../config/congifg"

@Component({
  selector: 'app-advance-page-seven',
  templateUrl: './advance-page-seven.component.html',
  styleUrls: ['./advance-page-seven.component.scss']
})
export class AdvancePageSevenComponent implements OnInit {

  @Output() setCarData: EventEmitter<object> = new EventEmitter<object>();
  @Input('addressData') public addressData: object;
  @Input('personData') public personData: personData[] = [];
  public CarTypeData: object = config.car_types;
  // public CarTypeData: object = configs.car_types;
  public CarYearData: CarYearData[] = [];

  constructor(public commonService: CommonService) {
  }

  public email: string;
  public phone: string;
  public carData: carData[] = [{year: '', type: '', model: ''}];

  ngOnInit() {
    this.CarYearData = this.commonService.getCarYearData();
  }

  addCar() {
    if (this.carData.length < 4) {
      this.carData[this.carData.length] = {year: '', type: '', model: ''};
    }
  };

  deleteCar(key) {
    if(this.carData.length>1){
      this.carData.splice(key, 1);
    }
  }

  addPerson() {
    if (this.personData.length < 5) {
      this.personData[this.personData.length] = {first_name: '', last_name: '', birthday: '', license: ''};
    }
  };

  deletePerson(key) {
    this.personData.splice(key, 1);
  }

  next() {
    this.setCarData.emit(this.carData);
  }
}
