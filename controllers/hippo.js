const request = require('request');
const config = require('../config');

class Hippo {
  getPrice(params) {
    const url = 'https://api.staging.myhippo.io/v1/herd/quote';
    let {sqft, roof_year} = params;
    let is_condo = 'n';
    let first_name =  params['personData'][0]['first_name'];
    let last_name = params['personData'][0]['last_name'];
    let street = params['address']['address'];
    let city = params['address']['locality'];
    let state = params['address']['administrative_area_level_1'];
    let postal_code = params['address']['postal_code'];
    let year_built = params['built_year'];
    if(!roof_year) roof_year = (new Date).getFullYear();
    let roof_constructed = roof_year;
    const options = {
      method: 'GET',
      url: url,
      qs: {
        auth_token: config.hippo.staging.auth_token,
        street, city, state, zip: postal_code, is_condo,
        first_name, last_name, sqft ,roof_constructed, year_built
      },
      headers: {accept: 'text/plain'}
    };
    console.log(options);
    return new Promise((resolve, reject) => {
      request(options, function (error, response, body) {
        if (error) reject({success: false, msg: error})
        else resolve({success: true, data: body});
      });
    });
  }
}

module.exports = Hippo;
