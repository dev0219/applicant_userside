import {AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import { Observable } from "rxjs";
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../api-service";
import {Router} from "@angular/router";
import {MapsAPILoader} from "@agm/core";
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import * as configs from "../config/config";
import {CommonService} from "../services/common.service";
import {EventEmmiterService} from "../services/event-emmiter.service";
import { HttpClient } from '@angular/common/http';

declare var google;
@Component({
  selector: 'app-life-home',
  templateUrl: './life-home.component.html',
  styleUrls: ['./life-home.component.scss']
})
export class LifeHomeComponent implements OnInit {
  @Input() name;
  @ViewChild('placesRef', {static: false}) public searchElementRef: ElementRef;
  validatingForm: FormGroup;
  addressData: addressData = {};
  GooglePlace: boolean = true;
  showBuyHome: boolean = false;
  screen: number = 0;
  formatted_address: string;
  applicant_email_content: string;
  api_status: number;
  personData: personData[] = [{first_name: '', last_name: '', birthday: '',needlifeinsInput: ''}];
  phone: string;
  email: string;
  requestorcomments: string;
  IsChangeZollowInfo: boolean;
  quote_id: string;
  currentAgent: string;
  /*
  * Insurance Type: 1) Home, 2) Auto 3) Bundle
  * */
  agentInfo: object;
  staticAddress: string;
  zillowData: object = {value: '', square: '', built_year: '', estimate: ''};
  agent: object = {
    type: 'user',
    email: this.router.url.split('/')[1] == '' ? 'pete' : this.router.url.split('/')[1]
  };
  /*
  * Conditional Loaders
  * */
  zillowLoader: boolean = false;
  zillowDataFetched: boolean = false;;
  private urlHash = location.href.split('/')[3] || '';

  isMobile: boolean = false;
  latitude: string = "";
  longitude: string = "";
  isManualAddress: boolean = false;
  manualAddress: string = "";
  helththy: string = "";
  needlifeinsInputOption: object = [
    {value:'Yes',label:'Yes'},
    {value:'No',label:'No'},
    {value:'Dependent',label:'Dependent'}
  ];

  constructor(
    private router: Router,
    public apiService: ApiService,
    private __scrollToService: ScrollToService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private spinnerService: Ng4LoadingSpinnerService,
    private commonService: CommonService,
    private eventEmitterService: EventEmmiterService,
    private http: HttpClient
  ) {
    localStorage.setItem("total_data",null);
    this.checkAgent();
    this.screen = 1;
    this.loadGooglePlace();
    console.log("life home");
  }

  @HostListener('window:keydown', ['$event'])

  KeyDown(event: KeyboardEvent) {}

  @HostListener('window:resize', ['$event'])

  onResize(event) {}


  ngAfterViewInit(): void {
    // this.isMobile = window.innerWidth < 769;
  }

  ngOnInit() {
    this.quote_id = this.commonService.getQuoteID();
    this.commonService.applyTotalData('quote_id', this.quote_id);
  }

  showFirstPage(type) {
    this.loadGooglePlace()
  }

  toggleGooglePlace() {
    this.GooglePlace = !this.GooglePlace;
    this.zillowData = {};
    if (this.GooglePlace) this.loadGooglePlace();
  }

  displayZillowData(key) {
    if (this.GooglePlace) {
      return this.zillowDataFetched;
    }
    return Boolean(this.zillowData[key]);
  }

  loadGooglePlace() {
    this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
            types: ["address"], componentRestrictions: {country: 'USA'}
          });
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              let address = autocomplete.getPlace();
              this.formatted_address = address.formatted_address;
              this.handleAddressChange(address);
            })
          })
        });
      }
    });
  }

  handleAddressChange(address) {
    let addressData = address.address_components;
    this.latitude = address.geometry.location.lat();
    this.longitude = address.geometry.location.lng();
    this.commonService.applyTotalData('address_data', address);
    try {
      this.addressData['street_number'] = addressData.filter((elem) => {
        return elem['types'][0] == 'street_number'
      })[0]['short_name'];
      this.addressData['route'] = addressData.filter((elem) => {
        return elem['types'][0] == 'route'
      })[0]['long_name'];
      this.addressData['address'] = this.addressData['street_number'] + ' ' + this.addressData['route'];
      this.addressData['locality'] = addressData.filter((elem) => {
        return elem['types'][0] == 'locality'
      })[0]['long_name'];
      this.addressData['administrative_area_level_1'] = addressData.filter((elem) => {
        return elem['types'][0] == 'administrative_area_level_1'
      })[0]['short_name'];
      this.addressData['country'] = addressData.filter((elem) => {
        return elem['types'][0] == 'country'
      })[0]['long_name'];
      this.addressData['postal_code'] = addressData.filter((elem) => {
        return elem['types'][0] == 'postal_code'
      })[0]['short_name'];
      this.commonService.applyTotalData('addressData', this.addressData);

      const data = {
        address: this.addressData['address'],
        citystatezip: this.addressData['locality'] + ', ' + this.addressData['administrative_area_level_1'] + ', '
          + this.addressData['postal_code']
      };
      this.getZillowData(data);
      this.setAddrZillow();
      //this.nextbtn = true;
    } catch (e) {
      this.commonService.modalOpen('Error', 'Please enter the correct address type.');
    }
  }

  isDisplay() {
    return this.zillowData['square'] != '' &&
      this.zillowData['square'] != null &&
      this.zillowData['built_year'] != '' &&
      this.zillowData['built_year'] != null;
  }

  moveToPageTop() {
    setTimeout(function () {
      document.getElementById('scrollTop').scrollIntoView();
    })
  }

  setAddrZillow() {
    this.screen = 2;
    this.moveToPageTop()
  }

  getZillowData(data) {
    this.zillowLoader = true;
    this.zillowDataFetched = false;
    console.log(data);
    this.apiService.getZillow(data).subscribe(res => {
      this.zillowLoader = false;
      this.zillowDataFetched = true;
      if(!res.hasOwnProperty('price')) {
        this.zillowData = {};
        this.GooglePlace = false;
        return;
      } else {
        this.zillowData['value'] = res;
        const estimate = res.price
        this.zillowData['square'] = res.building_size;
        this.zillowData['built_year'] = res.year_built;
        this.zillowData['estimate'] = estimate != NaN ? this.commonService.commafy(estimate) : 0;
      }
      this.commonService.applyTotalData('zillowData', this.zillowData);
    }, (err) => {
      this.spinnerService.hide();
    });
  }

  nextscreenmove(screen){
    this.screen = screen;
    this.moveToPageTop();
    let obj = this;
    if(screen == 3){
      setTimeout(function(){
        obj.validatePersonForm();
      },2000);
    }

    if(screen == 5){
      // send submit mail
        const address = this.commonService.extractData('addressData');
        const personData =  this.commonService.extractData('personData');
        const curYear = (new Date()).getFullYear();
        const email = this.email;
        const phone = this.phone;
        const quote_id = this.commonService.extractData('quote_id');
        const requestorcomments = this.commonService.extractData('requestorcomments');
        const helththy = this.helththy;
        var data = {
          email:email,
          phone:phone,
          yearBuilt: typeof this.zillowData['built_year'] != "undefined" ? this.zillowData['built_year'] : '-',
          address, personData,
          sqft: typeof this.zillowData['square'] != "undefined" ? this.zillowData['square'] : '-',
          estimate: typeof this.zillowData['estimate'] != "undefined" ? this.zillowData['estimate'].replace(',', '') : '-',
          manualAddress: this.manualAddress,
          requestorcomments:requestorcomments,
          helththy:helththy,
          quote_id,
          curYear,
          agent:{
            'name':this.agentInfo['name'],
            'email':this.agentInfo['email'],
            'logo':this.agentInfo['logo'],
            'phone':this.agentInfo['phone'],
            'api_status':this.agentInfo['api_status'],
            'additional_email':this.agentInfo['additional_email'],
            'link':this.currentAgent,
            'spreadsheet_id': this.agentInfo['spreadsheet_id'],
            'life_app_sheet_id': this.agentInfo['life_app_sheet_id']
          },
          applicant_email_content:this.applicant_email_content,
        };

        // For send mail.
        this.apiService.sendLifeFormEmail(data).subscribe(lifeformmail => {
          console.log('life form email', lifeformmail);
        });
    }
  }


  checkAgent(){
    this.http.get('assets/agents.csv', {responseType: 'text'})
    .subscribe(
      data => {
        let csvToRowArray = data.split("\n");
        for (let index = 1; index < csvToRowArray.length; index++) {
          let row = csvToRowArray[index].split(",");
          this.currentAgent = this.router.url.split('/')[1] != "life" ? this.router.url.split('/')[1] : this.router.url.split('/')[2];

          let cagent = this.currentAgent.split("?");
          if(cagent.length > 1){
            this.currentAgent = cagent[0].toString();
          }


          if(row[0].trim() == this.currentAgent){
            let userArr = [];
            userArr['email'] = row[1];
            userArr['additional_email'] = row[2];
            userArr['name'] = row[3];
            userArr['logo'] = row[4];
            userArr['phone'] = row[5];
            row[6] = row[6].toLowerCase();
            userArr['api_status'] = row[6];
            this.api_status = row[6].localeCompare("yes");

            if(row[7].trim() != ''){
              this.applicant_email_content = row[7];
            }else{
              this.applicant_email_content = 'Thank you for your requesting a quote! <br> We will run your quote and get back to you shortly! <br> Our partner companies include Progressive, <br> NationWide , MetLife, Travelers and more. <br> There is never a fee for our service. <br> Feel free to reach out our agency at anytime';
            }

            if(row[8].trim() != ''){
              userArr['favicon'] = row[8];
            }else{
              userArr['favicon'] = '';
            }

            if(row[10].trim() != ''){
              userArr['agent_image'] = row[10];
            }else{
              userArr['agent_image'] = '';
            }

            if(row[11].trim() != ''){
              userArr['spreadsheet_id'] = row[11];
            }else{
              userArr['spreadsheet_id'] = '';
            }

            if(row[13].trim() != ''){
              userArr['life_app_sheet_id'] = row[13];
            }else{
              userArr['life_app_sheet_id'] = '';
            }

            let arr = [];
            arr[row[0]] = userArr;
            configs['agentsInfo'] =arr;
            this.agentInfo = userArr;
            let path = "/assets/favicon/"+userArr['favicon'];
            this.setFaviconIcon(path);
          }
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  changeSource(event) {
    this.agentInfo['logo'] = '../../assets/images/agents/dummy.png';
  }

  sumArray(arr) {
    var total = 0;
    arr.forEach(function(element){
        total += element;
    })
    return total;
  }

  manualAddressSave(){
    this.manualAddress = this.staticAddress;
    this.IsChangeZollowInfo = true;
    this.zillowData = {};
    this.GooglePlace = false;
    this.zillowDataFetched = true;
    this.nextscreenmove(2);
  }

  helththyselection(value){
    this.helththy = value;
    this.nextscreenmove(3);
  }

  /* for personal information form */
  showDiscounts() {
    if (!this.validatingForm.valid) {
      this.commonService.modalOpen('Warning', 'Please enter all required fields.');
      return;
    }
    this.moveToPageTop();
    this.commonService.applyTotalData('personData', this.personData);
    this.nextscreenmove(4);
  }


  validatePersonForm() {
    let formData = {
      "emailInput": new FormControl(this.email, [Validators.required,Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl(this.phone, [Validators.required, Validators.pattern("^[+0-9 \\-]{10,13}$")]),
    };
    for (let i = 0; i < this.personData.length; i++) {
      formData['firstnameInput' + i] = new FormControl(this.personData[i]['first_name'],Validators.required);
      formData['lastnameInput' + i] = new FormControl(this.personData[i]['last_name'],Validators.required);
      formData['birthdayInput' + i] = new FormControl(this.personData[i]['birthday'],Validators.required);
      formData['needlifeinsInput' + i] = new FormControl(this.personData[i]['needlifeinsInput'],Validators.required);
    }
    this.validatingForm = new FormGroup(formData);
  }

  addPerson() {
    if (this.personData.length < 5) {
      this.personData[this.personData.length] = {first_name: '', last_name: '', birthday: '',needlifeinsInput: ''};
    }
    this.validatePersonForm();
  };

  deletePerson(key) {
    this.personData.splice(key, 1);
    this.validatePersonForm();
  }

  get emailInput() {
    return this.validatingForm.get('emailInput');
  }

  get phoneInput() {
    return this.validatingForm.get('phoneInput');
  }
  /* End personal information form */

  setRequestOrComments(){
    this.commonService.applyTotalData('requestorcomments', this.requestorcomments);
    this.nextscreenmove(5);
  }

  setFaviconIcon(path: string) {
    var url = path.toString();
    var request = new XMLHttpRequest();
    request.open('HEAD', url, false);
    request.send();
    if(request.status == 200) {
      document.getElementById('favicon').setAttribute('href',url);
      document.getElementById('iphone_favicon').setAttribute('content',"https://apply.insure"+url);
    }else{
      document.getElementById('favicon').setAttribute('href','/assets/images/logo.png');
      document.getElementById('iphone_favicon').setAttribute('content','https://apply.insure/assets/images/logo.png');
    }
  }

  checkdob(event){
    if(event.target.value == ""){
      const parentElement = document.getElementById('datepicker');
      const firstChild = parentElement.children[0];
      firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-valid-input');
      firstChild.classList.add('e-error');
    }else{
      const parentElement = document.getElementById('datepicker');
      const firstChild = parentElement.children[0];
      firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-success');
    }
  }
}

export interface addressData {
  street_number?: string;
  route?: string;
  address?: string;
  locality?: string;
  administrative_area_level_1?: string;
  country?: string;
  postal_code?: string;
}

export interface personData {
  first_name: string;
  last_name: string;
  birthday: string;
  needlifeinsInput: string;
}
