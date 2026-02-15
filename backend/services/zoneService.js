const AmbulanceLog = require("../models/AmbulanceLog");
const Accident = require("../models/Accident");
const predictionService = require("./predictionService");

exports.getZoneAnalytics = async ({ city, hours = 24 }) => {
  if (!city) {
    throw new Error("City is required");
  }

  const parsedHours = Number(hours);
  if (isNaN(parsedHours) || parsedHours <= 0) {
    throw new Error("Invalid hours parameter");
  }

  const lastTime = new Date(Date.now() - parsedHours * 60 * 60 * 1000);

  const zoneData = await AmbulanceLog.aggregate([
    { $match: { city, arrivalTime: { $gte: lastTime } } },
    { $group: { _id: "$zone", ambulanceCount: { $sum: 1 } } },
  ]);

  const accidentData = await Accident.aggregate([
    { $match: { city, date: { $gte: lastTime } } },
    {
      $group: {
        _id: "$zone",
        accidentCount: { $sum: 1 },
        avgSeverity: { $avg: "$severity" },
      },
    },
  ]);

  const zoneMap = {};

  zoneData.forEach((z) => {
    zoneMap[z._1] = {
      zone: z._id,
      ambulanceCount: z.ambulanceCount,
      accidentCount: 0,
      avgSeverity: 0,
    };
  });

  accidentData.forEach((a) => {
    if (!zoneMap[a._id]) {
      zoneMap[a._id] = {
        zone: a._id,
        ambulanceCount: 0,
        accidentCount: 0,
        avgSeverity: 0,
      };
    }
    zoneMap[a._id].accidentCount = a.accidentCount;
    zoneMap[a._id].avgSeverity = Number(a.avgSeverity?.toFixed(2) || 0);
  });

  const mlPrediction = await predictionService.calculateMLPrediction();
  const dynamicWeight = mlPrediction.predictedAccidents * 0.5;

  const zones = Object.values(zoneMap).map((z) => {
    const zoneRiskScore =
      (z.accidentCount || 0) * 2 +
      (z.ambulanceCount || 0) * 1.5 +
      (z.avgSeverity || 0) * 3 +
      dynamicWeight;

    let alertLevel = "LOW";
    if (zoneRiskScore > 70) alertLevel = "CRITICAL";
    else if (zoneRiskScore > 40) alertLevel = "HIGH";
    else if (zoneRiskScore > 20) alertLevel = "MEDIUM";

    return {
      ...z,
      zoneRiskScore: Math.round(zoneRiskScore),
      alertLevel,
    };
  });

  return zones.sort((a, b) => b.zoneRiskScore - a.zoneRiskScore);
};
