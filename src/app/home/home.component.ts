import {AfterViewInit, Component, ElementRef, HostListener, Input, NgZone, OnInit, ViewChild} from '@angular/core';
import { Observable } from "rxjs";
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

declare var google;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ScrollToService]
})
export class HomeComponent implements OnInit, AfterViewInit {
  @Input() name;
  @ViewChild('placesRef', {static: false}) public searchElementRef: ElementRef;
  validatingForm: FormGroup;
  addressData: addressData = {};
  GooglePlace: boolean = true;
  showBuyHome: boolean = false;
  step: number = 0;
  screen: number = 0;
  formatted_address: string;
  // if roof_shape is set to true, roof is peaked. otherwise flat.
  public discountsData = {
    roof_shape: true,
    basement_finished: true,
    dog: true,
    pool: true,
    alarm: true,
    bundle: true,
    claim_free: true,
    life_ins: true,
    smoke_detector: true,
    good_credit: true
  };
  public questionsData: questionsData = {};
  /*
  * Insurance Type: 1) Home, 2) Auto 3) Bundle
  * */
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
  staticAddress: string;
  healthStatus: number = 3;
  life_val: number;
  healthText: object = ['Below Avg Health', 'Healthy', 'Superior Health', 'Select'];
  isshowdiscounts: boolean = false;
  zillowData: object = {value: '', square: '', built_year: '', estimate: ''};
  personData: personData[] = [{first_name: '', last_name: '', birthday: '', license: null}];
  carData: carData[] = [{year: '', type: '', model: ''}];
  homeData: object;
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
  requestorcomments: string = "";
  waitingtxt: string = "Please wait few second for api response";
  waitingtxtflag = 0;
  monthlycost = 0;
  ethoslink = 0;
  hippo_premium = 0;
  hippo_link = "";
  priceArr = [];
  neptuneFoodZone = "X";
  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });
  public applicant_email_content = '';
  api_status = -1;
  isManualAddress: boolean = false;
  manualAddress: string = "";
  agentlink: string = "";
  selectedUserType: string = "";
  firstpage: number = 1;
  current_carrier:string = "";

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
    if(this.router.url!="f"){
      this.router.navigate(['/f/'+this.router.url])
    }
    
    this.checkAgent();
    this.step = 1;
    this.screen = 1;
    this.nextbtn = false;
    this.loadGooglePlace();
    this.priceArr['prices'] = [];
    this.priceArr['totalprices'] = 0;

    this.zillowData['value'] = 0;
    this.zillowData['square'] =  this.zillowData['square'];
    this.zillowData['built_year'] = this.zillowData['built_year'];
    this.zillowData['estimate'] =  typeof this.zillowData['estimate'] !=  "undefined" ? this.zillowData['estimate'] : 0;
    this.commonService.applyTotalData('zillowData', this.zillowData);

    console.log("home");
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
    // this.loadGooglePlace();
    // this.sendAPIRequest();
    this.quote_id = this.commonService.getQuoteID();
    this.commonService.clearValues();
    this.eventEmitterService.toggleNav(false);
    this.modalContentMargin = (window.innerWidth - 500) / 2;
    if (window.innerWidth < 992) {
      this.modalContentMargin = (window.innerWidth - 300) / 2;
    }
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
    this.homeData = $event;
    this.commonService.applyTotalData('homeData', this.homeData);
    this.showBuyHome = false;
    if (this.insuranceType == 2) {
      this.step = 2;
    } else {
      this.loadGooglePlace()
      this.step = 1;
    }
  }

  setCarData($event) {
    this.carData = $event;
    this.commonService.applyTotalData('carData', this.carData);
    if(this.waitingtxt == ""){
      this.initStep3();
      this.isPage9 = true;
      this.nextscreenmove(10);
      setTimeout(() => window.scrollTo(0, 0));
    }else{
      this.waitingtxtflag = 1;
      this.nextscreenmove(9);
    }
  }

  setDiscountData($event) {
    this.discountsData = $event;
    this.initStep3();
    this.nextscreenmove(5);
    this.progrss = 50;
    //this.isPage6 = true;
    if(this.api_status == -1){
      this.waitingtxt = "";
      this.waitingtxtflag = 0;
    }
    this.commonService.applyTotalData('discountsData', this.discountsData);
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
    let formData = {
      "emailInput": new FormControl(this.email, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl(this.phone, [Validators.required, Validators.pattern("^[+0-9 \\-]{10,13}$")]),
    };
    for (let i = 0; i < this.personData.length; i++) {
      formData['firstnameInput' + i] = new FormControl(this.personData[i]['first_name'], Validators.required);
      formData['lastnameInput' + i] = new FormControl(this.personData[i]['last_name'], Validators.required);
      formData['birthdayInput' + i] = new FormControl(this.personData[i]['birthday'], Validators.required);
      if (this.addLicense) {
        formData['licenseInput' + i] = new FormControl(this.personData[i]['license'], Validators.required);
      }
    }
    this.validatingForm = new FormGroup(formData);
  }

  get emailInput() {
    return this.validatingForm.get('emailInput');
  }

  get phoneInput() {
    return this.validatingForm.get('phoneInput');
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
    console.log(data);
    this.apiService.getZillow(data).subscribe(res => {
      this.zillowLoader = false;
      this.zillowDataFetched = true;
      if(!res.hasOwnProperty('price')) {
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
    },error => {
      this.GooglePlace = false;
      this.spinnerService.hide();
    });
  }

  addPerson() {
    if (this.personData.length < 5) {
      this.personData[this.personData.length] = {first_name: '', last_name: '', birthday: '', license: null};
    }
    this.validatePersonForm();
  };

  deletePerson(key) {
    this.personData.splice(key, 1);
    this.validatePersonForm();
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
    this.commonService.applyTotalData('email', this.email);
    this.commonService.applyTotalData('phone', this.phone);
    this.commonService.applyTotalData('personData', this.personData);
    this.nextscreenmove(6);
  }

  setInsurnaceType(value) {
    this.insuranceType = value;
    this.commonService.applyTotalData('carrier_type', value);
    this.initStep3();
    //this.isPage7 = true;
    this.nextscreenmove(7);
  }

  sendEmail(type) {
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
    var estimate = 0;
    if(zillowData.estimate != 0){
      estimate = typeof zillowData.estimate != 'undefined' ? zillowData.estimate.toString().replace(',', '') : 0;
    }

    const data = {
      email, phone,
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
    console.log(this.agentInfo['plymouth_api']);

    if(this.agentInfo['plymouth_api'] != -1){
      this.apiService.getPlymouth(data).subscribe(response => {
        this.commonService.setAPIData('plymouth', response);
        console.log('plymouth', response);
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
        //this.priceArr['prices'].push(parseInt(neptuneflood['data']['premium']));
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
              let mailData = {cost:this.monthlycost,link:this.ethoslink,agentEmail:this.agentInfo['email'],address:this.commonService.extractData('addressData'), manualAddress: this.manualAddress};
              this.apiService.sendEthosLifeMail(mailData).subscribe(ethoslife => {
                console.log("Ethos mail sent successfully.");
              });
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

    this.apiService.get_nationwide(data).subscribe(res =>{
      let displayprice =  0;
      if(typeof res['result']['offeredQuotes'] != "undefined" && res['result']['offeredQuotes'].length > 0){
        var quotePremium = res['result']['offeredQuotes'][0];
        displayprice = typeof quotePremium['premium'] != "undefined" && typeof quotePremium['premium']['total'] != "undefined" &&  typeof quotePremium['premium']['total']['amount'] != "undefined" ? quotePremium['premium']['total']['amount'] : 0
      }
      if(displayprice != 0){
        this.priceArr['prices'].push(displayprice);
        this.priceArr['totalprices'] = this.priceArr['totalprices'] + 1;
      }
    });

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

  usertypeselection(screen,usertype){
    this.selectedUserType = usertype;
    if(this.selectedUserType == 'I rent this home'){
      screen = 5;
      this.progrss = 50;
    }
    this.nextscreenmove(screen);
  }

  nextscreenmove(screen){
    if(screen == 6 && this.api_status != -1){
      this.sendAPIRequest();
    }
    if(screen == 4 && (typeof this.zillowData['square'] === "undefined" || typeof this.zillowData['built_year'] === "undefined")){
      this.commonService.modalOpen('Error', 'Please enter square size and built year !');
      return;
    }else if(screen == 4 && (this.zillowData['square'] == "" || this.zillowData['built_year'] == "" || this.zillowData['square'] == null || this.zillowData['built_year'] == null)){
      this.commonService.modalOpen('Error', 'Please enter square size and built year !');
      return;
    }else if(screen == 10){
        this.priceArr['prices'].sort(function(a, b){return a - b});
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
        const quote_id = this.commonService.extractData('quote_id');
        const carrier_type = this.commonService.extractData('carrier_type');
        const insurence_want = this.commonService.extractData('insurence_want');
        const requestorcomments = this.commonService.extractData('requestorcomments');
        let api_data = this.commonService.getItem('api_data');
        let discount_data = this.commonService.extractData("discountsData");

        var estimate = '-';
        if(this.zillowData['estimate'] != 0){
          estimate = typeof this.zillowData['estimate'] != 'undefined' ? this.zillowData['estimate'].toString().replace(',', '') : '-';
        }

        const data = {
          email, phone,quote_id,carrier_type,insurence_want,requestorcomments,
          yearBuilt: typeof this.zillowData['built_year'] != "undefined" ? this.zillowData['built_year'] : '-',
          address, personData, carData,
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
          api_status: this.api_status,
          manualAddress: this.manualAddress,
          selectedUserType: this.selectedUserType,
          agent:{
            'name':this.agentInfo['name'],
            'email':this.agentInfo['email'],
            'logo':this.agentInfo['logo'],
            'phone':this.agentInfo['phone'],
            'additional_email': this.agentInfo['additional_email'],
            'link':this.agentlink,
            'spreadsheet_id': this.agentInfo['spreadsheet_id'],
            'short_app_sheet_id': this.agentInfo['short_app_sheet_id']
          },
          'plymouth_best': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['best']['pricing'] : '-',
          'plymouth_better': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['better']['pricing'] : '-',
          'plymouth_good': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 &&  typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['good']['pricing'] : '-',

          'stillwater':this.api_status != -1 && this.agentInfo['stillwater_api'] != -1 && typeof api_data['stillwater'] != "undefined" && typeof api_data['stillwater']['ACORD']  != "undefined"
           && typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs'] != "undefined" &&
          typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']  != "undefined" &&
          typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']  != "undefined" ? api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'] : '-',

          'universal': this.api_status != -1 && this.agentInfo['universal_api'] != -1  && typeof api_data['universal'] != "undefined" && typeof api_data['universal']['QuoteWrapper'] != "undefined" ? api_data['universal']['QuoteWrapper']['Premium'] : '-',
          'neptuneflood': this.api_status != -1 && this.agentInfo['neptuneflood_api'] != -1 && typeof api_data['neptuneflood'] != "undefined" && typeof api_data['neptuneflood']['data'] != "undefined" ? api_data['neptuneflood']['data']['premium'] : '-',
          'havenlife': this.api_status != -1 && this.agentInfo['havenlife_api'] != -1 && typeof api_data['havenlife'] != "undefined" && typeof api_data['havenlife']['quotes'] != "undefined" ? api_data['havenlife']['quotes'][0]['monthlyRate'] : '-',
          'ethoslife': this.api_status != -1 && this.agentInfo['ethoslife_api'] != -1 && this.monthlycost != 0 ? this.monthlycost : '-',
          'hippo': this.api_status != -1 && this.agentInfo['hippo_api'] != -1 && this.hippo_premium != 0 ? this.hippo_premium : '-',
          'discountsData':{
            'roof_shape':  typeof discount_data != "undefined" && typeof discount_data.roof_shape != "undefined" ? discount_data.roof_shape : '-',
            'dog': typeof discount_data != "undefined" && typeof discount_data.dog != "undefined" ? discount_data.dog : '-',
            'security_system':  typeof discount_data != "undefined" && typeof discount_data.security_system != "undefined" ? discount_data.security_system : '-',
            'claim_free':  typeof discount_data != "undefined" && typeof discount_data.claim_free != "undefined" ? discount_data.claim_free : '-'
          },
        };

        // For send mail.
        this.apiService.sendLifeEmail(data).subscribe(lifemail => {
          console.log('lifemail', lifemail);
        });

        this.screen = screen;
        this.progrss = screen * 10;
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
      this.progrss = screen * 10;
      this.moveToPageTop()
    }
  }

  changePropertyDetail(){
    this.IsChangeZollowInfo = true;
  }

  setInsurenceDate(date){
    if(date != "ASAP"){
      this.commonService.applyTotalData('insurence_want', date.value);
    }else{
      this.commonService.applyTotalData('insurence_want', 'ASAP');
    }
    this.nextscreenmove(8);
  }

  setRequestOrComments(){
    this.commonService.applyTotalData('requestorcomments', this.requestorcomments);
    this.isPage7 = true;
    this.nextscreenmove(9);
  }

  checkAgent(){
    this.http.get('assets/agents.csv', {responseType: 'text'})
    .subscribe(
      data => {
        let csvToRowArray = data.split("\n");

        let currentAgent = this.router.url.split('/')[1] != "f" && this.router.url.split('/')[1] != "life" ? this.router.url.split('/')[1] : this.router.url.split('/')[2];
        let cagent = currentAgent.split("?");
        if(cagent.length > 1){
          let agnt = cagent[0].toString();
          currentAgent = agnt;
        }
        this.agentlink = currentAgent;

        for (let index = 1; index < csvToRowArray.length; index++) {
          let row = csvToRowArray[index].split(",");
          if(row[0].trim() == currentAgent){
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

            if(row[12].trim() != ''){
              userArr['short_app_sheet_id'] = row[12];
            }else{
              userArr['short_app_sheet_id'] = '';
            }

            userArr['plymouth_api'] = row[15].localeCompare("yes");
            userArr['universal_api'] = row[16].localeCompare("yes");
            userArr['stillwater_api'] = row[17].localeCompare("yes");
            userArr['neptuneflood_api'] = row[18].localeCompare("yes");
            userArr['havenlife_api'] = row[19].localeCompare("yes");
            userArr['ethoslife_api'] = row[20].localeCompare("yes");
            userArr['hippo_api'] = row[21].localeCompare("yes");

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
    this.zillowData = {};
    this.GooglePlace = false;
    this.IsChangeZollowInfo = true;
    this.zillowDataFetched = true;
    this.api_status = -1;
    this.nextscreenmove(2);
    //this.changePropertyDetail();
  }

  docUpload(event){
    if(event.target.files.length > 0){
      if (event.target.files && event.target.files[0]){
        let ext = ["png","jpg","pdf","jpeg"];

        // validation code.
        var filelist = [];
        var filelength = 0;
        if(typeof event.target.files[0].name != "undefined" && event.target.files[0].name != ""){
          for(let i = 0; i < event.target.files.length; i++){
            let selectedext = event.target.files[i].name.split(".")[event.target.files[i].name.split(".").length - 1];
            selectedext = selectedext.toLowerCase();
            if(ext.indexOf(selectedext) == -1){
              this.commonService.modalOpen('Warning', 'Only PDF, JPG, PNG file are acceptable.');
              return;
            }
            filelist.push(event.target.files[i]);
          }
          filelength = event.target.files.length;
        }

        this.priceArr['prices'].sort(function(a, b){return a - b});
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
        const quote_id = this.commonService.extractData('quote_id');
        const carrier_type = this.commonService.extractData('carrier_type');
        const insurence_want = this.commonService.extractData('insurence_want');
        const requestorcomments = this.commonService.extractData('requestorcomments');
        let api_data = this.commonService.getItem('api_data');
        let discount_data = this.commonService.extractData("discountsData");

        var estimate = '-';
        if(this.zillowData['estimate'] != 0){
          estimate = typeof this.zillowData['estimate'] != 'undefined' ? this.zillowData['estimate'].toString().replace(',', '') : '-';
        }
        const data = {
          email, phone,quote_id,carrier_type,insurence_want,requestorcomments,
          yearBuilt: typeof this.zillowData['built_year'] != "undefined" ? this.zillowData['built_year'] : '-',
          address, personData, carData,
          isMailingSameAsProperty,
          file_length: filelength,
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
          api_status: this.api_status,
          manualAddress: this.manualAddress,
          selectedUserType: this.selectedUserType,
          agent:{
            'name':this.agentInfo['name'],
            'email':this.agentInfo['email'],
            'logo':this.agentInfo['logo'],
            'phone':this.agentInfo['phone'],
            'additional_email': this.agentInfo['additional_email'],
            'link':this.agentlink
          },
          'plymouth_best': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['best']['pricing'] : '-',
          'plymouth_better': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['better']['pricing'] : '-',
          'plymouth_good': this.api_status != -1 && this.agentInfo['plymouth_api'] != -1 && typeof api_data['plymouth'] != "undefined" ? api_data['plymouth']['good']['pricing'] : '-',

          'stillwater':this.api_status != -1 && this.agentInfo['stillwater_api'] != -1 && typeof api_data['stillwater'] != "undefined" && typeof api_data['stillwater']['ACORD']  != "undefined" && typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs'] != "undefined"  &&
          typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo'] != "undefined" &&
          typeof api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt'] != "undefined" ? api_data['stillwater']['ACORD']['InsuranceSvcRs']['HomePolicyQuoteInqRs']['PolicySummaryInfo']['FullTermAmt']['Amt'] : '-',

          'universal': this.api_status != -1 && this.agentInfo['universal_api'] != -1 && typeof api_data['universal'] != "undefined" && typeof api_data['universal']['QuoteWrapper'] != "undefined" ? api_data['universal']['QuoteWrapper']['Premium'] : '-',
          'neptuneflood': this.api_status != -1 && this.agentInfo['neptuneflood_api'] != -1 && typeof api_data['neptuneflood'] != "undefined" && typeof api_data['neptuneflood']['data'] != "undefined" ? api_data['neptuneflood']['data']['premium'] : '-',
          'havenlife': this.api_status != -1 && this.agentInfo['havenlife_api'] != -1 && typeof api_data['havenlife'] != "undefined" && typeof api_data['havenlife']['quotes'] != "undefined" ? api_data['havenlife']['quotes'][0]['monthlyRate'] : '-',
          'ethoslife': this.api_status != -1 && this.agentInfo['ethoslife_api'] != -1 && this.monthlycost != 0 ? this.monthlycost : '-',
          'hippo': this.api_status != -1 && this.agentInfo['hippo_api'] != -1 && this.hippo_premium != 0 ? this.hippo_premium : '-',
          'discountsData':{
            'roof_shape':  typeof discount_data != "undefined" && typeof discount_data.roof_shape != "undefined" ? discount_data.roof_shape : '-',
            'dog': typeof discount_data != "undefined" && typeof discount_data.dog != "undefined" ? discount_data.dog : '-',
            'security_system': typeof discount_data != "undefined" && typeof discount_data.security_system != "undefined" ? discount_data.security_system : '-',
            'claim_free': typeof discount_data != "undefined" && typeof discount_data.claim_free != "undefined" ? discount_data.claim_free : '-'
          },
        };
        const formData = new FormData();
        for(let i = 0; i < event.target.files.length; i++){
          formData.append('uploadedDocument_'+i, event.target.files[i]);
        }
        formData.append('data', JSON.stringify(data));

        // For send mail.
        this.apiService.sendLifeUploadDocEmail(formData).subscribe(lifemail => {
          console.log('life upload document mail', lifemail);
          //document.getElementById('uploadDocSec').style.display = "none";
          this.waitingtxt = "Your document uploaded successfully.";
          this.waitingtxtflag = 1;
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        });

      }
    }else{
      this.commonService.modalOpen('Error', 'Please select document !');
      return;
    }
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
      if(typeof event.target != "undefined" && event.target.value == ""){
      const parentElement = document.getElementById('datepicker');
      const firstChild = parentElement.children[0];
      firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-valid-input');
      firstChild.classList.add('e-error');
    }else{
      const parentElement = document.getElementById('datepicker');
      const firstChild = parentElement.children[0];
      // firstChild.classList.remove('e-valid-input');
      firstChild.classList.remove('e-error');
      firstChild.classList.add('e-valid-input');
    }
  }

  setCurrentCarrierData($event){
    this.current_carrier = $event;
    this.firstpage = 1;
    this.loadGooglePlace();
  }
}
