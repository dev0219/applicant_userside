import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from "@angular/router";
import {CommonService} from "../../services/common.service";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page-adavance-five',
  templateUrl: './page-adavance-five.component.html',
  styleUrls: ['./page-adavance-five.component.scss']
})
export class PageAdavanceFiveComponent implements OnInit {


  @Output() setDiscountData: EventEmitter<object> = new EventEmitter<object>();
  @Input('addressData') public addressData: object;

  homeSlider = { 
    
    dots: true, 
    nav: true ,
    responsive:{
      0:{
          items:2,
          nav: true
          
      },
      576:
      {
        items:3,
        nav: true
      },
      900:
      {
          items:2,
          nav: true 
          
      },
      1200:{
          items:3,
          nav: true
          
         
      }
    }
  };

  pageFiveCustomQuestion = [];

  constructor(public commonService: CommonService,private router: Router,private http: HttpClient) {
    this.checkQuestion();
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
    good_credit: '',
    foundation:'',
    roof_type:'',
    dog_desc:'',
    basement_status:''
  };
  dogstatus = false;

  ngOnInit() {
  }


  next() {

    if(this.discountsData.foundation == ''){
      this.commonService.modalOpen('Error', 'Please select the foundation option!');
      return;
    }
    if(this.discountsData.foundation == 'basement' && this.discountsData.basement_status == ''){
      this.commonService.modalOpen('Error', 'Please select the basement status!');
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
    if(this.discountsData.roof_shape == ''){
      this.commonService.modalOpen('Error', 'Please select the roof shape option!');
      return;
    }
    if(this.discountsData.roof_type == ''){
      this.commonService.modalOpen('Error', 'Please select the roof type option!');
      return;
    }
    if(this.discountsData.dog == true && this.discountsData.dog_desc.trim() == ""){
      this.commonService.modalOpen('Error', 'Please enter dog description!');
      return;
    }else if(this.discountsData.dog == true && this.discountsData.dog_desc.trim() != ""){
      this.discountsData.dog_desc = this.discountsData.dog_desc.trim();
    }
    // Custom question valdiation
    let temp = 0;
    this.pageFiveCustomQuestion.forEach(function (item) {
        if(item.answer == ''){
          temp = 1;
        }
    });
    if(temp == 1){
      this.commonService.modalOpen('Error', 'Please fill proper questions answer!');
      return;
    }

    this.setDiscountData.emit({discountsData: this.discountsData,pageFiveCustomQuestion:this.pageFiveCustomQuestion });
  }

  dogcheck(status){
    this.discountsData.dog_desc = "";
    this.dogstatus = status;
  }

  basementStatusChange(status){
    this.discountsData.basement_status = status;
  }

  checkQuestion(){
    let currentAgent = this.router.url.split('/')[1] != "f" && this.router.url.split('/')[1] != "life" ? this.router.url.split('/')[1] : this.router.url.split('/')[2];
    let cagent = currentAgent.split("?");
    if(cagent.length > 1){
      let agnt = cagent[0].toString();
      currentAgent = agnt;
    }

    this.http.get('assets/'+currentAgent+'.csv', {responseType: 'text'})
      .subscribe(
          data => {
            let csvToRowArray = data.split("\n");
            for (let index = 1; index < csvToRowArray.length - 1; index++) {
              let row = csvToRowArray[index].split(",");
              
              if(row[0] == "5"){
                var arr =  {
                  question: row[1].toString().trim(),
                  type: row[2].toString().trim(),
                  answer: ''
                };
                this.pageFiveCustomQuestion.push(arr);
              }
            }
        },
        error =>{
          console.log(error);
        }
      );
    }
}
