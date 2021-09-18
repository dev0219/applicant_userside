let mongoose = require('mongoose');
let GroupSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    unique: true
  },

  value: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});
module.exports = mongoose.model('Group', GroupSchema);
