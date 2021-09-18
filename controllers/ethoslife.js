const request = require('request');
const config = require('../config');

class Ethoslife {
  async getPricing(params) {
    let coverageAmount;
    coverageAmount = 500000;
    let ethoslife_param = {
      "birthDate": params['personData'][0]['birthday'],
      "gender": "Male",
      "smoker": false,
      "health": 1,
      "state": params['address']['administrative_area_level_1'],
      "maxCoverage": coverageAmount
    };

    try {
      const ethoslife_data = await this.sendRequest(ethoslife_param);
      return ethoslife_data;
    } catch (error) {
      console.log('That did not go well.');
      console.log(error);
      return error
    }
    // console.log(ethoslife_data);
  }

  async sendRequest(param) {
    // console.log(param);
    const url = 'https://api.ethoslife.com/v2.0/calculator/quote/term/packages';
    const options = {
      'method': 'POST',
      json: true,
      'url': url,
      'responseType': 'buffer',
      'headers': {
        'Content-Type': 'application/json'
      },
      'body': param
    };
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) {
          reject({result: 'error'});
        } else {
          resolve(body);
        }
      });
    });
  }
}
module.exports = Ethoslife;
