const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
    createMeter,
    getMeters,
    deleteMeter,
    updateMeter,
} = require("../controllers/meterReadingController");

router.post("/createMeterReading/:meterId", authenticate, createMeter);
router.get("/getMetersReading/:meterId", authenticate, getMeters);
router.delete("/deleteMeterReading/:id", authenticate, deleteMeter);
router.put("/updateMeterReading/:id", authenticate, updateMeter);

module.exports = router;
