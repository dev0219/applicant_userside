import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {questionsData} from '../../home/models';
import {CommonService} from "../../services/common.service";

@Component({
  selector: 'app-page-eight',
  templateUrl: './page-eight.component.html',
  styleUrls: ['./page-eight.component.scss']
})
export class PageEightComponent implements OnInit{
  @Output() setQuestions: EventEmitter<object> = new EventEmitter<object>();
  public havenLifePricing:number;
  public havenLifeAmount:number;
  public questionData: questionsData = {
    personal_articles: null,
    haven_life: null,
    is_umbrella_policy: null,
    personal_articles_answer: null
  };

  constructor(public commonService: CommonService) {
  }

  ngOnInit() {
    try{
      const api_data = this.commonService.getItem('api_data');
      this.havenLifePricing = api_data.havenlife.quotes[0].monthlyRate;
      this.havenLifeAmount=api_data.havenlife.quotes[0].coverageAmount;
      console.log(this.havenLifeAmount)
    }catch (e) {
      this.havenLifePricing = 33;
    }
    this.havenLifePricing = Math.round(this.havenLifePricing);
  }

  choose(key, value) {
    this.questionData[key] = value;
  }

  next() {
    if (this.questionData.personal_articles === null) {
      this.commonService.modalOpen('Warning', 'Please select personal article!');
      return;
    }
    if (this.questionData.personal_articles && !this.questionData.personal_articles_answer) {
      this.commonService.modalOpen('Warning', 'Please answer the personal articles question!');
      return;
    }
    if (typeof this.questionData.haven_life === null) {
      this.commonService.modalOpen('Warning', 'Please select haven life pricing!');
      return;
    }
    if (typeof this.questionData.is_umbrella_policy === null) {
      this.commonService.modalOpen('Warning', 'Please select umbrella policy!');
      return;
    }
    this.commonService.applyTotalData('questionData', this.questionData);
    this.setQuestions.emit(this.questionData);
  }
}
