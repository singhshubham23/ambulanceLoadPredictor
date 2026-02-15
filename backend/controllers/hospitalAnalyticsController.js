const Hospital = require("../models/Hospital");
const AmbulanceLog = require("../models/AmbulanceLog");

exports.getHospitalLoadAnalytics = async (req, res, next) => {
  try {
    const hospitals = await Hospital.find();

    const results = await Promise.all(
      hospitals.map(async (hospital) => {
        const arrivals = await AmbulanceLog.countDocuments({
          hospital: hospital._id
        });

        const loadPercent = Math.round(
          (arrivals / hospital.capacity) * 100
        );

        let status = "NORMAL";
        if (loadPercent > 90) status = "CRITICAL";
        else if (loadPercent > 70) status = "HIGH";
        else if (loadPercent > 40) status = "MEDIUM";

        return {
          hospital: hospital.name,
          zone: hospital.zone,
          capacity: hospital.capacity,
          arrivals,
          loadPercent,
          status
        };
      })
    );

    res.json(results);
  } catch (error) {
    next(error);
  }
};
