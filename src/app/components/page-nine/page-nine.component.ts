import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {addressData, CarYearData, discountsData, personData, yearData} from '../../home/models';
import {CommonService} from "../../services/common.service";
import {MapsAPILoader} from "@agm/core";
//import * as configs from "../../../../config";
import * as config from "../../config/congifg";
import * as carriers from "../../../resource/carriers";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {FileUploader} from "ng2-file-upload";
import {ApiService} from "../../api-service";
import {Ng4LoadingSpinnerService} from "ng4-loading-spinner";

declare var google;
const URL = '/api/upload-doc';

@Component({
  selector: 'app-page-nine',
  templateUrl: './page-nine.component.html',
  styleUrls: ['./page-nine.component.scss']
})
export class PageNineComponent implements OnInit, AfterViewInit {
  @Output() onSetDetails: EventEmitter<object> = new EventEmitter<object>();
  @ViewChild('placesRef', {static: false}) public searchElementRef: ElementRef;
  @Input('discountsData') public discountsData: discountsData;
  @Input('carData') public carData: object;
  @Input('addressText') public addressText: string;
  @Input('personData') public personData: personData[];
  @Input('homeData') public homeData: object;
  public isMailingSameAsProperty: boolean = true;
  public prevFile: string;

  public mailing_address: addressData = {
    street_number: null,
    route: null,
    address: null,
    locality: null,
    administrative_area_level_1: null,
    country: null,
    postal_code: null
  };
  public uploader: FileUploader = new FileUploader({
    url: URL,
    itemAlias: 'doc',
    autoUpload: true,
    allowedMimeType: ['application/pdf'],
    additionalParameter: {
      prevFile: this.prevFile
    }
  });
  public yearData: yearData = {};
  public validatingForm: FormGroup;
  public address: any;
  public prior_address: any;
  public total_data;
  public CarYearData: CarYearData[] = [];
  //config
  public CarTypeData: object = config.car_types;
  // public CarTypeData: object = configs.car_types;
  public carriers: object;
  public comment: string;
  public addLicense: boolean;
  public email: string;
  public phone: string;

  constructor(public commonService: CommonService, public mapsAPILoader: MapsAPILoader, public ngZone: NgZone,
              public apiService: ApiService, private spinnerService: Ng4LoadingSpinnerService) {
  }

  ngOnInit() {
    this.setInitValues();
    this.validatePersonForm();
  }

  setInitValues() {
    this.total_data = this.commonService.getItem('total_data');
    this.total_data.isMailingSameAsProperty = true;
    if (!this.total_data.yearData) this.total_data.yearData = {};
    if (!this.total_data.address_data) this.total_data.address_data = {};
    if (!this.total_data.homeData) this.total_data.homeData = {};
    if (!this.total_data.discountsData) this.total_data.discountsData = {};
    if (!this.total_data.personData) {
      this.total_data.personData = [
        {
          first_name: '', last_name: '', birthday: ''
        }
      ]
    }
    if (!this.total_data.carData) {
      this.total_data.carData = [
        {
          year: '', type: '', model: ''
        }
      ]
    }

    this.CarYearData = this.commonService.getCarYearData();
    this.CarTypeData = config.car_types;
    this.carriers = carriers.data;
    this.uploader.onAfterAddingFile = (file) => {
      this.uploader.setOptions({
        additionalParameter: {
          prevFile: this.prevFile
        }
      });
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      if (status == 200) {
        response = JSON.parse(response);
        this.prevFile = response.name;
        (<HTMLInputElement>document.querySelector('input[type=file]')).value = '';
        this.commonService.modalOpen('Success', 'Your document has been successfully uploaded!');
        this.total_data.attachment = response.name;
        return;
      }
      this.commonService.modalOpen('Error', 'An error occurred. Please try again later.');
    };
  }

  ngAfterViewInit() {
    this.loadGooglePlace();
    console.log(this.total_data.discountsData.claim_free)
  }

  loadGooglePlace() {
    this.mapsAPILoader.load().then(() => {
      setTimeout(() => {
        let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
          types: ["address"], componentRestrictions: {country: 'USA'}
        });
        autocomplete.addListener("place_changed", () => {
          this.ngZone.run(() => {
            let address = autocomplete.getPlace();
            this.handleAddressChange(address);
          })
        })
      });
    });
  }

  handleAddressChange(address) {
    let addressData = address.address_components;
    try {
      this.mailing_address['street_number'] = addressData.filter((elem) => {
        return elem['types'][0] == 'street_number'
      })[0]['short_name'];
      this.mailing_address['route'] = addressData.filter((elem) => {
        return elem['types'][0] == 'route'
      })[0]['long_name'];
      this.mailing_address['address'] = this.mailing_address['street_number'] + ' ' + this.mailing_address['route'];
      this.mailing_address['locality'] = addressData.filter((elem) => {
        return elem['types'][0] == 'locality'
      })[0]['long_name'];
      this.mailing_address['administrative_area_level_1'] = addressData.filter((elem) => {
        return elem['types'][0] == 'administrative_area_level_1'
      })[0]['short_name'];
      this.mailing_address['country'] = addressData.filter((elem) => {
        return elem['types'][0] == 'country'
      })[0]['long_name'];
      this.mailing_address['postal_code'] = addressData.filter((elem) => {
        return elem['types'][0] == 'postal_code'
      })[0]['short_name'];
      this.commonService.applyTotalData('addressData', this.mailing_address);
      const data = {
        address: this.mailing_address['address'],
        citystatezip: this.mailing_address['locality'] + ', ' + this.mailing_address['administrative_area_level_1'] + ', '
          + this.mailing_address['postal_code']
      };
      this.getZillowData(data);
    } catch (e) {
      this.commonService.modalOpen('Errpr', 'Please enter the correct address type.');
    }
  }

  getZillowData(data) {
    this.spinnerService.show();
    let zillowData = {};
    this.apiService.getZillow(data).subscribe(res => {
      this.spinnerService.hide();
      if (res.hasOwnProperty('price')) {
        const estimate = res.price
        zillowData['square'] = res.building_size;
        zillowData['built_year'] = res.year_built;
        zillowData['estimate'] = estimate != NaN ? this.commonService.commafy(estimate) : 0;
      } else {
        zillowData = {
          built_year: "1920",
          estimate: "574,505",
          square: "2,344"
        };
      }
      this.commonService.applyTotalData('zillowData', zillowData);
      console.log(zillowData, 'zillowData');
    }, (err) => {
    });
  }

  validHomeData() {
    return true;
    let max = new Date().getUTCFullYear();
    let min = max - 15;
    if (!this.total_data.yearData.roof_year || (this.total_data.yearData.roof_year < min || this.total_data.roof_year > max)) {
      this.commonService.modalOpen('warning', 'Roof Year should be between ' + min + ' and ' + max + '.');
      return false;
    }
    if (!this.total_data.yearData.plumbing_year || (this.total_data.yearData.plumbing_year < min || this.total_data.plumbing_year > max)) {
      this.commonService.modalOpen('warning', 'Plumbing Year should be between ' + min + ' and ' + max + '.');
      return false;
    }
    if (!this.total_data.yearData.ac_year || (this.total_data.yearData.ac_year < min || this.total_data.ac_year > max)) {
      this.commonService.modalOpen('warning', 'A/C Year should be between ' + min + ' and ' + max + '.');
      return false;
    }
    if (!this.total_data.yearData.electric_year || (this.total_data.yearData.electric_year < min || this.total_data.electric_year > max)) {
      this.commonService.modalOpen('warning', 'Electronic Year should be between ' + min + ' and ' + max + '.');
      return false;
    }
    return true;
  };

  validatePersonForm() {
    let formData = {
      "emailInput": new FormControl(this.total_data.email, [Validators.required, Validators.pattern(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]),
      "phoneInput": new FormControl(this.total_data.phone, [Validators.required, Validators.pattern(/^((?!(0))[0-9]{10,100})$/)]),
    };
    for (let i = 0; i < this.total_data.personData.length; i++) {
      formData['firstnameInput' + i] = new FormControl(this.total_data.personData[i]['first_name'], Validators.required);
      formData['lastnameInput' + i] = new FormControl(this.total_data.personData[i]['last_name'], Validators.required);
      formData['birthdayInput' + i] = new FormControl(this.total_data.personData[i]['birthday'], Validators.required);
      if (this.addLicense) {
        formData['licenseInput' + i] = new FormControl(this.total_data.personData[i]['license'], Validators.required);
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

  addPerson() {
    if (this.total_data.personData.length < 5) {
      this.total_data.personData[this.total_data.personData.length] = {
        first_name: '',
        last_name: '',
        birthday: '',
        license: null
      };
    }
    this.validatePersonForm();
  };

  deletePerson(key) {
    if (this.total_data.personData.length > 1) {
      this.total_data.personData.splice(key, 1);
    }
  }

  next() {
    if (this.validHomeData() && this.validatingForm.valid) {
      try {
        this.total_data.carrier_text = carriers.data[this.total_data.carrier_type - 1]['text'];
      } catch (e) {
        this.total_data.carrier_text = '';
      }
      this.commonService.setItem('total_data', this.total_data);
      this.onSetDetails.emit(this.total_data);
    }
  }

  addCar() {
    if (this.total_data.carData.length < 4) {
      this.total_data.carData[this.total_data.carData.length] = {year: '', type: '', model: ''};
    }
  };

  deleteCar(key) {
    if (this.total_data.carData.length > 1) {
      this.total_data.carData.splice(key, 1);
    }
  }
}
