const Accident = require("../models/Accident");

exports.createAccident = async (req, res, next) => {
  try {
    const accident = await Accident.create(req.body);
    res.status(201).json(accident);
  } catch (error) {
    next(error);
  }
};

exports.getAccidents = async (req, res, next) => {
  try {
    const accidents = await Accident.find();
    res.json(accidents);
  } catch (error) {
    next(error);
  }
};
