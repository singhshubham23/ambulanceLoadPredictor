const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const controller = require("../controllers/predictionController");

const predictionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30
});

router.post("/predict", predictionLimiter, controller.getEmergencyPrediction);

module.exports = router;
