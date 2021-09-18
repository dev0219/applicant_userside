import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonService} from "../../services/common.service";
import {Router} from "@angular/router";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page-advance-six',
  templateUrl: './page-advance-six.component.html',
  styleUrls: ['./page-advance-six.component.scss']
})
export class PageAdvanceSixComponent implements OnInit {

  @Output() setPropertyData: EventEmitter<object> = new EventEmitter<object>();
  @Input('addressData') public addressData: object;

  pageSixCustomQuestion = [];
  constructor(public commonService: CommonService,private router: Router,private http: HttpClient) {
    this.checkQuestion();
  }

  // if roof_shape is set to true, roof is peaked. otherwise flat.
  public propertysData = {
    term_rental: false,
    property_own: false,
    multiple_unit: false,
    insurance_claims: false,
    policy_renewed: false,
    swimming_pool: false,
    swimming_type:{
      diving_board:false,
      slide:false,
      none_of_these:false,
      above_ground:false,
    }
  };

  ngOnInit() {
  }


  next() {
    if(typeof this.propertysData.term_rental !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select short term rentals option!');
      return;
    }
    if(typeof this.propertysData.property_own !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the property owned option!');
      return;
    }
    if(typeof this.propertysData.multiple_unit !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the multiple unit option!');
      return;
    }
    if(typeof this.propertysData.insurance_claims !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the insurance claim option!');
      return;
    }
    if(typeof this.propertysData.policy_renewed !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the policy re-new option!');
      return;
    }
    if(typeof this.propertysData.swimming_pool !== 'boolean'){
      this.commonService.modalOpen('Error', 'Please select the swimming pool option!');
      return;
    }
    if(this.propertysData.swimming_pool == true && this.propertysData.swimming_type.above_ground == false
       && this.propertysData.swimming_type.diving_board == false && this.propertysData.swimming_type.none_of_these == false && this.propertysData.swimming_type.slide == false)
    {
        this.commonService.modalOpen('Error', 'Please select the swimming pool option!');
        return;
    }

    // Custom question valdiation
    let temp = 0;
    this.pageSixCustomQuestion.forEach(function (item) {
        if(item.answer == ''){
          temp = 1;
        }
    });
    if(temp == 1){
      this.commonService.modalOpen('Error', 'Please fill proper questions answer!');
      return;
    }

    this.setPropertyData.emit({ propertyData:this.propertysData, pageSixCustomQuestion:this.pageSixCustomQuestion });
  }

  propertyInfo(event,type){
    this.propertysData[type] = event.target.checked;
  }

  swimming_pool_type(event,type){
    this.propertysData.swimming_type[type] = event.target.checked;
    console.log(this.propertysData);
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
                if(row[0] == "6"){
                  let num = index - 1;
                  var arr = {
                    question: row[1].toString().trim(),
                    type: row[2].toString().trim(),
                    answer: ''
                  }
                  this.pageSixCustomQuestion.push(arr);
                }
            }
            console.log(this.pageSixCustomQuestion);
        },
        error =>{
          console.log(error);
        }
      );
    }
}