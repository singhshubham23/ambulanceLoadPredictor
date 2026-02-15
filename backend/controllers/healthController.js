const mongoose = require("mongoose");
const Accident = require("../models/Accident");
const AmbulanceLog = require("../models/AmbulanceLog");

exports.healthCheck = async (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date()
  });
};

exports.systemMetrics = async (req, res) => {
  const accidents = await Accident.countDocuments();
  const ambulances = await AmbulanceLog.countDocuments();

  res.json({
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    totalAccidents: accidents,
    totalAmbulanceLogs: ambulances,
    memoryUsage: process.memoryUsage().rss
  });
};
