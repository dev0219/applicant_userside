const request = require('request');
const config = require('../config');
const dateFormat = require('dateformat');
const path = require('path');
const appDir = path.dirname(require.main.filename);
const swig = require('swig');
const soap = require('strong-soap').soap;
const XMLHandler = soap.XMLHandler;
const xmlHandler = new XMLHandler();
const ApiHelper = require('../helpers/api-helper');
const apiHelper = new ApiHelper();
swig.setDefaults(
  {
    loader: swig.loaders.fs(__dirname + '/apiTemplates')
  }
);

class StillWater {
  async getPricing(params) {
    /* let {
      email, phone,
      sqft, ac_year, electric_year,
      plumbing_year, roof_year, construction_type,
      roof_type, personData, building_type,
      roof_status, exterior_type, is_basement, foundation_type
    } = params; */

    let {
      sqft, ac_year, electric_year,
      plumbing_year, roof_year, construction_type,
      roof_type, personData, building_type,
      roof_status, exterior_type, is_basement, foundation_type
    } = params;

    const city = params['address']['locality'],
      state = params['address']['administrative_area_level_1'],
      postal_code = params['address']['postal_code'],
      street = params['address']['address'],
      year_built = params['yearBuilt'], mode = 0, dwell_coverage = 25000;
    let now = new Date(),
      effective_date = dateFormat(now, 'yyyy-mm-dd');
    let pre_format_expiration_date =
      ((new Date(effective_date)).getFullYear() + 1) + '-' +
      ((new Date(effective_date)).getMonth() + 1) + '-' +
      (new Date(effective_date)).getDate();
    let expiration_date = dateFormat(pre_format_expiration_date, 'yyyy-mm-dd'),
      commondata = apiHelper.getAPICommonData(effective_date);
    const purchaseDt = dateFormat(now, "yyyy"),
      yearOccupancy = dateFormat(now, "yyyy");
    let firstname = personData[0]['first_name'],
      lastname = personData[0]['last_name'],
      birthday = dateFormat(personData[0]['birthday'], 'yyyy-mm-dd');
    const stateData = config.universalData.states
      .filter((data) => {
        return data.StateCode === state.toUpperCase();
      });
    const state_id = stateData[0]['StateId'];
    const roof_data = [
      -1, 15001, 15013, 15003, 15009, 15006, 15001, 15008, 15004, 15001
    ];
    roof_type = roof_data[roof_type];
    const construction_data = [-1, 'Frame', -1, 'Masonry', -1];
    construction_type = construction_data[construction_type];
    const roofshape_data = {
      flat: 'Flat',
      peaked: 'Gable'
    };
    const foundation_data = [-1, 'Basement', 'Crawl Space', 'Slab', -1];
    foundation_type = foundation_data[foundation_type];
    const roofShapeType = roofshape_data[roof_status];
    // phone = this.formatPhoneNumber(phone);
    sqft = sqft;
    /* const commonObj = {
      construction_type, foundation_type, building_type, roof_type, roofShapeType,
      exterior_type, is_basement, personData, city, state, postal_code, state_id,
      street, firstname, lastname, email, birthday, year_built,
      sqft, mode, dwell_coverage, ac_year, electric_year,
      plumbing_year, roof_year, effective_date,
      expiration_date, yearOccupancy, purchaseDt, phone
    }; */
    const commonObj = {
      construction_type, foundation_type, building_type, roof_type, roofShapeType,
      exterior_type, is_basement, personData, city, state, postal_code, state_id,
      street, firstname, lastname, birthday, year_built,
      sqft, mode, dwell_coverage, ac_year, electric_year,
      plumbing_year, roof_year, effective_date,
      expiration_date, yearOccupancy, purchaseDt
    };

    let response = {}, stillwater_data;
    const stillwater_quoteTemplate =
      swig.compileFile(appDir + '/config/templates/stillwater_api_getpricing_request.xml');
    const stillwater_content = stillwater_quoteTemplate(commonObj);
    const stillwater_param = commondata + stillwater_content;
    stillwater_data = await this.sendRequest(stillwater_param);
    response = xmlHandler.xmlToJson(null, stillwater_data, null);
    if (response && response['ACORD']['InsuranceSvcRs']["HomePolicyQuoteInqRs"]['MsgStatus']['MsgStatusCd'] !== "Rejected") {
      return response;
    }
    // console.log(response['ACORD']['InsuranceSvcRs']["HomePolicyQuoteInqRs"]);
    return {
      status: 400,
      message: 'Invalid request'
    };
  }

  formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return match[1] + '-' + match[2] + '-' + match[3]
    }
    return null
  }

  async sendRequest(param) {
    console.log(param,'this is the param param')
    const options = {
      method: 'POST',
      url: config.ApiInfo.HomeAPIURL,
      headers:
        {
          Host: 'api-qua.stillwaterinsurance.com',
          Accept: '*/*',
          'Content-Type': 'text/xml',
          Authorization: "Basic " + new Buffer.from(
            config.ApiInfo.accountName + ":" + config.ApiInfo.homeAPIToken
          ).toString("base64")
        },
      body: param
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

module.exports = StillWater;
