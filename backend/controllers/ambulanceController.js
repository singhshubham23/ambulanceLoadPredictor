const AmbulanceLog = require("../models/AmbulanceLog");

exports.logAmbulanceArrival = async (req, res, next) => {
  try {
    const log = await AmbulanceLog.create(req.body);
    res.status(201).json(log);
  } catch (error) {
    next(error);
  }
};

exports.getAmbulanceLogs = async (req, res, next) => {
  try {
    const logs = await AmbulanceLog.find().populate("hospital");
    res.json(logs);
  } catch (error) {
    next(error);
  }
};
