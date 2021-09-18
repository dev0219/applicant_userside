let mongoose = require('mongoose');
let LinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  label: {
    type: String,
    required: true
  },
  register_date: {
    type: Date,
    default: Date.now()
  }
});
module.exports = mongoose.model('Link', LinkSchema);
