import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {questionsData} from '../../home/models';
import {ApiService} from "../../api-service";
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-page-ten',
  templateUrl: './page-ten.component.html',
  styleUrls: ['./page-ten.component.scss']
})
export class PageTenComponent implements OnInit {
  @Output() setQuestions: EventEmitter<object> = new EventEmitter<object>();
  public questionData;
  public apiData: object;
  public floodData: object;
  public havenLifePricing:number;
  public havenLifeAmount:number;
  constructor(public apiService: ApiService, public commonService: CommonService) {
  }

  ngOnInit() {
    this.setInitData();
    this.getPrices();
  }

  setInitData() {
    const data = this.commonService.getItem('api_data');
    this.floodData = data['neptuneflood'];
    this.questionData = this.commonService.extractData('questionData');
    console.log(this.questionData);
  }
  getPrices(){
    this.apiData = this.commonService.getPricing();
    setInterval(() => {
      this.apiData = this.commonService.getPricing();
    }, 1000);
    try{
      const api_data = this.commonService.getItem('api_data');
      this.havenLifePricing = api_data.havenlife.quotes[0].monthlyRate;
      this.havenLifeAmount=api_data.havenlife.quotes[0].coverageAmount;

    }catch (e) {
      this.havenLifePricing = 33;
    }
    this.havenLifePricing = Math.round(this.havenLifePricing);

  }
  choose(key, value) {
    this.questionData[key] = value;
  }

  submitLifeForm() {
    document.forms[0].submit();
  }

  next() {
    this.setQuestions.emit(this.questionData);
  }

}
