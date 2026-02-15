const Password = require("../models/passwordSchema");

// 1. Get passwords (Sorted by 'order')
exports.getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.user._id }).sort({
            order: 1, // Ascending order: 0, 1, 2...
            createdAt: 1,
        });
        res.status(200).json({ success: true, data: passwords });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// 2. Reorder passwords (Saves new sequence to DB)
exports.reorderPasswords = async (req, res) => {
    try {
        const { newOrderIds } = req.body; // Array of IDs in the new order

        // Bulk operations are efficient for multiple updates
        const bulkOps = newOrderIds.map((id, index) => ({
            updateOne: {
                filter: { _id: id, userId: req.user._id },
                update: { order: index },
            },
        }));

        await Password.bulkWrite(bulkOps);

        res
            .status(200)
            .json({ success: true, message: "New order saved successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to reorder" });
    }
};

// 3. Create password
exports.createPassword = async (req, res) => {
    try {
        // Option: Nayi entry ko end mein rakhne ke liye count use kar sakte hain
        const count = await Password.countDocuments({ userId: req.user._id });
        const newPassword = await Password.create({
            ...req.body,
            userId: req.user._id,
            order: count,
        });
        res.status(201).json({
            success: true,
            data: newPassword,
            message: "App Created successfully",
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// ... updatePassword and deletePassword logic remains same as you provided
exports.updatePassword = async (req, res) => {
    try {
        const updated = await Password.findOneAndUpdate(
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
                message: "App Updated successfully",
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

exports.deletePassword = async (req, res) => {
    try {
        const deleted = await Password.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deleted)
            return res.status(404).json({ success: false, message: "Not found" });
        res
            .status(200)
            .json({ success: true, message: "App Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
