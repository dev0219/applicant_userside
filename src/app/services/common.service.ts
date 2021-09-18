import {HostListener, Injectable} from '@angular/core';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {NgbdModalContent} from "../home/ngbd.modal.content";
import {LocalStorageService} from "angular-web-storage";
import {CarYearData} from "../home/models";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public isMobile: boolean;

  constructor(private modalService: NgbModal, public local: LocalStorageService) {
    this.isMobile = window.innerWidth < 769;
  }

  @HostListener('window:resize', ['$event'])
  onResize($event) {
    this.isMobile = $event.innerWidth < 769;
  }

  modalOpen(type, text) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = text;
    modalRef.componentInstance.type = type;
  }

  commafy(num) {
    if (num == '' || num == undefined) {
      return '';
    }
    const str = num.toString().split('.');
    if (str[0].length >= 4) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, '$1 ');
    }
    return str.join('.');
  }

  setItem(key, value) {
    this.local.set(key, value);
  }

  getItem(key) {
    return this.local.get(key);
  }

  removeItem(key) {
    this.local.remove(key);
  }

  checkMobile() {
    return this.isMobile;
  }

  getQuoteID() {
    let timestamps = Date.now().toString();
    return 'NQR000' + (timestamps.substr(6, timestamps.length));
  }

  getCarYearData() {
    let CarYearData: CarYearData[] = [];
    const year = (new Date()).getFullYear();

    for (let i = year - 100; i < year + 2; i++) {
      CarYearData.push({
        year: i
      })
    }
    CarYearData.sort((a, b) => {
      return b.year - a.year;
    });
    return CarYearData;
  }

  /*
  *  @params=> type: number;
  * */
  getPricing() {
    const total_data = this.local.get('total_data');
    let arr = [];
    let stillwater = 0, universal = 0, plymouthAry = [], lowest_price, medium_price, highest_price,homeowner_price,
      plymouth_low_price, plymouth_lowest_price;
    if (total_data) {
      const apiData = this.getItem('api_data');
      try {
        let plymouthData = apiData["plymouth"];
        const plymouthKeys = Object.keys(plymouthData);
        for (let key in plymouthKeys) {
          let plymouthChoice = plymouthData[plymouthKeys[key]].pricing;
          this.applyTotalData('plymouth_' + plymouthKeys[key], this.commafy(plymouthChoice * 12));
          let plymouth = parseFloat(plymouthChoice.replace(',', '')) * 12;
          plymouthAry.push(plymouth)
        }
        plymouth_low_price = (plymouthAry[0] - 25 + 65 + 50) * .8;
        plymouth_lowest_price = (plymouthAry[0] - 25 - 10) * .75;
        this.applyTotalData('plymouth_low', this.commafy(plymouth_low_price.toFixed(0)));
        this.applyTotalData('plymouth_lowest', this.commafy(plymouth_lowest_price.toFixed(0)));
        arr.push(plymouth_low_price);
        arr.push(plymouth_lowest_price);
      } catch (e) {
      }
      try {

        if (apiData['universal']) {
          universal = apiData["universal"]["QuoteWrapper"]['Premium'];
          this.applyTotalData('universal', this.commafy(universal));
        }
      } catch (e) {
        universal = 0;
      }
      arr.push(universal);
      try {
        if (apiData["stillwater"]["ACORD"]['InsuranceSvcRs']['HomePolicyQuoteInqRs']
          ['MsgStatus']['MsgStatusCd'] == 'Success') {
          stillwater = apiData["stillwater"]["ACORD"]['InsuranceSvcRs']
            ['HomePolicyQuoteInqRs']['PolicySummaryInfo']["FullTermAmt"]["Amt"];
          this.applyTotalData('stillwater', this.commafy(stillwater));
        }
      } catch (e) {
        stillwater = 0;
      }
      arr.push(stillwater);
    }

    arr = arr.concat(plymouthAry);
    try {
      lowest_price = arr.filter(function (x) {
          return parseFloat(x) !== 0 && Boolean(parseFloat(x));
        })
        .reduce(function (a, b) {
          return Math.min(a, b);
        });
      try {

        medium_price = arr.filter(function (x) {
            return parseFloat(x) !== 0 && Boolean(parseFloat(x));
          })
          .sort(function (a, b) {
            return a - b
          })[1];
      } catch (e) {
        medium_price = lowest_price;
      }
      highest_price = arr.filter(function (x) {
          return parseFloat(x) !== 0 && Boolean(parseFloat(x));
        })
        .reduce(function (a, b) {
          return Math.max(a, b);
        });
    } catch (e) {
    }
    try {
      homeowner_price = arr.sort(function(x,y){return x-y})[2];
    }catch (e) {
      homeowner_price = lowest_price;
    }
    if (medium_price == undefined) medium_price = lowest_price;
    this.setItem('prices',
      JSON.stringify(
        {
          plymouthAry, stillwater, universal
        }
      )
    );
    return {
      lowest_price,
      medium_price,
      highest_price,
      homeowner_price
    }
  }

  clearValues() {
    this.removeItem('total_data');
    this.removeItem('api_data');
  }


  extractData(key) {
    const total_data = this.getItem('total_data');
    return total_data[key];
  }

  applyTotalData(key, value) {
    let total_data = this.getItem('total_data');
    if (!total_data) total_data = {};
    total_data[key] = value;
    this.setItem('total_data', total_data);
  }

  setAPIData(key, value) {
    let api_data = this.getItem("api_data");
    if (typeof api_data !== 'object' || !api_data) {
      api_data = {}
    }
    Object.assign(api_data, {[key]: value});
    this.setItem("api_data", api_data);
  }
}
