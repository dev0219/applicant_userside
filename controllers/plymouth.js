const config = require('../config');

class Plymouth {
  async getPricing(params) {
    let personData = params['personData'], city = params['address']['locality'],
      state = params['address']['administrative_area_level_1'], postal_code = params['address']['postal_code'],
      street = params['address']['address'], mode = 0;
    try {
      let firstname, lastname, birthday;
      let insurance_type = ['HO3', 'HO6'];
      firstname = personData[0]['first_name'], lastname = personData[0]['last_name'], birthday = personData[0]['birthday'];
      let response = {};
      let address = street + ', ' + city + ', ' + state + ' ' + postal_code;
      let type = insurance_type[mode];
      response = await this.doScraping({
        firstname, lastname, birthday, address, type
      });
      return response;
    } catch (e) {
      return {result: 'error', data: []};
    }
  }

  doScraping(requestData) {
    const {firstname, lastname, birthday, address, type} = requestData;
    const puppeteer = require('puppeteer');

    return new Promise(async (resolve, reject) => {
      const browser = await puppeteer.launch(
        {args: ['--no-sandbox', '--disable-setuid-sandbox']}
      );
      const url = 'https://homeowners.plymouthrock.com/consumer/home/#/createQuote?' +
        'fullAddress=' + address + '&' + 'policyType=' + type +
        '&firstName=' + firstname + '&lastName=' + lastname +
        '&numOfUnit=undefined&' + 'dob=' + birthday +
        '&sourceOfEntry=WIDGET&agencyCode=' + config.plymouth.code +
        '&agencyPhoneNum=' + config.plymouth.phone_number +
        '&utm_campaign=IA_CV_widget&utm_content=Basicbanner';
      let isError = false;
      const detailPage = await browser.newPage({headless: false});
      console.log(url,'url');
      await detailPage.goto(url, {waitUntil: 'load', timeout: 0})
        .catch((e) => {
          console.log(e);
          isError = true;
        });
      if (isError) {
        browser.close();
        reject({result: 'error', data: []});
        return;
      }
      await detailPage.waitForSelector('.plan-card-title');
      const returnAry = await detailPage.evaluate(() => {
        function camelize(str) {
          return str.replace(/(?:^\w|[A-Z]|\b\w)/g,
            function (word, index) {
              return index == 0 ? word.toLowerCase() : word.toUpperCase();
            }).replace(/\s+/g, '');
        }

        let totalAry = {};
        const elems = document.getElementsByClassName('card-block');
        for (let j = 0; j < elems.length; j++) {
          let subAry = {};
          const title = $(elems[j]).children('.plan-card-title').children(0)
            .children('.card-title')[0].innerText.toLowerCase();
          const pricing = $(elems[j]).children('.plan-card-title')
            .children(1).children()[1].children[1].innerText;
          const benefitElem = $(elems[j]).children()[2];
          const benefits = benefitElem.children[0].children[0].children;
          subAry.pricing = pricing;
          for (let i = 0; i < benefits.length; i++) {
            try {
              const key = camelize(benefits[i].children[0]
                .children[1].children[0].innerText);
              let benefitPrice = benefits[i].children[0]
                .children[1].children[2].innerText;
              benefitPrice = Number(benefitPrice
                .replace(/[^0-9.-]+/g, ""));
              subAry[key] = benefitPrice;
            } catch (e) {
            }
          }
          totalAry[title] = subAry;
        }
        return totalAry;
      });
      await browser.close();
      resolve(returnAry);
    });
  }
}

module.exports = Plymouth;
