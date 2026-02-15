const Meter = require("../models/meterSchema");

exports.getMeters = async (req, res) => {
    try {
        const meters = await Meter.find({ userId: req.user._id }).sort({
            order: 1,
            createdAt: 1,
        });
        res.status(200).json({ success: true, data: meters });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.createMeter = async (req, res) => {
    try {
        const count = await Meter.countDocuments({ userId: req.user._id });
        const newMeter = await Meter.create({
            ...req.body,
            userId: req.user._id,
            order: count,
        });
        res.status(201).json({
            success: true,
            data: newMeter,
            message: "Meter Created successfully",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteMeter = async (req, res) => {
    try {
        const deleted = await Meter.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deleted)
            return res.status(404).json({ success: false, message: "Not found" });
        res
            .status(200)
            .json({ success: true, message: "Meter Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateMeter = async (req, res) => {
    try {
        const updated = await Meter.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true },
        );
        if (!updated)
            return res.status(404).json({ success: false, message: "Not found" });
        res
            .status(200)
            .json({
                success: true,
                data: updated,
                message: "Meter Updated successfully",
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
