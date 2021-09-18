const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
  firstname:{
    type: String,
    required: false
  },
  lastname:{
    type: String,
    required: false
  }, 
  additional_email:{
    type:String,
    required:false
  },
  address:{
    type: String,
    required: false
  },
  phone:{
    type: String,
    required: false
  },
  agencyname:{
    type: String,
    required: false
  },
  agentimage:{
    type: String,
    required: false
  },
  agencyimage:{
    type: String,
    required: false
  },
  householdimage:{
    type: String,
    required: false
  },
  introimage:{
    type: String,
    required: false
  },
  propertyimage:{
    type: String,
    required: false
  },
  emailtext:{
    type: String,
    required: false
  },
  role:{
    type: String,
    required: false
  },
  password:{
    type: String,
    required: false
  },
  email:{
    type: String,
    required: false
  },
  link:{
    type: String,
    required: false
  },
  spreadsheet_id:{
    type:String,
    required:false
  },
  short_app_sheet_id:{
    type:String,
    required:false
  },
  life_app_sheet_id:{
    type:String,
    required:false
  },
  full_app_sheet_id:{
    type:String,
    required:false
  },
  plymouth_api:{
    type:String,
    required:false
  },
  universal_api:{
    type:String,
    required:false
  },
  stillwater_api:{
    type:String,
    required:false
  },
  neptuneflood_api:{
    type:String,
    required:false
  },
  havenlife_api:{
    type:String,
    required:false
  },
  ethoslife_api:{
    type:String,
    required:false
  },
  hippo_api:{
    type:String,
    required:false
  },
  api_status:{
    type:String,
    required:false
  },
  created_at: {
    type: Date,
    required: false
  }
});

const Users = module.exports = mongoose.model('users', UserSchema);
