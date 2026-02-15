const express = require("express");
const router = express.Router();
const controller = require("../controllers/hospitalAnalyticsController");

router.get("/load", controller.getHospitalLoadAnalytics);

module.exports = router;
