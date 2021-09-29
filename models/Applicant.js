let mongoose = require('mongoose');
let ApplicantSchema = new mongoose.Schema({
  name:{
    type:String,
    required:false
  },
  householdmember : [{
    name : String,
    birthday : String,
    license : String
     }],
  email: {
    type: String,
    required: true
  },
  phone:{
    type:String,
    required:false
  },
  agentemail:{
    type: String,
    required:true
  },
  insuranceType:{
    type:String,
    required:true
  },
  address: {
    type: String,
    required: true
  },
  currentadress:{
    type: String,
    required: true
  },
  quote_id: {
    type: String,
    required: false
  },
  link: {
    type: String,
    required: false
  },
  status: {
    type:String,
    required: false
  },
  carrierType:{
    type: String,
    required: false
  },
  requestorcomments:{
    type:String,
    required:false
  },
  mailingadress:{
    type:String,
    required:false
  },
  vin:[{
    vininfo : String,
     }],
  roof_shape: {
   type:String,
   required:false
  },
  dog:{
    type:String,
    required:false
  },
  roof_type:{
    type:String,
    required:false
  },
  foundation: {
    type:String,
    required:false
  },
  current_auto_premiun:{
    type:String,
    required:false
  },
  selectedUserType:{
    type:String,
    required:false
  },
  yearBuilt:{
    type:String,
    required:false
  },
  sqft:{
    type:String,
    required:false
  },
  question5:{
    type:String,
    required:false
  },
  answer5:{
    type:String,
    required:false
  },
  question6:{
    type:String,
    required:false
  },
  answer6:{
    type:String,
    required:false
  },
  cardata : [{
    cardatayear : String,
    cartype : String,
    carmodel : String
     }],
  shortrentals:{
    type:Boolean,
    required:false
  },
  propertyown:{
    type:Boolean,
    required:false
  },
  multipleunit:{
    type:Boolean,
    required:false
  },
  insuranceclaims:{
    type:Boolean,
    required:false
  },
  policycancell:{
    type:Boolean,
    required:false
  },
  swimmingpool:{
    type:Boolean,
    required:false
  },
  security_system:{
    type:String,
    required:false
  },
  register_date :{
    type: String,
    required: false
  }
});
module.exports = mongoose.model('Applicant', ApplicantSchema);
