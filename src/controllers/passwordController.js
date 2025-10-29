const Password = require("../models/passwordSchema");

// Create password
exports.createPassword = async (req, res) => {
    try {
        const newPassword = await Password.create({
            ...req.body,
            userId: req.user._id, // link to logged-in user
        });
        res
            .status(201)
            .json({
                success: true,
                data: newPassword,
                message: "Password entry created successfully",
            });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Get passwords
exports.getPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.user._id }).sort({
            createdAt: 1,
        });
        res.status(200).json({ success: true, data: passwords });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    try {
        const updated = await Password.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id }, // ✅ secure update
            req.body,
            { new: true }
        );
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: "Not found or unauthorized" });

        res
            .status(200)
            .json({ success: true, data: updated, message: "Updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

// Delete password
exports.deletePassword = async (req, res) => {
    try {
        const deleted = await Password.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Not found or unauthorized" });

        res.status(200).json({ success: true, message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
