const express = require("express");
const router = express.Router();
const controller = require("../controllers/ambulanceController");

router.post("/", controller.logAmbulanceArrival);
router.get("/", controller.getAmbulanceLogs);

module.exports = router;
