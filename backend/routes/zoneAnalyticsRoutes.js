const express = require("express");
const router = express.Router();
const controller = require("../controllers/zoneAnalyticsController");

router.get("/pressure", controller.getZoneDensity);

module.exports = router;
