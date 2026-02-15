const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticate");
const {
    createMeter,
    getMeters,
    deleteMeter,
    updateMeter,
} = require("../controllers/meterController");

router.post("/createMeter", authenticate, createMeter);
router.get("/getMeters", authenticate, getMeters);
router.delete("/deleteMeter/:id", authenticate, deleteMeter);
router.put("/updateMeter/:id", authenticate, updateMeter);

module.exports = router;
