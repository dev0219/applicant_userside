let mongoose = require('mongoose');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let config = require('../config');
let UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  link: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },

  is_admin: {
    type: Boolean,
    default: false
  },
  profilePic:{
    type:String,
    default: ''
  },
  hash: String,
  salt: String
});
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
  return this.hash === hash;
};
UserSchema.methods.generateJwt = function () {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    name: this.name,
    link: this.link,
    phone: this.phone,
    label: this.label,
    profilePic: this.profilePic,
    is_admin: this.is_admin,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.secret);
};
module.exports = mongoose.model('User', UserSchema);
