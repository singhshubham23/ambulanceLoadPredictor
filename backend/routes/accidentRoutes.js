const express = require("express");
const router = express.Router();
const controller = require("../controllers/accidentController");

router.post("/", controller.createAccident);
router.get("/", controller.getAccidents);

module.exports = router;
