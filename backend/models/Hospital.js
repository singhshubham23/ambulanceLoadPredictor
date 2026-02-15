const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
  name: String,
  zone: String,
  city: String,
  capacity: Number
});

module.exports = mongoose.model("Hospital", hospitalSchema);
