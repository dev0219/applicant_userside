let mongoose = require('mongoose');
let ApplicantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone:{
    type:String,
    required:false
  },
  license:{
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
  birthday:{
   type:String,
   required:false
  },
  vin:{
    type:String,
    required:false
  },
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
  cardatayear:{
    type:String,
    required:false
  },
  cartype:{
    type:String,
    required:false
  },
  carmodel:{
    type:String,
    required:false
  },
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
