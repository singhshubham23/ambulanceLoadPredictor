const Joi = require("joi");
const zoneService = require("../services/zoneService");
const alertStateService = require("../services/alertStateService");


const querySchema = Joi.object({
  city: Joi.string().trim().required(),
  hours: Joi.number().integer().min(1).max(168).optional() // max 7 days
});

exports.getZoneDensity = async (req, res, next) => {
  try {
  
    const { error, value } = querySchema.validate(req.query);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    const { city } = value;
    const hours = value.hours || 24;


    const zones = await zoneService.getZoneAnalytics({ city, hours });

   
    const alerts = [];
    const io = req.app.get("io");

    for (const z of zones) {
      if (z.alertLevel === "CRITICAL" || z.alertLevel === "HIGH") {

        const changed = alertStateService.hasAlertChanged(
          `${city}_${z.zone}`,
          z.alertLevel
        );

        if (changed) {
          const alertObj = {
            zone: z.zone,
            alertLevel: z.alertLevel,
            message: `Emergency surge detected in ${z.zone}`
          };

          alerts.push(alertObj);
        }
      }
    }

    if (io && alerts.length > 0) {
      io.emit("zoneAlert", alerts);
    }


    return res.json({
      success: true,
      timestamp: new Date(),
      city,
      hours,
      data: {
        totalZones: zones.length,
        zones,
        alerts
      }
    });

  } catch (err) {
    console.error("Zone analytics error:", err);
    next(err); 
  }
};
