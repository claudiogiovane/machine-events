const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Machines = new Schema({
  _id: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    required: true
  }
});

module.exports = Machines = mongoose.model("Machines", Machines);