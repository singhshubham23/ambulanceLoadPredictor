const Joi = require("joi");
const predictionService = require("../services/predictionService");
const alertService = require("../services/alertService");

const predictionSchema = Joi.object({
  dayOfWeek: Joi.number().integer().min(0).max(6).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  isFestival: Joi.number().integer().min(0).max(1).required(),
  temperature: Joi.number().required(),
  rainfall: Joi.number().min(0).required()
});

exports.getEmergencyPrediction = async (req, res, next) => {
  try {

    const { error, value } = predictionSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }


    const mlBased = await predictionService.calculateMLPrediction(value);

    const alert = alertService.evaluateAlert(
      mlBased.predictedAccidents,
      mlBased.alertLevel
    );

  
    return res.json({
      success: true,
      timestamp: new Date(),
      data: {
        input: value,
        prediction: mlBased.predictedAccidents,
        alertLevel: mlBased.alertLevel,
        alert
      }
    });

  } catch (err) {
    console.error("Prediction error:", err.message);
    next(err); 
  }
};
