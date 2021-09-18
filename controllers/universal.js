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

class Universal {
  async getPricing(params) {
    /* let {
      email, phone, ac_year, electric_year, plumbing_year, roof_year, sqft, personData, building_type,
      construction_type, exterior_type, foundation_type, roof_type, roof_status, is_basement
    } = params; */

    let {
      ac_year, electric_year, plumbing_year, roof_year, sqft, personData, building_type,
      construction_type, exterior_type, foundation_type, roof_type, roof_status, is_basement
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
    personData[0]['birthday'] = dateFormat(personData[0]['birthday'], 'yyyy-mm-dd');

    try {
      personData[1]['birthday'] = dateFormat(personData[1]['birthday'], 'yyyy-mm-dd');
    }catch (e) {

    }
    let firstname = personData[0]['first_name'],
      lastname = personData[0]['last_name'],
      birthday = personData[0]['birthday'];
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
    sqft = sqft;
    /* const commonObj = {
      construction_type, foundation_type, building_type, roof_type,
      roofShapeType, exterior_type, is_basement, personData,
      city, state, postal_code, state_id,
      street, firstname, lastname, email, birthday, year_built,
      sqft, mode, dwell_coverage, ac_year, electric_year,
      plumbing_year, roof_year, effective_date,
      expiration_date, yearOccupancy, purchaseDt, phone
    }; */

    const commonObj = {
      construction_type, foundation_type, building_type, roof_type,
      roofShapeType, exterior_type, is_basement, personData,
      city, state, postal_code, state_id,
      street, firstname, lastname, birthday, year_built,
      sqft, mode, dwell_coverage, ac_year, electric_year,
      plumbing_year, roof_year, effective_date,
      expiration_date, yearOccupancy, purchaseDt
    };
    let response, universal_data;
    if (construction_type !== -1 && roof_type !== -1 && foundation_type !== -1) {
      universal_data = await this.sendRequest(commonObj);
      let convertedUniversalData, universalResponseData;
      try {
        convertedUniversalData = xmlHandler.xmlToJson(null, universal_data, null);
        universalResponseData =
          convertedUniversalData['Body']['upcicProcessQuoteResponse']['upcicProcessQuoteResult'];
      } catch (e) {
        return {
          data: [],
          result: 'error',
          msg: 'An error occurred. Please try again later.'
        }
      }
      if (convertedUniversalData && universalResponseData) {
        response = xmlHandler.xmlToJson(null, universalResponseData, null);
        return response;
      }
      return {
        data: [],
        result: 'error',
        msg: 'An error occurred. Please try again later.'
      }
    }
    return {
      data: [],
      result: 'error',
      msg: 'Please select the correct data.'
    }
  }

  async sendRequest(params) {
    return new Promise((resolve, reject) => {
      soap.createClient('http://qa.atlasbridge.com/UniversalDirectRater/UDirectRating.svc?wsdl', {},
        function (err, client) {
          if (!client) {
            reject({status: 400, message: 'Service is not available now'});
            return;
          }
          const method = client['upcicLogin'];

          method({
              version: '1.0',
              username: config.universalUsername,
              password: config.universalPwd
            },
            function (err, result, envelope, soapHeader) {
              if (!result || err) {
                reject({success: false, err: err});
                return;
              }
              const tokenData = result['upcicLoginResult'];

              params = {...params, tokenData};
              const quoteTemplate = swig.compileFile(appDir +
                '/config/templates/universal_api_getpricing_request.xml');
              const quoteData = quoteTemplate(params);
              const options = {
                method: 'POST',
                url: 'https://qa.atlasbridge.com/UniversalDirectRater/UDirectRating.svc',
                qs: {wsdl: ''},
                headers:
                  {
                    SOAPAction: 'http://tempuri.org/IRatingService/upcicProcessQuote',
                    'content-type': 'text/xml;charset="utf-8"'
                  },
                body: quoteData
              };
              request(options, function (error, response, body) {
                if (error) reject({result: 'error'});
                resolve(body);
              });
            });
        });
    });
  }
}

module.exports = Universal;
