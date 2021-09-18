const fs = require('fs');
const request = require('request');
const config = require('../config');

class NeptuneFlood {

  async getToken() {
    if (!fs.existsSync(this.tokenPath('../config'))) {
      fs.writeFileSync(this.tokenPath(), '');
    }
    const fileContent = fs.readFileSync(this.tokenPath());
    if (fileContent.length > 0) {
      await this.generateToken();

      const tokenInfo = JSON.parse(fileContent);
      const duration = tokenInfo.duration, created_at = tokenInfo.created_at;
      const current_time = new Date();
      const withduration = new Date(tokenInfo.withduration);
      // console.log("Current Date: "+current_time);
      // console.log("Token Expire: "+withduration);
      if (current_time > withduration) {
        await this.generateToken();
      }
    } else {
      await this.generateToken();
    }
    let tokenData = JSON.parse(fs.readFileSync(this.tokenPath()));
    return tokenData.token;
  }

  tokenPath() {
    return './config/neptune_token.txt';
  }

  generateToken() {
    // console.log('generate token');
    const neptuneConfig = config.neptune;
    return new Promise((resolve, reject) => {
      const options = {
        'method': 'GET',
        'url': neptuneConfig.host + '/api/v3/auth/getToken',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': neptuneConfig.key
        }
      };
      request(options, (error, response) => {
        if (error) reject(error);
        // console.log("Generated Token"+response.body);
        this.updateToken(response.body);
        resolve(response.body);
      });
    });
  }

  updateToken(token) {
    const duration = 24 * 3600 * 1000;
    const created_at = +new Date();
    const withduration = new Date(Date.now() + ( 3600 * 1000 * 24));
    fs.writeFileSync(this.tokenPath(), JSON.stringify({duration, created_at, token, withduration}));
  }

  async createQuote(params) {
    const deductible = 5000,
    yearBuilt = params['yearBuilt'];
    const date = new Date();
    const currentDate = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
    const neptuneConfig = config.neptune;
    const token = await this.getToken();
    const data = {
      "agentNo": neptuneConfig.username,
      "password": neptuneConfig.password,
      "isDirectToConsumer": true,
      "application": {
        "addr1": params['address']['address'],
        // "addr2": null,
        "city": params['address']['locality'],
        "state": params['address']['administrative_area_level_1'],
        "zip": params['address']['postal_code'],
        "yearBuilt": yearBuilt,
        "deductible": deductible,
        "hasImmediateClosing": false,
        // "effectiveDate": currentDate,
        "hasEC": false,
        "elevation": null,
        "claims": "none",
        "basementConstruction": "",
        "occupancy": "singlefamily",
        "foundationType": "",
        "constructionType": "",
        "propertyType": "",
        "numberOfSteps": 3,
        "numberOfStories": 1,
        "condoFloor": 0,
        "buildingCoverage": 250000,
        "contentCoverage": 0,
        "basementCoverage": 0,
        "poolCoverage": 0,
        "unattachedStructureCoverage": "",
        "hasOptionalTemporaryLivingExpenses": false,
        "hasOptionalReplacementCost": false,
        "firstName": params['personData'][0]['first_name'],
        "lastName": params['personData'][0]['last_name'],
        "email": "mahavir.j.mts@gmail.com",
        "phone": "9876543210",
        "isMailingSameAsProperty": true,
        "mailingAddr1": params['mailing_address']['address'],
        "mailingAddr2": null,
        "mailingCity": params['mailing_address']['locality'],
        "mailingState": params['mailing_address']['administrative_area_level_1'],
        "mailingZip": params['mailing_address']['postal_code'],
        "billInitial": "insured",
        "billOnRenewal": "insured",
        "deliveryMethod": "electronic"
      }
    };
    if (params['personData'][1]) {
      data['coApplicantFirstName'] = params['personData'][1]['first_name'];
      data['coApplicantLastName'] = params['personData'][1]['last_name'];
    }
    const options = {
      'method': 'POST',
      json: true,
      'url': neptuneConfig.host + '/api/v3/rater/quotes',
      'dataType': 'JSON',
      'headers': {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      // 'body': JSON.stringify(data)
      'body': data
    };


    return new Promise((resolve, reject) => {
      request(options, function (error, response) {
        // console.log(response);
        // console.log(error);
        if (error) reject(error);
        try {
          if ((typeof response.body) === 'object') {
            resolve(response);
          } else {
            reject(response);
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  }
}

module.exports = NeptuneFlood;
