const mongoose = require("mongoose");

const festivalSchema = new mongoose.Schema({
  name: String,
  startDate: Date,
  endDate: Date,
  riskMultiplier: Number
});

module.exports = mongoose.model("Festival", festivalSchema);
