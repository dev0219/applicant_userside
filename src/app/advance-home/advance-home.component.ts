import {AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from "../api-service";
import {Router} from "@angular/router";
import {addressData, carData, personData, questionsData} from "./models";
import {MapsAPILoader} from "@agm/core";
import {Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import {ScrollToService} from '@nicky-lenaers/ngx-scroll-to';
import * as configs from "../config/config";
import {CommonService} from "../services/common.service";
import {EventEmmiterService} from "../services/event-emmiter.service";
import { HttpClient } from '@angular/common/http';
import { DatePickerComponent, FocusEventArgs } from '@syncfusion/ej2-angular-calendars';
// import { ConsoleReporter } from 'jasmine';

declare var google;
@Component({
  selector: 'app-advance-home',
  templateUrl: './advance-home.component.html',
  styleUrls: ['./advance-home.component.scss'],
  providers: [ScrollToService]
})
export class AdvanceHomeComponent implements OnInit, AfterViewInit {

  /* 
  @ViewChild('default',{static:false})
  public datepickerObj : DatePickerComponent;

  onFocus(args: FocusEventArgs): void {
    this.datepickerObj.show();
  } */


  @Input() name;
  @ViewChild('placesRef', {static: false}) public searchElementRef: ElementRef;
  @ViewChild('placesRef1', {static: false}) public searchElementRef1: ElementRef;
  validatingForm: FormGroup;
  ContactInfoForm: FormGroup;
  AccurateQuoteForm: FormGroup;
  addressData: addressData = {};
  GooglePlace: boolean = true;
  showBuyHome: boolean = false;
  isValidform:boolean=false;
  step: number = 0;
  screen: number = 0;
  formatted_address: string;
  // if roof_shape is set to true, roof is peaked. otherwise flat.
  public discountsData = {
    basement_finished:'',
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
    basement_status:'',
  };
  public propertyData = {};

  public applicant_email_content = '';

  public questionsData: questionsData = {};
  /*
  * Insurance Type: 1) Home, 2) Auto 3) Bundle
  * */
  current_auto_premium: any;
  progress: number =0;
  insuranceType: number = 1;
  addLicense: boolean = false;
  comment: string;
  modalContentMargin: number;
  agentInfo: object;
  life_array = configs.life_array;
  autobeat: string;
  homebeat: string;
  notes: string;
  quote_central: boolean;
  referral_source: string;
  settlement: string;
  email: string;
  phone: string;
  curretMailingAddress:string;
  staticAddress: string;
  healthStatus: number = 3;
  life_val: number;
  healthText: object = ['Below Avg Health', 'Healthy', 'Superior Health', 'Select'];
  isshowdiscounts: boolean = false;
  zillowData: object = {value: '', square: '', built_year: '', estimate: ''};
  personData: personData[] = [{first_name: '', last_name: '', birthday: '', license: ''}];
  carData: carData[] = [{year: '', type: '', model: ''}];
  insuranceTypeData: any;
  goodPrice: string;
  enhancedPrice: string;
  showPricing: boolean = false;
  isShowSpecificPage: boolean = false;
  isBgShow: boolean = true;
  agent: object = {
    type: 'user',
    email: this.router.url.split('/')[1] == '' ? 'pete' : this.router.url.split('/')[1]
  };
  quote_id: string;
  isPage6: boolean = false;
  isPage7: boolean = false;
  isPage5: boolean = false;
  isPage8: boolean = false;
  isPage9: boolean = false;
  isPage10: boolean = false;
  isAPIFetched: boolean = false;
  /*
  * Conditional Loaders
  * */
  zillowLoader: boolean = false;
  zillowDataFetched: boolean = false;
  showImg: boolean = false;
  progrss: number = 0;
  IsChangeZollowInfo: boolean = false;
  private urlHash = location.href.split('/')[3] || '';

  isMobile: boolean = false;
  nextbtn: boolean = true;
  latitude: string = "";
  longitude: string = "";
  requestorcomments: string;
  waitingtxt: string = "Please wait few second for api response";
  waitingtxtflag = 0;
  monthlycost = 0;
  ethoslink = 0;
  hippo_premium = 0;
  hippo_link = "";
  priceArr = [];
  formData:any = {};
  neptuneFoodZone = "X";
  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  api_status = -1;
  pageSixCustomQuestion;
  pageFiveCustomQuestion;
  isManualAddress: boolean = false;
  manualAddress: string = "";
  agentlink: string = "";
  selectedUserType: string = "";
  QutoFiles: any;
  OtherlineOfBusiness: string[] = [];
  eightPlusPerson: number = 0;
  eightPlusPersonName: string[] = [];
  eightPlusHiddenDL: string[] = [];
  accurateQuoteSuccessMsg: string = "";
  OtherBusinessSuccessMsg: string = "";
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

    this.checkAgent();
    this.step = 1;
    this.screen = 0;
    this.nextbtn = false;

    this.priceArr['prices'] = [];
    this.priceArr['totalprices'] = 0;
    console.log("advanace home");
  }

  @HostListener('window:keydown', ['$event'])

  KeyDown(event: KeyboardEvent) {
    /* if (event.shiftKey && event.code == 'Digit3') {
      event.preventDefault();
      this.agent['type'] = 'agent';
      if (this.step > 0) {
        this.isShowSpecificPage = !this.isShowSpecificPage;
      }
    } */
  }

  @HostListener('window:resize', ['$event'])

  onResize(event) {
    /* this.modalContentMargin = ((event.target.innerWidth - 500)) / 2;
    if (event.target.innerWidth < 992) {
      this.modalContentMargin = (event.target.width - 300) / 2;
    }
    this.isMobile = window.innerWidth < 769;
    if (event.target.innerWidth < 769) {
      this.isBgShow = false;
    } else {
      this.isBgShow = true;
    } */
  }


  ngAfterViewInit(): void {
    // this.isMobile = window.innerWidth < 769;
  }

  ngOnInit() {
    this.loadGooglePlace();
    // this.sendAPIRequest();
    this.quote_id = this.commonService.getQuoteID();
    this.commonService.clearValues();
    this.eventEmitterService.toggleNav(false);
    this.modalContentMargin = (window.innerWidth - 500) / 2;
    if (window.innerWidth < 992) {
      this.modalContentMargin = (window.innerWidth - 300) / 2;
    }
   
    this.validateContactInfoForm();
    this.validatePersonForm();
    if (window.innerWidth < 769) {
      return this.isBgShow = false;
    }
    this.isBgShow = true;
    this.commonService.applyTotalData('quote_id', this.quote_id);
  }

  showFirstPage(type) {
    if (type == 1 || type == 3) {
      this.showBuyHome = true;
      this.step = -1;
    } else {
      this.step = 1;
      this.loadGooglePlace()
    }
    this.insuranceType = type;
    this.quote_id = this.commonService.getQuoteID();
    this.commonService.applyTotalData('quote_id', this.quote_id);
    this.commonService.applyTotalData('type', type);
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

  setHomeData($event) {
    this.insuranceTypeData = $event;
    this.commonService.applyTotalData('insuranceType_data', this.insuranceTypeData);
    this.showBuyHome = false;
    if (this.insuranceType == 2){
      this.step = 2;
    } else {
      this.nextscreenmove(1);
      this.loadGooglePlace()
      this.step = 1;
    }
  }

  setCarData($event) {
    this.carData = $event;

    let formData = {};
    for (let i = 0; i < this.eightPlusPerson; i++) {
      formData['DLName' + i] = new FormControl(this.eightPlusHiddenDL[i], Validators.required);
    }
    for (let i = 0; i < this.carData.length; i++) {     
      formData['CARVIN' + i] = new FormControl("", Validators.required);
    }
    this.AccurateQuoteForm = new FormGroup(formData);

    this.commonService.applyTotalData('carData', this.carData);
    if(this.waitingtxt != "" && this.api_status != -1){

      this.initStep3();
      this.isPage9 = true;
      this.nextscreenmove(8);
      this.waitingtxtflag = 1;
      setTimeout(() => window.scrollTo(0, 0));
    }else{
      this.waitingtxtflag = 0;
      this.nextscreenmove(9);
    }
  }

  setDiscountData($event){
    this.discountsData = $event.discountsData;
    this.pageFiveCustomQuestion = $event.pageFiveCustomQuestion;
    this.initStep3();
    this.nextscreenmove(4);
    this.progrss = 50;
    //this.isPage6 = true;
    this.commonService.applyTotalData('discountsData', this.discountsData);
  }

  setPropertyData($event) {
    this.propertyData = $event.propertyData;
    this.pageSixCustomQuestion = $event.pageSixCustomQuestion;
    this.initStep3();

    // If API status is yes.
    this.nextscreenmove(5);
    this.progrss = 50;

    // If API status is no.
    this.isPage6 = true;
    if(this.api_status == -1){
      this.waitingtxt = "";
      this.waitingtxtflag = 0;
    }
    this.commonService.applyTotalData('propertyData', this.propertyData);
  }

  initStep3() {
    this.isPage5 = false;
    this.isPage6 = false;
    this.isPage7 = false;
    this.isPage8 = false;
    this.isPage9 = false;
    this.isPage10 = false;
  }

  setQuestions($event) {
    this.questionsData = $event;
    this.initStep3();
    this.isPage9 = true;
    window.scrollTo(0, 0);

  }

  setDetailData() {
    this.commonService.applyTotalData('GooglePlace', this.GooglePlace);
    if (this.isShowSpecificPage) {
      this.sendAPIRequest();
      this.spinnerService.show();
      setTimeout(() => {
        this.financialCheck();
        this.spinnerService.hide();
      }, 30000);
      return;
    }
    this.financialCheck();
  }
  loadGooglePlaceForAddress(){
      this.mapsAPILoader.load().then(() => {
      if (this.GooglePlace) {
        setTimeout(() => {
          let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef1.nativeElement, {
            types: ["address"], componentRestrictions: {country: 'USA'}
          });
          autocomplete.addListener("place_changed", () => {
            this.ngZone.run(() => {
              let address = autocomplete.getPlace();
              this.formatted_address = address.formatted_address;
              this.handleAddressChangeeventforStepsix(address);
            })
          })
        });
      }
    });
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

  validatePersonForm() {
    let formData = {};
    for (let i = 0; i < this.personData.length; i++) {
      formData['firstnameInput' + i] = new FormControl(this.personData[i]['first_name'], Validators.required);
      formData['lastnameInput' + i] = new FormControl(this.personData[i]['last_name'], Validators.required);
      formData['birthdayInput' + i] = new FormControl(this.personData[i]['birthday'], Validators.required);
      formData['licenseInput' + i] = new FormControl(this.personData[i]['license'], []);
     
    }
    this.validatingForm = new FormGroup(formData);
  }

  validateContactInfoForm()
  {
    let formData = {
      "emailInput": new FormControl(this.email, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl(this.phone, [Validators.required, Validators.pattern("^[+0-9 \\-]{10,13}$")]),
      "addressInput": new FormControl(this.curretMailingAddress, [Validators.required]),
    };
    this.ContactInfoForm = new FormGroup(formData);
  }

  get emailInput() {
    return this.ContactInfoForm.get('emailInput');
  }
 get addressInput(){
  return this.ContactInfoForm.get('addressInput');
 }
  get phoneInput() {
    return this.ContactInfoForm.get('phoneInput');
  }
  handleAddressChangeeventforStepsix(address){
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
      console.log("this.addressData")
      const data = {
        address: this.addressData['address'],
        citystatezip: this.addressData['locality'] + ', ' + this.addressData['administrative_area_level_1'] + ', '
          + this.addressData['postal_code']
      };
      this.getZillowData(data);
    //  this.setAddrZillow();
      //this.nextbtn = true;
    } catch (e) {
      this.commonService.modalOpen('Error', 'Please enter the correct address type.');
    }
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
      console.log("this.addressData",this.addressData)
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

  initSecretForm() {
    this.agent['type'] = 'user';
    this.settlement = '';
    this.homebeat = '';
    this.autobeat = '';
    this.notes = '';
    this.referral_source = '';
    this.quote_central = false;
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
    this.progrss = 10;
    this.moveToPageTop()
    setTimeout(() => {
      this.loadmap()
    }, 500);
  }

  getZillowData(data) {
    this.zillowLoader = true;
    this.showImg = true;
    this.zillowDataFetched = false;

    this.apiService.getZillow(data).subscribe(res => {
      this.zillowLoader = false;
      this.zillowDataFetched = true;
      if(!res.hasOwnProperty('price')) {
        //  if (res['message']['code'] != 0) {
        this.zillowData = {};
        this.GooglePlace = false;
        this.changePropertyDetail();
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
      this.zillowLoader = false;
      this.spinnerService.hide();
    });
  }

  addPerson() {
    if (this.personData.length < 5) {
      this.personData[this.personData.length] = {first_name: '',last_name: '',birthday: '',license: ''};
    }
    this.validatePersonForm();
  };

  deletePerson(key) {
    this.personData.splice(key, 1);
    this.validatePersonForm();
  }
  saveContactInfo()
  {
    if (!this.ContactInfoForm.valid) {
      this.commonService.modalOpen('Warning', 'Please enter all required fields.');
      return;
    }
    this.commonService.applyTotalData('email', this.email);
    this.commonService.applyTotalData('phone', this.phone);
    this.commonService.applyTotalData('currentAddress', localStorage.getItem('manualAddress'));    
    this.commonService.applyTotalData('curretMailingAddress', this.curretMailingAddress);    
    this.nextscreenmove(6);
  }
  showDiscounts() {
    if (!this.validatingForm.valid) {
      this.isshowdiscounts = false;
      this.commonService.modalOpen('Warning', 'Please enter all required fields.');
      return;
    }
    this.isshowdiscounts = true;
    this.initSecretForm();
    this.moveToPageTop();
    //this.step = 3;
    this.isPage6 = true;
    /* this.personData.forEach(item => {
      let dob = new Date(item['birthday']);
      item.birthday = dob.getDate()+'/'+(dob.getMonth() + 1)+'/'+dob.getFullYear();
    }); */
    
    this.personData.forEach(item => {
      let dob = new Date(item['birthday']);
      var day = dob.getDate();
      var month = (dob.getMonth() + 1);
      var year = dob.getFullYear();
      var age = 18;
      var setDate = new Date(year + age, month - 1, day);
      var currdate = new Date();

      if (currdate >= setDate){
        this.eightPlusPersonName.push(item['first_name']+" "+item['last_name']);
        this.eightPlusPerson++;
        if(item['license'].trim() == ""){
          this.eightPlusHiddenDL.push("");
        }else{
          this.eightPlusHiddenDL.push(item['license'].trim());
        }
      } 
    });
    
    this.commonService.applyTotalData('personData', this.personData);
    this.nextscreenmove(7);
  }

  setInsurnaceType(value) {
    //this.insuranceType = value;
    this.commonService.applyTotalData('carrier_type', value);
    this.initStep3();
    //this.isPage7 = true;
    this.nextscreenmove(8);
  }

  sendEmail(type) {
    console.log("address",this.commonService.extractData('addressData'))
    const apiData = this.commonService.getPricing(), addressData = this.commonService.extractData('addressData');
    let address = addressData['address'],
   
      city = addressData['locality'],
      state = addressData['administrative_area_level_1'], zip = addressData['postal_code'],
      persons = JSON.stringify(this.commonService.extractData('personData')),
      agent = this.agent,
      basicPrice = this.commonService.commafy(apiData['lowest_price']),
      enhancedPrice = this.commonService.commafy(apiData['highest_price']),
      goodPrice = this.commonService.commafy(apiData['medium_price']);
    let body = {address, zip, state, city, persons, type, agent, goodPrice, enhancedPrice, basicPrice};
    this.apiService.sendEmail(body).subscribe(res => {
    }, (err) => {
    });
  }

  financialCheck() {
    this.showPricing = true;
    const apiData = this.commonService.getPricing(),
      link = location.href.split('/').pop(),
      basicPrice = this.commonService.commafy(apiData['lowest_price']),
      enhancedPrice = this.commonService.commafy(apiData['highest_price']),
      goodPrice = this.commonService.commafy(apiData['medium_price']);
    this.commonService.applyTotalData('basicPrice', basicPrice);
    this.commonService.applyTotalData('enhancedPrice', enhancedPrice);
    this.commonService.applyTotalData('goodPrice', goodPrice);
    this.commonService.applyTotalData('addLicense', this.addLicense);
    this.commonService.applyTotalData('agent', this.agent);
    this.commonService.applyTotalData('quote_id', this.quote_id);
    this.commonService.applyTotalData('link', link);
    let havenLifePricing;
    try{
      const api_data = this.commonService.getItem('api_data');
      havenLifePricing = api_data.havenlife.quotes[0].monthlyRate;
    }catch (e) {
      havenLifePricing = 33;
    }
    this.commonService.applyTotalData('havenLifePricing', Math.round(havenLifePricing));
    const total_data = this.commonService.getItem('total_data');
    this.apiService.sendLifeEmail(total_data).subscribe(res => {
      this.isShowSpecificPage = false;
      this.step = 4;
      this.isPage9 = false;
      this.isPage10 = true;
      this.initSecretForm();
      this.moveToPageTop();
    }, (err) => {
    });
  }

  sendAPIRequest() {
    this.eventEmitterService.toggleAPIDataStatus(false);
    const zillowData = this.commonService.extractData('zillowData');
    const address = this.commonService.extractData('addressData');
    const personData = this.commonService.extractData('personData');
    const carData = this.commonService.extractData('carData');
    const curYear = (new Date()).getFullYear();
    const yearData = {
      ac_year: curYear,
      electric_year: curYear,
      plumbing_year: curYear,
      roof_year: curYear
    };
    const isMailingSameAsProperty = this.commonService.extractData('isMailingSameAsProperty');
    const email = this.commonService.extractData('email');
    const phone = this.commonService.extractData('phone');
    const addres = this.commonService.extractData('currentAddress');
    const curretMailingAddress = this.commonService.extractData('curretMailingAddress');
    

    var estimate = 0;
    if(zillowData.estimate != 0){
      estimate = typeof zillowData.estimate != 'undefined' ? zillowData.estimate.toString().replace(',', '') : 0;
    }

    const data = {
      email, phone,addres,curretMailingAddress,
      yearBuilt: zillowData.built_year,
      address, personData, carData,
      isMailingSameAsProperty,
      ac_year: yearData.ac_year,
      electric_year: yearData.electric_year,
      plumbing_year: yearData.plumbing_year,
      roof_year: yearData.roof_year,
      sqft: zillowData.square,
      estimate: estimate,
      mailing_address: address,
      roof_status: 'peaked',
      is_basement: true,
      building_type: 1,
      foundation_type: 1,
      exterior_type: 1,
      construction_type: 1,
      roof_type: 1
    };
    if(this.agentInfo['plymouth_api'] != -1){
      this.apiService.getPlymouth(data).subscribe(response => {
        this.commonService.setAPIData('plymouth', response);
        if(typeof response['best'] != "undefined"){
          this.priceArr['prices'].push(parseInt(response['best']['pricing']) * 12);
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;

          this.priceArr['prices'].push(parseInt(response['better']['pricing']) * 12);
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;

          this.priceArr['prices'].push(parseInt(response['good']['pricing']) * 12);
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;

          this.priceArr['prices'].sort(function(a, b){return a - b});
          console.log('Prices',this.priceArr['prices']);
        }
      });
    }

    if(this.agentInfo['universal_api'] != -1){
      this.apiService.getUniversal(data).subscribe(universal => {
        this.commonService.setAPIData('universal', universal);
        console.log('universal', universal);

        if(typeof universal['QuoteWrapper']['Premium'] != "undefined"){
          this.priceArr['prices'].push(parseInt(universal['QuoteWrapper']['Premium']));
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;
        }
        if(this.api_status != -1){
          this.waitingtxt = "";
          this.waitingtxtflag = 0;
        }
      },error => {
        if(this.api_status != -1){
          this.waitingtxt = "";
          this.waitingtxtflag = 0;
        }
      });
    }

    if(this.agentInfo['stillwater_api'] != -1){
      this.apiService.getStillWater(data).subscribe(stillwater => {
        let stillwaterprice = typeof stillwater['ACORD'] != "undefined" && typeof stillwater['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs'] != "undefined" &&
         typeof stillwater['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']  != "undefined" &&
         typeof stillwater['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt'] != "undefined" ? parseInt(stillwater['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt']) : 0;
        this.priceArr['prices'].push(stillwaterprice);
        this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;
        this.commonService.setAPIData('stillwater', stillwater);
        console.log('stillwater', stillwater);
      });
    }

    if(this.agentInfo['neptuneflood_api'] != -1){
      this.apiService.getNeptuneFlood(data).subscribe(neptuneflood => {
        this.commonService.setAPIData('neptuneflood', neptuneflood);
        console.log('neptuneflood', neptuneflood);
        // this.priceArr['prices'].push(parseInt(neptuneflood['data']['premium']));
        this.neptuneFoodZone = neptuneflood['data']['zone'];
        console.log("Neptune Food Zone", this.neptuneFoodZone)
      });
    }

    if(this.agentInfo['havenlife_api'] != -1){
      this.apiService.getHavenLife(data).subscribe(havenlife => {
        this.commonService.setAPIData('havenlife', havenlife);
        console.log('havenlife', havenlife);

        if(typeof havenlife['quotes'] != "undefined"){
          this.priceArr['prices'].push(parseInt(havenlife['quotes'][0]['monthlyRate']));
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;
        }
      });
    }

    if(this.agentInfo['ethoslife_api'] != -1){
      this.apiService.getEthoslife(data).subscribe(ethoslife => {
        console.log('ethoslife', ethoslife);
        delete ethoslife['profile'];
        if(typeof ethoslife['policies'] != "undefined"){
          for (let index = 0; index < ethoslife['policies'].length; index++) {
            if(parseInt(ethoslife['policies'][index]['coverage']) == 500000){
              this.monthlycost = parseInt(ethoslife['policies'][index]['monthly']);
              this.ethoslink = ethoslife['policies'][index]['url'];
              //this.priceArr['prices'].push(this.monthlycost);
              //this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;

              // Ethoslife api success mail to agent.
              /* let mailData = {cost:this.monthlycost,link:this.ethoslink,agentEmail:this.agentInfo['email'],address:this.commonService.extractData('addressData'), manualAddress: this.manualAddress};
              this.apiService.sendEthosLifeMail(mailData).subscribe(ethoslife => {
                console.log("Ethos mail sent successfully.");
              }); */
            }
          }
        }
        delete ethoslife['profile'];
        delete ethoslife['policies'];
        this.commonService.setAPIData('ethoslife', this.monthlycost);
      });
    }

    if(this.agentInfo['hippo_api'] != -1){
      this.apiService.getHippo(data).subscribe(hippo => {
        console.log('hippo', hippo);
        this.commonService.setAPIData('hippo', hippo);
        let data = JSON.parse(hippo['data'])


        if(typeof data['quote_premium'] != "undefined"){
          this.priceArr['prices'].push(parseInt(data['quote_premium']));
          this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;
      this.hippo_premium = data['quote_premium'];
        }else{
      this.hippo_premium = 0;
      }
        this.hippo_link = data['quote_url'];
      });
    }

    if(
      this.agentInfo['plymouth_api'] == -1 &&
      this.agentInfo['universal_api'] == -1 &&
      this.agentInfo['stillwater_api'] == -1 &&
      this.agentInfo['neptuneflood_api'] == -1 &&
      this.agentInfo['havenlife_api'] == -1 &&
      this.agentInfo['ethoslife_api'] == -1 &&
      this.agentInfo['hippo_api'] == -1
    ){
      if(this.api_status != -1){
        this.waitingtxt = "";
        this.waitingtxtflag = 0;
      }
    }else{
      setTimeout(function(that){
        console.log(that.api_status);
        if(that.api_status != -1){
          that.waitingtxt = "";
          that.waitingtxtflag = 0;
        }
      },7000,this);
    }
  }

  loadmap(){
    // The location of Uluru
    const uluru = { lat: this.latitude, lng: this.longitude };
    // For initialize map
    const map = new google.maps.Map(document.getElementById("mtsmap"),
      {
        zoom: 12,
        center: uluru,
        disableDefaultUI: true,
        scaleControl: false,
        draggable:false
      }
    );

    // For set marker
    const marker = new google.maps.Marker({
      position: uluru,
      map: map,
    });
  }

  usertypeselect(usertype){
    this.selectedUserType = usertype;    
  }

  usertypeselection(screen,usertype){
    this.selectedUserType = usertype;
    console.log("Zillow info",this.zillowData['built_year'] == "" || this.zillowData['square'] == "");
    if((typeof this.zillowData['square'] === "undefined" || typeof this.zillowData['built_year'] === "undefined") || (this.zillowData['square'] == "" || this.zillowData['built_year'] == "" || this.zillowData['square'] == null || this.zillowData['built_year'] == null)){
      this.commonService.modalOpen('Error', 'Please enter proper built year & square feet size and save it !!');
      return;
    }
    if(this.selectedUserType != ""){
      if(usertype == "I rent this home"){
        screen = 5;
        this.progrss = 50;
        this.commonService.applyTotalData('hometype', '');
        this.commonService.applyTotalData('discountsData', this.discountsData);
        this.propertyData = {
          term_rental: false,
          property_own: false,
          multiple_unit: false,
          insurance_claims: false,
          policy_renewed: false,
          swimming_pool: false,
          swimming_type:{
            diving_board:false,
            slide:false,
            above_ground:false,
          }
        };
        this.commonService.applyTotalData('propertyData', this.propertyData);
        this.pageFiveCustomQuestion = [];
        this.pageSixCustomQuestion = [];
      }
      this.nextscreenmove(screen);
    }else{
      this.commonService.modalOpen('Error', 'Please select owner type !!');
      return;
    }
  }

  hometypeselection(screen,hometype){
    this.commonService.applyTotalData('hometype', hometype);
    this.nextscreenmove(screen);
  }

  nextscreenmove(screen){
    if(screen == 7 && this.api_status != -1){
      this.sendAPIRequest();
    }
    if(screen == 3 && (typeof this.zillowData['square'] === "undefined" || typeof this.zillowData['built_year'] === "undefined")){
      this.commonService.modalOpen('Error', 'Please enter square size and built year !');
      return;
    }else if(screen == 3 && (this.zillowData['square'] == "" || this.zillowData['built_year'] == "" || this.zillowData['square'] == null || this.zillowData['built_year'] == null)){
      this.commonService.modalOpen('Error', 'Please enter square size and built year !');
      return;
    }
    else if(screen == 12){
        this.priceArr['prices'].sort(function(a, b){return a - b});
        this.eventEmitterService.toggleAPIDataStatus(false);
        this.docUpload();
        /*const zillowData = this.commonService.extractData('zillowData');
        const address = this.commonService.extractData('addressData');

        const personData =  this.commonService.extractData('personData');

        const carData = this.commonService.extractData('carData');

        const curYear = (new Date()).getFullYear();
        const yearData = {
          ac_year: curYear,
          electric_year: curYear,
          plumbing_year: curYear,
          roof_year: curYear
        };
        const isMailingSameAsProperty = this.commonService.extractData('isMailingSameAsProperty');
        const email = this.commonService.extractData('email');
        const phone = this.commonService.extractData('phone');
        const quote_id = this.commonService.extractData('quote_id');
        const carrier_type = this.commonService.extractData('carrier_type');
        const insurence_want = this.commonService.extractData('insurence_want');
        const requestorcomments = this.commonService.extractData('requestorcomments');
        let api_data = this.commonService.getItem('api_data');
        let discount_data = this.commonService.extractData("discountsData");
        let propertyData = this.commonService.extractData("propertyData");
        const hometype = this.commonService.extractData("hometype");

        var estimate = '-';
        if(this.zillowData['estimate'] != 0){
          estimate = typeof this.zillowData['estimate'] != 'undefined' ? this.zillowData['estimate'].toString().replace(',', '') : '-';
        }

        var data = {
            email, phone,quote_id,carrier_type,insurence_want,requestorcomments,hometype,
            yearBuilt: typeof this.zillowData['built_year'] != "undefined" ? this.zillowData['built_year'] : '-',
            address, personData, carData,propertyData,
            isMailingSameAsProperty,
            ac_year: yearData.ac_year,
            electric_year: yearData.electric_year,
            plumbing_year: yearData.plumbing_year,
            roof_year: yearData.roof_year,
            sqft: typeof this.zillowData['square'] != "undefined" ? this.zillowData['square'] : '-',
            estimate: estimate,
            mailing_address: address,
            roof_status: 'peaked',
            is_basement: true,
            building_type: 1,
            foundation_type: 1,
            exterior_type: 1,
            construction_type: 1,
            roof_type: 1,
            applicant_email_content:this.applicant_email_content,
            pageFiveCustomQuestion:this.pageFiveCustomQuestion,
            pageSixCustomQuestion:this.pageSixCustomQuestion,
            api_status: this.api_status,
            manualAddress: this.manualAddress,
            selectedUserType: this.selectedUserType,
            agent:{
              'name':this.agentInfo['name'],
              'email':this.agentInfo['email'],
              'logo':this.agentInfo['logo'],
              'phone':this.agentInfo['phone'],
              'api_status':this.agentInfo['api_status'],
              'additional_email':this.agentInfo['additional_email'],
              'link':this.agentlink,
              'spreadsheet_id': this.agentInfo['spreadsheet_id'],
              'full_app_sheet_id': this.agentInfo['full_app_sheet_id']
            },
            'plymouth_best': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['best']['pricing'] : '-',
            'plymouth_better': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1  && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['better']['pricing'] : '-',
            'plymouth_good': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['good']['pricing'] : '-',
            'stillwater':this.api_status != -1 && this.agentInfo['stillwater_api'] != -1 && typeof api_data['stillwater'] != "undefined" && typeof api_data['stillwater']['ACORD']  != "undefined" && typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs'] != "undefined" &&
            typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']  != "undefined" &&
            typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt'] != "undefined" ? api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'] : '-',
            'universal': this.api_status != -1 && this.agentInfo['universal_api'] != -1 && typeof api_data['universal'] != "undefined" && typeof api_data['universal']['QuoteWrapper'] != "undefined" ? api_data['universal']['QuoteWrapper']['Premium'] : '-',
            'neptuneflood': this.api_status != -1 && this.agentInfo['neptuneflood_api'] != -1 && typeof api_data['neptuneflood'] != "undefined"  &&  typeof api_data['neptuneflood']['data'] != "undefined" ? api_data['neptuneflood']['data']['premium'] : '-',
            'havenlife': this.api_status != -1 && this.agentInfo['havenlife_api'] != -1 && typeof api_data['havenlife'] != "undefined" && typeof api_data['havenlife']['quotes'] != "undefined" ? api_data['havenlife']['quotes'][0]['monthlyRate'] : '-',
            'ethoslife': this.api_status != -1 && this.agentInfo['ethoslife_api'] != -1 && this.monthlycost != 0 ? this.monthlycost : '-',
            'hippo': this.api_status != -1 && this.agentInfo['hippo_api'] != -1 && this.hippo_premium != 0 ? this.hippo_premium : '-',
            'discountsData':{
              'roof_shape': typeof discount_data != "undefined" && typeof discount_data.roof_shape != "undefined" ? discount_data.roof_shape : '-',
              'dog': typeof discount_data != "undefined" && typeof discount_data.dog != "undefined" ? discount_data.dog : '-',
              'security_system': typeof discount_data != "undefined" && typeof discount_data.security_system != "undefined" ? discount_data.security_system : '-',
              'claim_free': typeof discount_data != "undefined" && typeof discount_data.claim_free != "undefined" ? discount_data.claim_free : '-',
              'roof_type': typeof discount_data != "undefined" && typeof discount_data.roof_type != "undefined" ? discount_data.roof_type : '-',
              'foundation': typeof discount_data != "undefined" && typeof discount_data.foundation != "undefined" ? discount_data.foundation : '-',
              'dog_desc': typeof discount_data != "undefined" && typeof discount_data.dog_desc != "undefined" ? discount_data.dog_desc : '-',
              'basement_status': typeof discount_data != "undefined" && typeof discount_data.basement_status != "undefined" ? discount_data.basement_status : '-',
            },
          };

        // For send mail.
        this.apiService.sendAdvanceLifeEmail(data).subscribe(lifemail => {
          console.log('lifemail', lifemail);
        });*/

        this.screen = screen;
        this.progrss = screen * 8.34;
        this.moveToPageTop()
    }else{
      if(screen == 4){
        this.zillowData['value'] = typeof this.zillowData['value'] != "undefined" ? this.zillowData['value'] : 0;
        this.zillowData['square'] =  this.zillowData['square'];
        this.zillowData['built_year'] = this.zillowData['built_year'];
        this.zillowData['estimate'] =  typeof this.zillowData['estimate'] !=  "undefined" ? this.zillowData['estimate'] : 0;
        this.commonService.applyTotalData('zillowData', this.zillowData);
      }

      this.screen = screen;
      if(screen == 1){
        this.loadGooglePlace();
      }
      this.progrss = screen * 8.34;
      this.moveToPageTop()
    }
  }

  changePropertyDetail(){
    this.IsChangeZollowInfo = this.IsChangeZollowInfo==false ? true : false;
  }

  setInsurenceDate(date){
    if(date != "ASAP"){
      this.commonService.applyTotalData('insurence_want', date.value);
    }else{
      this.commonService.applyTotalData('insurence_want', 'ASAP');
    }
    this.isPage7 = true;
    this.nextscreenmove(10);
  }

  setRequestOrComments(){
    this.commonService.applyTotalData('requestorcomments', this.requestorcomments);
    this.nextscreenmove(12);
  }

  checkAgent(){
    const Baseapi = "https://apply.insure/all";
    this.http.get(Baseapi)
    .subscribe(
        data => {
            let csvToRowArray = data;  
            let currentAgent = this.router.url.split('/')[1] != "f" && this.router.url.split('/')[1] != "life" ? this.router.url.split('/')[1] : this.router.url.split('/')[2];
            let cagent = currentAgent.split("?");
            if(cagent.length > 1){
              let agnt = cagent[0].toString();
              currentAgent = agnt;
            }
            this.agentlink = currentAgent;
            for (const [key, row] of Object.entries(csvToRowArray)) {             
              if(row['link'].toString().trim() == currentAgent){
                let userArr = [];
                userArr['email'] = row['email'];
                userArr['additional_email'] = row['additional_email'];
                userArr['name'] = row['firstname'] + ' ' + row['lastname'];
                userArr['logo'] = row['introimage'];
                userArr['phone'] = row['phone']; 
                row['api_status'] = row['api_status'].toLowerCase();
                userArr['api_status'] = row['api_status'];
                this.api_status = row['api_status'].localeCompare("yes");

                if(row['emailtext'].trim() != ''){
                  this.applicant_email_content = row['emailtext'];
                }else{
                  this.applicant_email_content = 'Thank you for your requesting a quote! <br> We will run your quote and get back to you shortly! <br> Our partner companies include Progressive, <br> NationWide , MetLife, Travelers and more. <br> There is never a fee for our service. <br> Feel free to reach out our agency at anytime';
                }

                // if(row['propertyimage'].trim() != ''){
                //   userArr['favicon'] = row['propertyimage'];
                // }else{
                //   userArr['favicon'] = '';
                // }

                if(row['agentimage'].trim() != ''){
                  userArr['agent_image'] = row['agentimage'];
                }else{
                  userArr['agent_image'] = '';
                }

                if(row['spreadsheet_id'].trim() != ''){
                  userArr['spreadsheet_id'] = row['spreadsheet_id'];
                }else{
                  userArr['spreadsheet_id'] = '';
                }

                if(row['full_app_sheet_id'].trim() != ''){
                  userArr['full_app_sheet_id'] = row['full_app_sheet_id'];
                }else{
                  userArr['full_app_sheet_id'] = '';
                }
                
                userArr['plymouth_api'] = row['plymouth_api'].localeCompare("yes");
                userArr['universal_api'] = row['universal_api'].localeCompare("yes");
                userArr['stillwater_api'] = row['stillwater_api'].localeCompare("yes");
                userArr['neptuneflood_api'] = row['neptuneflood_api'].localeCompare("yes");
                userArr['havenlife_api'] = row['havenlife_api'].localeCompare("yes");
                userArr['ethoslife_api'] = row['ethoslife_api'].localeCompare("yes");
                userArr['hippo_api'] = row['hippo_api'].localeCompare("yes");
                
                let arr = [];
                arr[row['link']] = userArr;
                configs['agentsInfo'] =arr;
                this.agentInfo = userArr;
                // For set favicon icon.
                let path = "/assets/favicon/"+userArr['favicon'];
                this.setFaviconIcon(path);
              }
          }
      },
      error =>{
        console.log(error);
      }
    );
    // this.http.get('assets/agents.csv', {responseType: 'text'})
    // .subscribe(
    //     data => {
    //         let csvToRowArray = data.split("\n");           
    //         let currentAgent = this.router.url.split('/')[1] != "f" && this.router.url.split('/')[1] != "life" ? this.router.url.split('/')[1] : this.router.url.split('/')[2];
    //         let cagent = currentAgent.split("?");
    //         if(cagent.length > 1){
    //           let agnt = cagent[0].toString();
    //           currentAgent = agnt;
    //         }
    //         this.agentlink = currentAgent;

    //         for (let index = 1; index < csvToRowArray.length; index++) {
    //           let row = csvToRowArray[index].split(",");
            
    //           if(row[0].trim() == currentAgent){
    //             let userArr = [];
    //             userArr['email'] = row[1];
    //             userArr['additional_email'] = row[2];
    //             userArr['name'] = row[3];
    //             userArr['logo'] = row[4];
    //             userArr['phone'] = row[5];
    //             row[6] = row[6].toLowerCase();
    //             userArr['api_status'] = row[6];
    //             this.api_status = row[6].localeCompare("yes");

    //             if(row[7].trim() != ''){
    //               this.applicant_email_content = row[7];
    //             }else{
    //               this.applicant_email_content = 'Thank you for your requesting a quote! <br> We will run your quote and get back to you shortly! <br> Our partner companies include Progressive, <br> NationWide , MetLife, Travelers and more. <br> There is never a fee for our service. <br> Feel free to reach out our agency at anytime';
    //             }

    //             if(row[8].trim() != ''){
    //               userArr['favicon'] = row[8];
    //             }else{
    //               userArr['favicon'] = '';
    //             }

    //             if(row[10].trim() != ''){
    //               userArr['agent_image'] = row[10];
    //             }else{
    //               userArr['agent_image'] = '';
    //             }

    //             if(row[11].trim() != ''){
    //               userArr['spreadsheet_id'] = row[11];
    //             }else{
    //               userArr['spreadsheet_id'] = '';
    //             }

    //             if(row[14].trim() != ''){
    //               userArr['full_app_sheet_id'] = row[14];
    //             }else{
    //               userArr['full_app_sheet_id'] = '';
    //             }

    //             userArr['plymouth_api'] = row[15].localeCompare("yes");
    //             userArr['universal_api'] = row[16].localeCompare("yes");
    //             userArr['stillwater_api'] = row[17].localeCompare("yes");
    //             userArr['neptuneflood_api'] = row[18].localeCompare("yes");
    //             userArr['havenlife_api'] = row[19].localeCompare("yes");
    //             userArr['ethoslife_api'] = row[20].localeCompare("yes");
    //             userArr['hippo_api'] = row[21].localeCompare("yes");

    //             let arr = [];
    //             arr[row[0]] = userArr;
    //             configs['agentsInfo'] =arr;
    //             this.agentInfo = userArr;
    //             // For set favicon icon.
    //             let path = "/assets/favicon/"+userArr['favicon'];
    //             this.setFaviconIcon(path);
    //           }
    //       }
    //   },
    //   error =>{
    //     console.log(error);
    //   }
    // );
  }

  changeSource(event) {
    this.agentInfo['logo'] = '';
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
    this.commonService.applyTotalData('addressData',this.staticAddress);
   //console.log("this.addressData",this.addressData)
    localStorage.removeItem("manualAddress")
    localStorage.setItem("manualAddress",this.manualAddress);
    this.zillowData = {};
    this.GooglePlace = false;
    this.IsChangeZollowInfo = true;
    this.zillowDataFetched = true;
    this.api_status = -1;
    this.nextscreenmove(2);
    //this.changePropertyDetail();
  }

  docUpload(){ 
    this.priceArr['prices'].sort(function(a, b){return a - b});
    this.eventEmitterService.toggleAPIDataStatus(false);
    const zillowData = this.commonService.extractData('zillowData');
    const address = this.commonService.extractData('addressData');

    const personData =  this.commonService.extractData('personData');

    const carData = this.commonService.extractData('carData');

    const curYear = (new Date()).getFullYear();
    const yearData = {
      ac_year: curYear,
      electric_year: curYear,
      plumbing_year: curYear,
      roof_year: curYear
    };
    const isMailingSameAsProperty = this.commonService.extractData('isMailingSameAsProperty');
    const email = this.commonService.extractData('email');
    const phone = this.commonService.extractData('phone');
    const quote_id = this.commonService.extractData('quote_id');
    const carrier_type = this.commonService.extractData('carrier_type');
    const insurence_want = this.commonService.extractData('insurence_want');
    const requestorcomments = this.commonService.extractData('requestorcomments');
    let api_data = this.commonService.getItem('api_data');
    let discount_data = this.commonService.extractData("discountsData");
    let propertyData = this.commonService.extractData("propertyData");
    const hometype = this.commonService.extractData("hometype");

    var estimate = '-';
    if(this.zillowData['estimate'] != 0){
      estimate = typeof this.zillowData['estimate'] != 'undefined' ? this.zillowData['estimate'].toString().replace(',', '') : '-';
    }

    var data = {
      email, phone,quote_id,carrier_type,insurence_want,requestorcomments,hometype,
      yearBuilt: typeof this.zillowData['built_year'] != "undefined" ? this.zillowData['built_year'] : '-',
      address, personData, carData,propertyData,
      isMailingSameAsProperty,
      file_length: this.QutoFiles.length,
      ac_year: yearData.ac_year,
      electric_year: yearData.electric_year,
      plumbing_year: yearData.plumbing_year,
      roof_year: yearData.roof_year,
      sqft: typeof this.zillowData['square'] != "undefined" ? this.zillowData['square'] : '-',
      estimate: estimate,
      mailing_address: address,
      roof_status: 'peaked',
      is_basement: true,
      building_type: 1,
      foundation_type: 1,
      exterior_type: 1,
      construction_type: 1,
      roof_type: 1,
      applicant_email_content:this.applicant_email_content,
      pageFiveCustomQuestion:this.pageFiveCustomQuestion,
      pageSixCustomQuestion:this.pageSixCustomQuestion,
      api_status: this.api_status,
      propertyToInsure: localStorage.getItem("manualAddress"),
      // manualAddress:localStorage.getItem("manualAddress"),
       currentAddress:this.curretMailingAddress, 
      // manualAddress:localStorage.getItem("manualAddress"),
      // curretMailingAddress:this.curretMailingAddress, //this.manualAddress,
      selectedUserType: this.selectedUserType,
      insuranceType: this.insuranceTypeData.insuarance_type,
      current_auto_premium: this.current_auto_premium.current_auto_premium,
      agent:{
        'name':this.agentInfo['name'],
        'email':this.agentInfo['email'],
        'logo':this.agentInfo['logo'],
        'phone':this.agentInfo['phone'],
        'api_status':this.agentInfo['api_status'],
        'additional_email':this.agentInfo['additional_email'],
        'link':this.agentlink
      },
      'plymouth_best': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['best']['pricing'] : '-',
      'plymouth_better': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['better']['pricing'] : '-',
      'plymouth_good': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 &&  typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['good']['pricing'] : '-',
      'stillwater':this.api_status != -1 && this.agentInfo['stillwater_api'] != -1 && typeof api_data['stillwater'] != "undefined" && typeof api_data['stillwater']['ACORD']  != "undefined" && typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs'] != "undefined" &&
      typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']  != "undefined" &&
      typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt'] != "undefined" ? api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'] : '-',
      'universal': this.api_status != -1 && this.agentInfo['universal_api'] != -1 && typeof api_data['universal'] != "undefined" && typeof api_data['universal']['QuoteWrapper'] != "undefined" ? api_data['universal']['QuoteWrapper']['Premium'] : '-',
      'neptuneflood': this.api_status != -1 && this.agentInfo['neptuneflood_api'] != -1 && typeof api_data['neptuneflood'] != "undefined"  &&  typeof api_data['neptuneflood']['data'] != "undefined" ? api_data['neptuneflood']['data']['premium'] : '-',
      'havenlife': this.api_status != -1 && this.agentInfo['havenlife_api'] != -1 && typeof api_data['havenlife'] != "undefined" && typeof api_data['havenlife']['quotes'] != "undefined" ? api_data['havenlife']['quotes'][0]['monthlyRate'] : '-',
      'ethoslife': this.api_status != -1 && this.agentInfo['ethoslife_api'] != -1 && this.monthlycost != 0 ? this.monthlycost : '-',
      'hippo': this.api_status != -1 && this.agentInfo['hippo_api'] != -1 && this.hippo_premium != 0 ? this.hippo_premium : '-',
      'discountsData':{
        'roof_shape':  typeof discount_data != "undefined" && typeof discount_data.roof_shape != "undefined" ? discount_data.roof_shape : '-',
        'dog':typeof discount_data != "undefined" && typeof discount_data.dog != "undefined" ? discount_data.dog : '-',
        'security_system': typeof discount_data != "undefined" && typeof discount_data.security_system != "undefined" ? discount_data.security_system : '-',
        'claim_free': typeof discount_data != "undefined" && typeof discount_data.claim_free != "undefined" ? discount_data.claim_free : '-',
        'roof_type': typeof discount_data != "undefined" && typeof discount_data.roof_type != "undefined" ? discount_data.roof_type : '-',
        'foundation': typeof discount_data != "undefined" && typeof discount_data.foundation != "undefined" ? discount_data.foundation : '-',
        'dog_desc': typeof discount_data != "undefined" && typeof discount_data.dog_desc != "undefined" ? discount_data.dog_desc : '-',
        'basement_status': typeof discount_data != "undefined" && typeof discount_data.basement_status != "undefined" ? discount_data.basement_status : '-',
      },
    };

    const formData = new FormData();
    for(let i = 0; i < this.QutoFiles.length; i++){
      formData.append('uploadedDocument_'+i, this.QutoFiles[i]);
    }
    formData.append('data', JSON.stringify(data));

    // For send mail. 
    this.apiService.sendAdvanceLifeUploadDocEmail(formData).subscribe(advanceLifemail => {
      console.log('adavace life upload document mail', advanceLifemail);
      // document.getElementById('uploadDocSec').style.display = "none";
      /* this.waitingtxt = "Your document uploaded successfully.";
      this.waitingtxtflag = 1;
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera */
    });
      
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

  checkdob(event , id ){
    if(typeof event.target != "undefined" && event.target.value == ""){
      const parentElement = document.getElementById(id);
      const firstChild = parentElement.children[0];
      firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-valid-input');
      firstChild.classList.add('e-error');
    }else{
      const parentElement = document.getElementById(id);
      const firstChild = parentElement.children[0];
      firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-success');
    }
  }

  savePropertyDetail(){
    if((<HTMLInputElement>document.getElementById("zillow_built_year")).value &&  (<HTMLInputElement>document.getElementById("zillow_square_size")).value){
      this.zillowData['built_year']=(<HTMLInputElement>document.getElementById("zillow_built_year")).value;
      this.zillowData['square']=(<HTMLInputElement>document.getElementById("zillow_square_size")).value;
      this.IsChangeZollowInfo=false;
    }else{
      this.commonService.modalOpen('Error', 'Please enter proper built year Or square size.');
      return false;      
    }
  }

  setCurrentPremiumData(data){
    this.current_auto_premium = data;
    this.nextscreenmove(10);
  }

  setQuoteUpload(data){
    this.QutoFiles = data;
    this.nextscreenmove(11);
  }
   
  checkValidation(index){
    //this.AccurateQuoteForm.controls['CARVIN' + i].value
    for (let i = 0; i < this.carData.length; i++) {     
      if(this.AccurateQuoteForm.controls['CARVIN' + i].value.length>0){
        this.isValidform=true;
        break;
      }else{
        this.isValidform=false;
      }
    }
    
  }
  sendAccurateQuoteMail(){
    //!this.AccurateQuoteForm.valid || 
    if(this.isValidform==false){
      this.commonService.modalOpen('Error', 'All field are required !!');
      return false;      
    }else{
       const address = this.commonService.extractData('addressData');
      const personData =  this.commonService.extractData('personData');
      let mannualAddress;
      if(this.isManualAddress==true){
        mannualAddress=this.staticAddress
      }else{
        mannualAddress=""
      }
      let data = {
        AccurateQuoteFormData:this.AccurateQuoteForm.value,
        eightPlusPerson:this.eightPlusPerson,
        carDataLength: this.carData.length,
        subject:{
          address,
          personData,
          manualAddress:mannualAddress,
          // propertyToInsure: this.manualAddress,
          propertyToInsure:localStorage.getItem("manualAddress"),
          currentAddress:this.curretMailingAddress, 
          agentName:this.agentInfo['name'],
          agentEmail:this.agentInfo['email'],
        }
      }
     /// console.log(data)
      this.apiService.AccurateQuoteMail(data).subscribe(res => {
        this.accurateQuoteSuccessMsg = "Quote submitted successfully !!"
      },(error)=>{
        console.log("Accurate Quote Mail Error",error);
      });
    }
  }

  SubmitQuoteForOtherBusiness(){
    if(this.OtherlineOfBusiness.length == 0){
      this.commonService.modalOpen('Error', 'Please select any other line of business !!');
      return false;      
    }else{
      const address = this.commonService.extractData('addressData');
      const personData =  this.commonService.extractData('personData');
      let data = {
        OtherlineOfBusiness:this.OtherlineOfBusiness,
        subject:{
          address,
          personData,
          manualAddress: this.manualAddress,
          agentName:this.agentInfo['name'],
          agentEmail:this.agentInfo['email'],
        }
      }
      this.apiService.OthorLineOfBusinessMail(data).subscribe(res => {
        this.OtherBusinessSuccessMsg = "Other business for quote sent submitted successfully !!";
      },(error)=>{
        console.log("Othet Line Of Business Mail Error",error);
      });
    }
  }

  updateQuoteForOtherBusiness(data:never){
    let temp = 0;
    this.OtherlineOfBusiness.forEach((element)=>{
      if(element == data){
        temp = 1;
      }
    });

    if(temp == 0){
      this.OtherlineOfBusiness.push(data);
    }else{
      var newArr: string[] = [];
      this.OtherlineOfBusiness.forEach((element)=>{
        if(element != data){
          newArr.push(element);
        }
      });
      this.OtherlineOfBusiness = newArr;
    }
  }
}