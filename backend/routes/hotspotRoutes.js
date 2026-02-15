const express = require("express");
const router = express.Router();
const controller = require("../controllers/hotspotController");

router.get("/", controller.getAccidentHotspots);

module.exports = router;
