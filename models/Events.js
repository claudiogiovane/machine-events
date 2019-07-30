const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Events = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  machine_id: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  }, 
  timestamp: {
    type: String,
    required: true
  }
});

module.exports = Events = mongoose.model("Events", Events);