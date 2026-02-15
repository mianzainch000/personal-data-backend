const MeterReading = require("../models/meterReadingSchema");

// 1. Get readings for a SPECIFIC meter
exports.getMeters = async (req, res) => {
    try {
        const { meterId } = req.params;
        if (!meterId)
            return res.status(400).json({ success: false, message: "ID missing" });

        const readings = await MeterReading.find({
            userId: req.user._id,
            meterId: meterId,
        }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: readings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Create reading
exports.createMeter = async (req, res) => {
    try {
        const { meterId } = req.params;
        const newReading = await MeterReading.create({
            ...req.body,
            unit: req.body.unit, // Mapping units to unit
            meterId: meterId,
            userId: req.user._id,
        });
        res
            .status(201)
            .json({
                success: true,
                data: newReading,
                message: "Meter Reading Added successfully",
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 3. Delete Reading
exports.deleteMeter = async (req, res) => {
    try {
        const deleted = await MeterReading.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deleted)
            return res.status(404).json({ success: false, message: "Not found" });
        res
            .status(200)
            .json({ success: true, message: "Meter Reading Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 4. Update Reading
exports.updateMeter = async (req, res) => {
    try {
        const updated = await MeterReading.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { ...req.body, unit: req.body.units || req.body.unit },
            { new: true },
        );
        if (!updated)
            return res.status(404).json({ success: false, message: "Not found" });
        res
            .status(200)
            .json({
                success: true,
                data: updated,
                message: "Meter Reading Updated successfully",
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
